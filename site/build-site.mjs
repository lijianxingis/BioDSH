import { readFile, writeFile, mkdir } from 'node:fs/promises'
import { createRequire } from 'node:module'
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const require = createRequire(import.meta.url)
const root = fileURLToPath(new URL('../', import.meta.url))

// The site reuses the plugin's compiled stylesheet, so the panel looks identical in both
// places. If build.mjs has not run yet, the stylesheet is empty and the panel would render
// unstyled - so check rather than produce a broken page.
const stylesPath = new URL('../.build/styles.js', import.meta.url)
let styles
try {
  styles = await readFile(stylesPath, 'utf8')
} catch {
  console.error('run "npm run build" first: the site reuses the plugin stylesheet')
  process.exit(1)
}
if (styles.length < 500) {
  console.error('the compiled stylesheet looks empty; run "npm run build" first')
  process.exit(1)
}

const binary = require.resolve(process.platform === 'win32' ? '@esbuild/win32-x64/esbuild.exe' : `@esbuild/${process.platform}-${process.arch}/bin/esbuild`)
const result = spawnSync(binary, [
  'site/site.js', '--bundle', '--format=esm', '--platform=browser', '--target=es2022',
  '--jsx=automatic', '--loader:.js=jsx',
  '--alias:workbench-styles=./.build/styles.js',
  '--alias:workbench-assets=./.build/assets.js',
  '--define:process.env.NODE_ENV="production"',
  '--outfile=site/site.bundle.js',
], { cwd: root, stdio: 'inherit' })
if (result.error) throw result.error
if (result.status !== 0) process.exit(result.status || 1)

const size = (await readFile(new URL('./site.bundle.js', import.meta.url), 'utf8')).length
console.log('site bundle: ' + Math.round(size / 1024) + ' KiB')
