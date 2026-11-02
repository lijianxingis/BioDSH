/**
 * Verify the evidence path end to end: run, record, export, sign, verify, and detect
 * tampering at every stage a reader would care about.
 *
 * Run: node test/verify-bundle-path.mjs
 */
import { mkdtemp, rm } from "node:fs/promises"
import { tmpdir } from "node:os"
import { join } from "node:path"
import { definePlan, runPlan } from "../lib/workflow-engine.js"
import { appendAudit, createProvenance, recordArtifact, recordExecution, setDecisionGate, verifyProvenance } from "../lib/provenance.js"
import { createBundle, verifyBundle, bundleDigest, LIMITATIONS } from "../lib/bundle.js"
import { generateSigningKey, signDigest, verifySignature, describeKey } from "../lib/signing.js"
import { createReport } from "./harness.mjs"

const node = process.execPath
const report = createReport("verify-bundle-path")
const workspace = await mkdtemp(join(tmpdir(), "dsh-bundle-"))

try {
  // Produce a real artifact so the chain has something to vouch for.
  const plan = definePlan({ steps: [{
    id: "produce", command: "x",
    argv: [node, "-e", "require('fs').writeFileSync('out.txt','EVIDENCE')"],
    outputs: [{ path: "out.txt", minBytes: 1 }],
  }] })
  const result = await runPlan(plan, { workspace, runDirectory: join(workspace, "run") })
  const artifact = result.steps[0]?.outputs?.[0]
  report.check("run-produced-a-real-artifact", result.status === "completed" && Boolean(artifact?.sha256))

  let provenance = createProvenance({ runId: "r", sessionId: "s", templateId: "t", preset: "research", inputs: {}, now: "2026-01-01T00:00:00Z" })
  provenance = recordArtifact(provenance, { path: "out.txt", label: "out", bytes: artifact.bytes, version: "v1", checksum: { algorithm: "sha256", value: artifact.sha256 } })
  provenance = recordExecution(provenance, { stepId: "produce", tool: "workflow-engine", stepFingerprint: "fp", exitCode: 0, status: "completed" })
  provenance = setDecisionGate(provenance, { decision: "accepted", reason: "reviewed", actor: "reviewer (unverified)" })
  report.check("chain-verifies-after-build", verifyProvenance(provenance) === true)

  const run = { id: "r", templateId: "t", title: "bundle path", preset: "research", status: "completed",
    createdAt: "2026-01-01T00:00:00Z", updatedAt: "2026-01-01T00:00:01Z", inputs: { sample: "x" }, steps: [], provenance }
  const { bundle, report: rendered } = createBundle({ run, exportedAt: "2026-01-01T00:00:00Z", environment: { pluginVersion: "0.1.0" } })
  report.check("bundle-digest-matches", bundle.integrity.bundleSha256 === bundleDigest(bundle))
  report.check("bundle-verifies", verifyBundle(bundle, {}).status === "pass")
  report.check("bundle-carries-limitations", bundle.limitations.length === LIMITATIONS.length)
  report.check("bundle-states-intended-use", bundle.intendedUse === "research-only")
  report.check("bundle-states-clinical-position", bundle.clinicalValidationStatus === "required-not-performed")
  report.check("report-mentions-the-chain", rendered.includes("审计链"))

  // Tampering: each mutation must be caught by a different check.
  const editTitle = JSON.parse(JSON.stringify(bundle))
  editTitle.run.title = "changed"
  report.check("title-edit-breaks-digest", verifyBundle(editTitle, {}).checks.find(c => c.id === "digest").ok === false)

  const editBytes = JSON.parse(JSON.stringify(bundle))
  editBytes.provenance.artifacts[0].bytes = 999
  report.check("byte-edit-breaks-provenance", verifyBundle(editBytes, {}).checks.find(c => c.id === "provenance").ok === false)

  const dropArtifact = JSON.parse(JSON.stringify(bundle))
  dropArtifact.provenance.artifacts = []
  report.check("deleting-an-artifact-is-caught", verifyBundle(dropArtifact, {}).status === "fail")

  // Signature: valid, invalid, and authenticated are three different answers.
  const key = generateSigningKey()
  const signature = { ...signDigest(bundle.integrity.bundleSha256, key.privateKey), keyId: key.keyId }
  report.check("signature-verifies-against-its-key", verifySignature(signature, key.publicKey) === "valid")
  report.check("signature-is-invalid-with-another-key", verifySignature(signature, generateSigningKey().publicKey) === "invalid")
  const signed = { ...bundle, signature, environment: { ...bundle.environment, publicKey: key.publicKey } }
  report.check("signed-bundle-reports-valid", verifyBundle(signed, {}).signatureStatus === "valid")
  report.check("signed-is-not-authenticated-without-trust", verifyBundle(signed, { trustedKeys: [] }).authenticated === false)
  report.check("authenticated-with-a-trusted-key", verifyBundle(signed, { trustedKeys: [key.keyId] }).authenticated === true)
  report.check("key-describes-itself-as-self-signed", describeKey(key).selfSigned === true)

  // A malformed bundle must be a verdict, not a crash.
  report.check("null-bundle-is-a-failure", verifyBundle(null, {}).status === "fail")
  report.check("string-bundle-is-a-failure", verifyBundle("not a bundle", {}).status === "fail")
  let deepOk = false
  try {
    let deep = { x: 1 }
    for (let i = 0; i < 40; i++) deep = { x: deep }
    bundleDigest(deep)
  } catch (error) { deepOk = /deeper/.test(String(error.message)) }
  report.check("deeply-nested-input-is-refused", deepOk)

  // An audit entry appended after export must be visible as a broken digest.
  const appended = appendAudit(provenance, { type: "tamper", at: "2026-01-01T00:00:02Z" })
  const resealed = { ...bundle, provenance: appended }
  report.check("appending-after-export-breaks-digest", verifyBundle(resealed, {}).checks.find(c => c.id === "digest").ok === false)
} finally {
  await rm(workspace, { recursive: true, force: true }).catch(() => {})
}

report.finish()
