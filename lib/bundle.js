/**
 * Reproducibility bundle: a self-contained, hash-stamped snapshot of one workflow run.
 *
 * A bundle is evidence of what THIS tool recorded. It is not a certification and not a
 * clinical validation artefact.
 */
import { createHash } from 'node:crypto'
import { verifyProvenance } from './provenance.js'
import { verifySignature } from './signing.js'

export const BUNDLE_FORMAT = 'dsh-research-workbench.bundle'
export const BUNDLE_VERSION = 1
export const MAX_DEPTH = 24

// The depth guard matters because a bundle arrives from an untrusted source: a deeply
// nested payload would otherwise recurse until the stack overflows, which is a crash
// rather than a verdict.
function canonical(value, depth = 0) {
  if (depth > MAX_DEPTH) throw new TypeError(`bundle must not nest deeper than ${MAX_DEPTH} levels`)
  if (value === null || typeof value === 'string' || typeof value === 'boolean') return JSON.stringify(value)
  if (typeof value === 'number') {
    if (!Number.isFinite(value)) throw new TypeError('bundle must contain only finite numbers')
    return JSON.stringify(value)
  }
  if (Array.isArray(value)) return '[' + value.map(item => canonical(item, depth + 1)).join(',') + ']'
  if (typeof value !== 'object') throw new TypeError('bundle must contain only JSON values')
  const entries = Object.keys(value).sort().map(key => JSON.stringify(key) + ':' + canonical(value[key], depth + 1))
  return '{' + entries.join(',') + '}'
}

export const LIMITATIONS = Object.freeze([
  'Bundle contents are self-reported metadata recorded by this workbench; they are not a certification.',
  'A benchmark pass means research metrics were within the stated tolerance. It is not clinical validation.',
  'A human decision gate records that someone chose an outcome in this UI. It is not a signature, deployment approval, or clinical authorization.',
  'Artifact checksums prove the recorded bytes matched at observation time; they do not prove the analysis was correct.',
  'A signature only shows that one private key signed this content. It is self-signed: there is no certificate authority and no trusted timestamp.',
])

export function bundleDigest(bundle) {
  const { integrity, signature, ...rest } = bundle
  return createHash('sha256').update(canonical(rest)).digest('hex')
}

function redactInputs(inputs) {
  if (inputs === null || typeof inputs !== 'object') return {}
  const out = {}
  for (const key of Object.keys(inputs)) out[key] = '[redacted]'
  return out
}

export function createBundle(spec) {
  if (spec === null || typeof spec !== 'object' || Array.isArray(spec)) throw new TypeError('spec must be a plain object')
  const { run, exportedAt, environment } = spec
  if (run === null || typeof run !== 'object' || Array.isArray(run)) throw new TypeError('run must be a plain object')
  if (typeof exportedAt !== 'string' || !Number.isFinite(Date.parse(exportedAt))) throw new TypeError('exportedAt must be an ISO date')
  if (environment === null || typeof environment !== 'object' || Array.isArray(environment)) throw new TypeError('environment must be a plain object')

  const medical = run.preset === 'medical-metadata'
  const includeInputs = spec.includeInputs === true
  const provenanceVerified = verifyProvenance(run.provenance)

  const core = {
    format: BUNDLE_FORMAT,
    bundleVersion: BUNDLE_VERSION,
    exportedAt,
    environment: {
      plugin: String(environment.plugin ?? 'dsh-research-workbench'),
      pluginVersion: String(environment.pluginVersion ?? 'unknown'),
      node: String(environment.node ?? 'unknown'),
      platform: String(environment.platform ?? 'unknown'),
      arch: String(environment.arch ?? 'unknown'),
    },
    run: {
      id: run.id,
      templateId: run.templateId,
      title: run.title,
      preset: run.preset,
      status: run.status,
      createdAt: run.createdAt,
      updatedAt: run.updatedAt,
      inputs: medical && !includeInputs ? redactInputs(run.inputs) : run.inputs,
      steps: (run.steps ?? []).map(step => ({
        id: step.id,
        title: step.title,
        status: step.status,
        ...(step.summary === undefined ? {} : { summary: step.summary }),
      })),
    },
    provenance: run.provenance,
    validationReports: run.validationReports ?? [],
    ...(run.decisionGate === undefined ? {} : { decisionGate: run.decisionGate }),
    limitations: [...LIMITATIONS],
    intendedUse: 'research-only',
    clinicalValidationStatus: 'required-not-performed',
    clinicalUse: 'not-authorized',
  }

  const bundleSha256 = bundleDigest(core)
  const bundle = Object.freeze({
    ...core,
    integrity: Object.freeze({
      provenanceVerified,
      // A bundle whose chain does not verify is still exportable for debugging, but it
      // is explicitly marked so nobody can mistake it for intact evidence.
      provenanceStatus: provenanceVerified ? 'verified' : 'failed-verification',
      bundleSha256,
    }),
    ...(spec.signature === undefined ? {} : { signature: spec.signature }),
  })
  return Object.freeze({ bundle, report: renderReport(bundle) })
}

