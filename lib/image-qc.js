/**
 * Structural inspection of PNG and JPEG containers.
 *
 * This answers "is this file the thing it claims to be", not "is this image any good".
 * It never decodes pixels, never calls a vision model, and never sends a byte anywhere.
 * The report says so in three fixed fields, because a structural result that reads like
 * a diagnostic one is worse than no result.
 */

export const NOT_PERFORMED = Object.freeze([
  'pixel inspection',
  'lesion or pathology assessment',
  'image quality scoring',
  'vision model inference',
])

function fail(code, message) {
  const error = new Error(message)
  error.code = code
  throw error
}

const PNG_SIGNATURE = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]

function isPng(bytes) {
  return PNG_SIGNATURE.every((byte, index) => bytes[index] === byte)
}

function isJpeg(bytes) {
  return bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff
}

/** Walk PNG chunks to find IHDR and any embedded metadata. */
function inspectPng(bytes) {
  let offset = 8
  let header
  const chunks = []
  let truncated = false
  while (offset + 8 <= bytes.length) {
    const length = bytes.readUInt32BE(offset)
    const type = bytes.toString('ascii', offset + 4, offset + 8)
    chunks.push(type)
    if (type === 'IHDR' && offset + 16 <= bytes.length) {
      header = {
        width: bytes.readUInt32BE(offset + 8),
        height: bytes.readUInt32BE(offset + 12),
        bitDepth: bytes[offset + 16],
        colourType: bytes[offset + 17],
        interlace: bytes[offset + 20],
      }
    }
    if (offset + 12 + length > bytes.length) { truncated = true; break }
    offset += 12 + length
    if (type === 'IEND') break
  }
  if (!header) fail('IMAGE_INVALID', 'The PNG has no readable IHDR chunk.')
  const colourTypes = { 0: 'greyscale', 2: 'rgb', 3: 'palette', 4: 'greyscale+alpha', 6: 'rgba' }
  return {
    format: 'png',
    width: header.width,
    height: header.height,
    bitDepth: header.bitDepth,
    colourModel: colourTypes[header.colourType] ?? 'unknown(' + header.colourType + ')',
    interlaced: header.interlace === 1,
    hasAlpha: header.colourType === 4 || header.colourType === 6,
    embeddedMetadata: chunks.filter(type => type === 'tEXt' || type === 'iTXt' || type === 'zTXt' || type === 'iCCP'),
    truncated,
    chunkCount: chunks.length,
  }
}

/** Read the first JPEG frame header without decoding any pixels. */
function inspectJpeg(bytes) {
  let offset = 2
  let frame
  const markers = []
  while (offset + 4 <= bytes.length) {
    if (bytes[offset] !== 0xff) { offset += 1; continue }
    const marker = bytes[offset + 1]
    if (marker === 0xd8 || marker === 0xd9) { offset += 2; continue }
    const length = bytes.readUInt16BE(offset + 2)
    markers.push(marker.toString(16))
    // SOF0..SOF3, SOF5..SOF7, SOF9..SOF11, SOF13..SOF15 carry the frame size.
    const isFrame = marker >= 0xc0 && marker <= 0xcf && marker !== 0xc4 && marker !== 0xc8 && marker !== 0xcc
    if (isFrame && offset + 9 <= bytes.length) {
      frame = {
        height: bytes.readUInt16BE(offset + 5),
        width: bytes.readUInt16BE(offset + 7),
        components: bytes[offset + 9],
      }
      break
    }
    if (length < 2) break
    offset += 2 + length
  }
  if (!frame) fail('IMAGE_INVALID', 'The JPEG has no readable frame header.')
  return {
    format: 'jpeg',
    width: frame.width,
    height: frame.height,
    components: frame.components,
    colourModel: frame.components === 1 ? 'greyscale' : frame.components === 3 ? 'ycbcr' : frame.components === 4 ? 'cmyk' : 'unknown',
    hasAlpha: false,
    embeddedMetadata: markers.filter(marker => marker === 'e1' || marker === 'e2' || marker === 'ed'),
    truncated: false,
    chunkCount: markers.length,
  }
}

/**
 * Inspect an image's container structure.
 *
 * @param {Buffer} bytes - the file's bytes
 * @param {object} [expected] - declared width, height and minimum encoded size
 */
export function inspectImage(bytes, { expected } = {}) {
  if (!Buffer.isBuffer(bytes) || bytes.length < 12) fail('IMAGE_INVALID', 'The file is too small to be an image.')
  let structural
  if (isPng(bytes)) structural = inspectPng(bytes)
  else if (isJpeg(bytes)) structural = inspectJpeg(bytes)
  else {
    return Object.freeze({
      status: 'blocked',
      reason: 'Only PNG and JPEG containers are inspected; this format is not guessed at.',
      pixelInspection: 'not-performed',
      diagnosticUse: 'not-authorized',
      visionModelUsed: false,
      notPerformed: NOT_PERFORMED,
    })
  }

  const checks = []
  if (expected?.width !== undefined) {
    checks.push({ id: 'width', ok: structural.width === expected.width, expected: expected.width, actual: structural.width })
  }
  if (expected?.height !== undefined) {
    checks.push({ id: 'height', ok: structural.height === expected.height, expected: expected.height, actual: structural.height })
  }
  if (expected?.minBytes !== undefined) {
    checks.push({ id: 'minBytes', ok: bytes.length >= expected.minBytes, expected: expected.minBytes, actual: bytes.length })
  }
  const failed = checks.filter(check => !check.ok)

  return Object.freeze({
    status: failed.length ? 'fail' : 'pass',
    ...structural,
    bytes: bytes.length,
    sha256: null,
    aspectRatio: structural.height ? Number((structural.width / structural.height).toFixed(3)) : null,
    ...(checks.length ? { checks: Object.freeze(checks) } : {}),
    ...(failed.length ? { failures: Object.freeze(failed.map(check => check.id)) } : {}),
    // Fixed strings rather than booleans a caller might skip past.
    pixelInspection: 'not-performed',
    diagnosticUse: 'not-authorized',
    visionModelUsed: false,
    notPerformed: NOT_PERFORMED,
    note: 'This reads the container only. It says nothing about what the image shows.',
  })
}

export default { inspectImage, NOT_PERFORMED }
