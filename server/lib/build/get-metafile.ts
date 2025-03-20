import { readFile } from 'node:fs/promises'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

export const getMetafile = async () => {
  // We consider the output path of this being right next to your `index.js` from the
  // output folder and so it's something we can read directly
  const __dirname = dirname(fileURLToPath(import.meta.url))
  const metafile = JSON.parse(
    await readFile(join(__dirname, './meta.json'), 'utf8')
  )
  return metafile
}
