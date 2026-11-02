import { readFile, writeFile, mkdir, readdir } from 'node:fs/promises'
import { createRequire } from 'node:module'
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const require = createRequire(import.meta.url)
const root = fileURLToPath(new URL('.', import.meta.url))

const sheets = ['workbench.css', 'workflow.css', 'home.css', 'feedback.css', 'effects.css']
const styles = (await Promise.all(
  sheets.map(name => readFile(new URL('client/' + name, import.meta.url), 'utf8').catch(() => '')),
)).join('\n')

await mkdir(new URL('.build/', import.meta.url), { recursive: true })
await mkdir(new URL('lib/', import.meta.url), { recursive: true })
await writeFile(new URL('.build/styles.js', import.meta.url), `export default ${JSON.stringify(styles)}\n`)

// Interface fragments are inlined as data URLs. A relative <img src> would resolve
// against whichever page hosts the panel, and the plugin does not control that route.
const assetDir = new URL('client/assets/', import.meta.url)
const assetNames = await readdir(assetDir).catch(() => [])
const assets = {}
for (const name of assetNames) {
  if (!/\.(png|jpe?g|webp|svg)$/i.test(name)) continue
  const bytes = await readFile(new URL(name, assetDir))
  const type = name.endsWith('.png') ? 'image/png' : name.endsWith('.svg') ? 'image/svg+xml' : 'image/jpeg'
  assets[name] = `data:${type};base64,${bytes.toString('base64')}`
}
await writeFile(new URL('.build/assets.js', import.meta.url), `export default ${JSON.stringify(assets)}\n`)

const binary = require.resolve(process.platform === 'win32' ? '@esbuild/win32-x64/esbuild.exe' : `@esbuild/${process.platform}-${process.arch}/bin/esbuild`)
const result = spawnSync(binary, [
  'client/main.jsx', '--bundle', '--format=cjs', '--platform=browser', '--target=es2022', '--jsx=automatic',
  '--loader:.js=jsx',
  '--external:react', '--external:react-dom', '--external:react/jsx-runtime',
  '--define:process.env.NODE_ENV="production"',
  '--legal-comments=inline',
  '--alias:workbench-styles=./.build/styles.js',
  '--alias:workbench-assets=./.build/assets.js',
  '--outfile=.build/client.cjs',
], { cwd: root, stdio: 'inherit' })
if (result.error) throw result.error
if (result.status !== 0) process.exit(result.status || 1)

const bundle = await readFile(new URL('.build/client.cjs', import.meta.url), 'utf8')
const code = `window.__ModuleLoader__.load({id:"dsh-research-workbench",factory:(require)=>{var module={exports:{}};var exports=module.exports;\n${bundle}\nreturn module.exports;}});\n`
await writeFile(new URL('lib/client.js', import.meta.url), code, 'utf8')
// Report which analysis scripts the templates depend on, so a missing one is visible at
// build time rather than at run time.
const scriptDir = new URL('scripts/', import.meta.url)
const scriptNames = await readdir(scriptDir).catch(() => [])
const referenced = ['differential_expression.R', 'profile_tables.py', 'inspect_sequences.py', 'summarize_sequences.py']
const absent = referenced.filter(name => !scriptNames.includes(name))
if (absent.length) {
  console.error('WARNING: templates reference scripts that are not shipped: ' + absent.join(', '))
}

console.log(`Built dsh-research-workbench client: ${Math.round(Buffer.byteLength(code) / 1024)} KiB`)
