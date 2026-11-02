import test from 'node:test'
import assert from 'node:assert/strict'
import { deflateSync } from 'node:zlib'
import { inspectImage } from './image-qc.js'

/** Build a real PNG: signature, IHDR, IDAT, IEND with correct CRCs. */
function makePng(width, height, { bitDepth = 8, colourType = 2 } = {}) {
  const crcTable = Array.from({ length: 256 }, (_, n) => {
    let c = n
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1
    return c >>> 0
  })
  const crc32 = buffer => {
    let c = 0xffffffff
    for (const byte of buffer) c = crcTable[(c ^ byte) & 0xff] ^ (c >>> 8)
    return (c ^ 0xffffffff) >>> 0
  }
  const chunk = (type, data) => {
    const length = Buffer.alloc(4)
    length.writeUInt32BE(data.length)
    const typeAndData = Buffer.concat([Buffer.from(type, 'ascii'), data])
    const crc = Buffer.alloc(4)
    crc.writeUInt32BE(crc32(typeAndData))
    return Buffer.concat([length, typeAndData, crc])
  }
  const ihdr = Buffer.alloc(13)
  ihdr.writeUInt32BE(width, 0)
  ihdr.writeUInt32BE(height, 4)
  ihdr[8] = bitDepth
  ihdr[9] = colourType
  ihdr[10] = 0
  ihdr[11] = 0
  ihdr[12] = 0
  const raw = Buffer.alloc(height * (1 + width * (colourType === 2 ? 3 : 1)))
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', ihdr),
    chunk('IDAT', deflateSync(raw)),
    chunk('IEND', Buffer.alloc(0)),
  ])
}

test('a well-formed PNG reports its real dimensions', () => {
  const report = inspectImage(makePng(16, 10))
  assert.equal(report.status, 'pass')
  assert.equal(report.format, 'png')
  assert.equal(report.width, 16)
  assert.equal(report.height, 10)
  assert.equal(report.colourModel, 'rgb')
  assert.equal(report.aspectRatio, 1.6)
})

test('declared dimensions that disagree fail the check', () => {
  const report = inspectImage(makePng(16, 10), { expected: { width: 32, height: 10 } })
  assert.equal(report.status, 'fail')
  assert.deepEqual([...report.failures], ['width'])
})

test('an encoded size below the expected minimum fails', () => {
  const bytes = makePng(4, 4)
  const report = inspectImage(bytes, { expected: { minBytes: bytes.length + 100 } })
  assert.equal(report.status, 'fail')
  assert.deepEqual([...report.failures], ['minBytes'])
})

test('a truncated PNG is detected from its container structure', () => {
  const full = makePng(8, 8)
  const report = inspectImage(full.subarray(0, full.length - 20))
  // The IHDR is still readable, so the dimensions are known; the container is short.
  assert.equal(report.truncated, true)
})

test('an unsupported format is blocked, not guessed at', () => {
  const report = inspectImage(Buffer.from('<svg xmlns="http://www.w3.org/2000/svg"></svg>'))
  assert.equal(report.status, 'blocked')
  assert.match(report.reason, /PNG and JPEG/)
})

test('every report states what was not done', () => {
  const report = inspectImage(makePng(4, 4))
  // A structural result that reads like a diagnostic one is worse than no result.
  assert.equal(report.pixelInspection, 'not-performed')
  assert.equal(report.diagnosticUse, 'not-authorized')
  assert.equal(report.visionModelUsed, false)
  assert.ok(report.notPerformed.length >= 4)
})

test('a file too small to be an image is refused', () => {
  assert.throws(() => inspectImage(Buffer.from([1, 2, 3])), /too small/)
})
