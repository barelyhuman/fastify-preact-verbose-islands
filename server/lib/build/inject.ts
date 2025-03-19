import { readFile } from 'node:fs/promises'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

// We consider the output path of this being right next to your `index.js` from the
// output folder and so it's something we can read directly
const __dirname = dirname(fileURLToPath(import.meta.url))
const metafile = JSON.parse(
  await readFile(join(__dirname, './meta.json'), 'utf8')
)

export function inject(inputFile: string, prefix = '/client') {
  if (!metafile.client.inputs[inputFile]) {
    throw new Error(
      `[inject] the requested ${inputFile} isn't part of the build meta and cannot be inject`
    )
  }

  let matchedOutputPath
  for (let key in metafile.client.outputs) {
    if (inputFile !== metafile.client.outputs[key].entryPoint) continue
    matchedOutputPath = key.replace(
      new RegExp(`^${metafile.clientOutputDir}`),
      ''
    )
  }

  if (!matchedOutputPath) {
    throw new Error(
      `[inject] the requested ${inputFile} isn't part of the build meta and cannot be inject`
    )
  }

  return normalizeRootUrl(join(prefix, matchedOutputPath))
}

function normalizeRootUrl(url: string) {
  return '/' + url.split('/').filter(Boolean).join('/')
}
