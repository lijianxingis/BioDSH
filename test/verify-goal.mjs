/**
 * Verify the goals this workbench claims to meet, against a real workspace.
 *
 * Run: node test/verify-goal.mjs
 * Exits non-zero if any claim does not hold.
 */
import { mkdir, mkdtemp, rm, readFile, writeFile } from "node:fs/promises"
import { tmpdir } from "node:os"
import { join } from "node:path"
import { definePlan, runPlan } from "../lib/workflow-engine.js"
import { createProvenance, recordArtifact, verifyProvenance } from "../lib/provenance.js"
import { createBundle, signBundle, verifyBundle } from "../lib/bundle.js"
import { generateSigningKey, signDigest } from "../lib/signing.js"
import { createReport } from "./harness.mjs"

const node = process.execPath
const report = createReport("verify-goal")
const workspace = await mkdtemp(join(tmpdir(), "dsh-goal-"))

try {
  // Goal: a step that exits 0 without producing its declared output is a failure.
  const brokenPlan = definePlan({ steps: [{
    id: "silent", command: "x",
    argv: [node, "-e", "process.exit(0)"],
    outputs: [{ path: "promised.txt", minBytes: 1 }],
  }] })
  const broken = await runPlan(brokenPlan, { workspace, runDirectory: join(workspace, "r1") })
  report.check("exit-0-without-output-is-failure", broken.status === "failed", "status=" + broken.status)

  // Goal: a missing required input stops the command before it runs.
  const blockedDir = join(workspace, "blocked")
  await mkdir(blockedDir, { recursive: true })
  const blockedPlan = definePlan({ steps: [{
    id: "needs-input", command: "x",
    argv: [node, "-e", "require('fs').writeFileSync('ran.txt','yes')"],
    inputs: [{ path: "absent.csv", required: true }],
    outputs: ["ran.txt"],
  }] })
  const blocked = await runPlan(blockedPlan, { workspace: blockedDir, runDirectory: join(workspace, "r2") })
  const didNotRun = await readFile(join(blockedDir, "ran.txt"), "utf8").then(() => false, () => true)
  report.check("missing-input-stops-execution", blocked.status === "failed" && didNotRun, "status=" + blocked.status)

  // Goal: a declared media type that does not match the bytes is a failure.
  const mediaPlan = definePlan({ steps: [{
    id: "wrong-type", command: "x",
    argv: [node, "-e", "require('fs').writeFileSync('image.png','not a png')"],
    outputs: [{ path: "image.png", mediaType: "image/png" }],
  }] })
  const media = await runPlan(mediaPlan, { workspace, runDirectory: join(workspace, "r3") })
  report.check("media-type-mismatch-is-failure", media.status === "failed", "status=" + media.status)

  // Goal: a successful run records real artifacts with digest and size.
  const goodPlan = definePlan({ steps: [{
    id: "produce", command: "x",
    argv: [node, "-e", "require('fs').writeFileSync('out.csv',['a,b','1,2'].join(String.fromCharCode(10)))"],
    outputs: [{ path: "out.csv", minBytes: 5 }],
  }] })
  const good = await runPlan(goodPlan, { workspace, runDirectory: join(workspace, "r4") })
  report.check("successful-run-is-completed", good.status === "completed", "status=" + good.status)
  const artifact = good.steps[0]?.outputs?.[0]
  report.check("artifact-has-size-and-digest", Boolean(artifact?.bytes && artifact?.sha256), artifact?.sha256?.slice(0, 12))

  // Goal: editing a recorded byte count breaks the chain.
  const provenance = recordArtifact(
    createProvenance({ runId: "g", sessionId: "s", templateId: "t", preset: "research", inputs: {}, now: "2026-01-01T00:00:00Z" }),
    { path: "a.txt", label: "a", bytes: 3, version: "v1", checksum: { algorithm: "sha256", value: "a".repeat(64) } },
  )
  const tampered = JSON.parse(JSON.stringify(provenance))
  tampered.artifacts[0].bytes = 999
  report.check("tampered-byte-count-breaks-chain", verifyProvenance(tampered) === false)

  // Goal: a signature travels with the bundle, and trust is a separate verdict.
  const key = generateSigningKey()
  const run = { id: "g", templateId: "t", title: "t", preset: "research", status: "completed", createdAt: "2026-01-01T00:00:00Z", updatedAt: "2026-01-01T00:00:01Z", inputs: {}, steps: [], provenance }
  // The public key travels inside the bundle, so it is present before sealing.
  const { bundle: keyed } = createBundle({ run, exportedAt: "2026-01-01T00:00:00Z", environment: { pluginVersion: "0.1.0", publicKey: key.publicKey } })
  const signed = signBundle(keyed, key.privateKey, key.keyId)
  report.check("signature-verifies", verifyBundle(signed, {}).signatureStatus === "valid")
  report.check("valid-signature-is-not-authenticated", verifyBundle(signed, { trustedKeys: [] }).authenticated === false)
  report.check("authenticated-only-with-trusted-key", verifyBundle(signed, { trustedKeys: [key.keyId] }).authenticated === true)
  const edited = { ...signed, run: { ...signed.run, title: "changed" } }
  report.check("edited-after-signing-is-detected", verifyBundle(edited, { trustedKeys: [key.keyId] }).authenticated === false)

  // Goal: every report states the clinical position.
  report.check("bundle-refuses-clinical-use", JSON.stringify(signed).includes("research-only"))
} finally {
  await rm(workspace, { recursive: true, force: true }).catch(() => {})
}

report.finish()
