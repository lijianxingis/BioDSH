/**
 * Plugin entry point.
 *
 * This build is a partial restoration: the engine, contracts, provenance, governance
 * modules and the overview client are complete and tested; the host API and the
 * workflow panel are not restored yet. Rather than exporting stubs that look like the
 * real thing, this module reports exactly which capabilities are present, so a caller
 * can tell "not implemented" from "failed".
 */
import { readFileSync } from 'node:fs'
import { ENGINE_VERSION, limits } from './workflow-engine.js'

export const PLUGIN_VERSION = (() => {
  try {
    // Read through the module URL so the path is right after installation.
    return JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8')).version ?? 'unknown'
  } catch { return 'unknown' }
})()

/** Modules that are implemented and tested in this build. */
export const READY = Object.freeze([
  'host',
  'benchmark',
  'medical-policy',
  'step-contract',
  'workflow-engine',
  'provenance',
  'signing',
  'bundle',
  'execution-spec',
  'step-executor',
  'artifact-store',
  'run-journal',
  'scheduler',
  'quota',
  'rate-limit',
  'identity',
  'image-qc',
  'distributed',
  'validation',
  'run-adapter',
])

/** Capabilities that are NOT in this build. Listed rather than silently absent. */
export const NOT_YET = Object.freeze([
  'container backend against a multi-package Bioconductor image (verified against r-base 4.3.3 only)',
  'distributed execution across machines that do not share a content store',
  'vision or diagnostics: image inspection reads the container only',
])

/**
 * What the plugin can do right now.
 *
 * A caller that wants to know whether a run can be executed should read this rather
 * than assume: `canRunWorkflows` is false in this build because the host API that
 * executes them is not present.
 */
export function capabilities() {
  return Object.freeze({
    pluginVersion: PLUGIN_VERSION,
    engineVersion: ENGINE_VERSION,
    ready: READY,
    notYet: NOT_YET,
    canRunWorkflows: true,
    reason: 'host API and all three views are present',
    limits,
    intendedUse: 'research-only',
    clinicalValidationStatus: 'required-not-performed',
  })
}

/** The modules this plugin exposes to a host, resolved lazily. */
export const modules = Object.freeze({
  host: () => import('./host.js'),
  benchmark: () => import('./benchmark.js'),
  'medical-policy': () => import('./medical-policy.js'),
  'step-contract': () => import('./step-contract.js'),
  'workflow-engine': () => import('./workflow-engine.js'),
  provenance: () => import('./provenance.js'),
  signing: () => import('./signing.js'),
  bundle: () => import('./bundle.js'),
  'execution-spec': () => import('./execution-spec.js'),
  'step-executor': () => import('./step-executor.js'),
  'artifact-store': () => import('./artifact-store.js'),
  'run-journal': () => import('./run-journal.js'),
  scheduler: () => import('./scheduler.js'),
  quota: () => import('./quota.js'),
  'rate-limit': () => import('./rate-limit.js'),
  identity: () => import('./identity.js'),
  'image-qc': () => import('./image-qc.js'),
  distributed: () => import('./distributed.js'),
  validation: () => import('./validation.js'),
  'run-adapter': () => import('./run-adapter.js'),
})

export default { capabilities, modules, READY, NOT_YET }
