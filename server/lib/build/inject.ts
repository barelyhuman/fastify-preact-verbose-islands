import { join } from 'path'
import { normalizeRootUrl } from '../url.js'
import { getMetafile } from './get-metafile.js'

const metafile = await getMetafile()

export function inject(inputFile: string, prefix = '/client') {
  const inputExt = ['.js', '.tsx', '.jsx'].find(d => {
    return metafile.client.inputs[inputFile + d]
  })

  const inputFileToUse = inputFile + inputExt

  if (!inputFileToUse) {
    throw new Error(
      `[inject] the requested ${inputFile} isn't part of the build meta and cannot be injected`
    )
  }

  let matchedOutputPath
  for (let key in metafile.client.outputs) {
    if (inputFileToUse !== metafile.client.outputs[key].entryPoint) continue
    matchedOutputPath = key.replace(
      new RegExp(`^${metafile.clientOutputDir}`),
      ''
    )
  }

  if (!matchedOutputPath) {
    throw new Error(
      `[inject] the requested ${inputFileToUse} isn't part of the build meta and cannot be injected`
    )
  }

  return normalizeRootUrl(join(prefix, matchedOutputPath))
}
