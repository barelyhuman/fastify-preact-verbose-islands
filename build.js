import { spawn } from 'child_process'
import { createContainer } from 'esbuild-multicontext'
import { nodeExternals } from 'esbuild-plugin-node-externals'
import { writeFile } from 'fs/promises'
import { join } from 'path'
import glob from 'tiny-glob'

const ctxContainer = createContainer()

const outputDir = '.output'
const clientOutputDir = join(outputDir, 'client')

ctxContainer.createContext('backend', {
  entryPoints: ['server/index.js'],
  jsx: 'automatic',
  jsxImportSource: 'preact',
  bundle: true,
  metafile: true,
  loader: {
    '.js': 'jsx',
  },
  platform: 'node',
  format: 'esm',
  outdir: outputDir,
  plugins: [nodeExternals()],
})

ctxContainer.createContext('client', {
  entryPoints: (
    await glob('./pages/**/*.{js,jsx,ts,tsx}', {
      cwd: 'client',
    })
  ).map(d => join('client', d)),
  entryNames: '[dir]/[name]-[hash]',
  outbase: 'client',
  metafile: true,
  treeShaking: true,
  splitting: true,
  jsx: 'automatic',
  jsxImportSource: 'preact',
  bundle: true,
  format: 'esm',
  loader: {
    '.js': 'jsx',
  },
  platform: 'browser',
  outdir: clientOutputDir,
})

if (process.argv.slice(2).includes('-w')) {
  let pid

  process.on('SIGTERM', () => {
    // cleanup
    if (pid) {
      process.kill(pid)
    }
  })

  console.log('Starting Dev Mode')
  await ctxContainer.dev({
    ignored(path) {
      return path.startsWith('node_modules') || path.startsWith(outputDir)
    },
    async onBuild(result) {
      if (pid) {
        process.kill(pid)
      }
      const proc = spawn('node', [`${outputDir}/index.js`], {
        stdio: 'inherit',
      })
      pid = proc.pid
      await writeMetafile({
        backend: result.backend.metafile,
        client: result.client.metafile,
      })
    },
  })
} else {
  const result = await ctxContainer.build()
  await writeMetafile({
    backend: result.backend.metafile,
    client: result.client.metafile,
  })
}

async function writeMetafile(metafile) {
  await writeFile(
    join(outputDir, 'meta.json'),
    `${JSON.stringify({ outputDir: outputDir, clientOutputDir, ...metafile })}`,
    'utf8'
  )
}
