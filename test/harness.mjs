/**
 * A tiny check harness for the standalone verification scripts.
 *
 * Each script prints one line per check and exits non-zero if any check fails, so a
 * human can read the result and a CI job can gate on it. Deliberately not a test
 * framework: these scripts verify the installed package end to end, which is a
 * different job from the unit tests.
 */

export function createReport(title) {
  const checks = []
  const started = Date.now()
  return {
    check(id, condition, detail) {
      const ok = typeof condition === "function" ? safe(condition) : Boolean(condition)
      checks.push({ id, ok, detail })
      const mark = ok ? "PASS" : "FAIL"
      console.log(mark.padEnd(5) + id.padEnd(46) + (detail ?? ""))
      return ok
    },
    skip(id, reason) {
      checks.push({ id, ok: true, skipped: true, detail: reason })
      console.log("SKIP ".padEnd(5) + id.padEnd(46) + (reason ?? ""))
    },
    finish() {
      const passed = checks.filter(c => c.ok && !c.skipped).length
      const skipped = checks.filter(c => c.skipped).length
      const failed = checks.filter(c => !c.ok)
      const elapsed = Date.now() - started
      console.log("")
      console.log(title + ": " + passed + " passed, " + skipped + " skipped, " + failed.length + " failed (" + elapsed + " ms)")
      if (failed.length) {
        console.log("")
        for (const item of failed) console.log("  FAILED: " + item.id + (item.detail ? " - " + item.detail : ""))
        process.exitCode = 1
      }
      return { passed, skipped, failed: failed.length }
    },
  }
}

function safe(fn) {
  try { return Boolean(fn()) } catch { return false }
}

/** Await a promise and turn a rejection into a failure rather than a crash. */
export async function expectRejects(promise, pattern) {
  try {
    await promise
    return false
  } catch (error) {
    return pattern === undefined || pattern.test(String(error?.message ?? error))
  }
}