function renderReport(bundle) {
  const lines = [
    '# ' + bundle.run.title, '',
    '- 运行：' + bundle.run.id,
    '- 状态：' + bundle.run.status,
    '- 导出：' + bundle.exportedAt,
    '- 审计链：' + bundle.integrity.provenanceStatus,
    '- 包摘要：' + bundle.integrity.bundleSha256, '',
    '## 限制', '',
    ...bundle.limitations.map(item => '- ' + item), '',
  ]
  return lines.join('\n')
}

export function verifyBundle(bundle, { trustedKeys } = {}) {
  const checks = []
  const push = (id, ok, detail) => checks.push({ id, ok, detail })

  if (bundle === null || typeof bundle !== 'object' || Array.isArray(bundle)) {
    return { status: 'fail', checks: [{ id: 'shape', ok: false, detail: 'The bundle is not a JSON object.' }], signatureStatus: 'absent', authenticated: false }
  }
  push('shape', true, 'The bundle is a JSON object.')
  const formatOk = bundle.format === BUNDLE_FORMAT && bundle.bundleVersion === BUNDLE_VERSION
  push('format', formatOk, formatOk ? 'Recognised ' + BUNDLE_FORMAT + ' v1.' : 'Expected ' + BUNDLE_FORMAT + ' v1; got ' + bundle.format + ' v' + bundle.bundleVersion + '.')

  let digestOk = false
  try {
    digestOk = bundleDigest(bundle) === bundle.integrity?.bundleSha256
  } catch { digestOk = false }
  push('digest', digestOk, digestOk ? 'Content matches the recorded digest.' : 'Content does not match the recorded bundle digest; the bundle was modified or corrupted.')

  let provenanceVerified = false
  try { provenanceVerified = verifyProvenance(bundle.provenance) } catch { provenanceVerified = false }
  push('provenance', provenanceVerified, provenanceVerified ? 'The audit chain verifies.' : 'The audit chain does not verify.')

  // Signature validity and trust are separate verdicts: a valid signature from an
  // unknown key is not an authenticated bundle.
  let signatureStatus = 'absent'
  if (bundle.signature !== undefined) {
    signatureStatus = verifySignature(bundle.signature, bundle.environment?.publicKey ?? '')
    if (signatureStatus === 'absent' && bundle.signature) signatureStatus = 'invalid'
  }

  const keys = Array.isArray(trustedKeys) ? trustedKeys : []
  const signedBy = bundle.signature?.keyId
  const authenticated = signatureStatus === 'valid' && typeof signedBy === 'string' && keys.includes(signedBy)

  const status = checks.every(check => check.ok) ? 'pass' : 'fail'
  return { status, checks, signatureStatus, authenticated, ...(bundle.integrity ? { integrity: { provenanceVerified, bundleSha256: bundle.integrity.bundleSha256 } } : {}) }
}
