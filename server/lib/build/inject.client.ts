const metafile = await fetch('/_meta').then(d => d.json())

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

  return normalizeRootUrl(prefix + '/' + matchedOutputPath)
}

function normalizeRootUrl(url: string) {
  return '/' + url.split('/').filter(Boolean).join('/')
}
