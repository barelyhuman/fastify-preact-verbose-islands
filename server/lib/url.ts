export function normalizeRootUrl(url: string) {
  return '/' + url.split('/').filter(Boolean).join('/')
}
