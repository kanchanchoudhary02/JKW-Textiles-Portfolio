export function imageVariantUrl(src, variant) {
  if (!src || !variant || !/\/(?:api\/images|catalog-images)\//.test(src)) return src
  const hashIndex = src.indexOf('#')
  const hash = hashIndex === -1 ? '' : src.slice(hashIndex)
  const source = hashIndex === -1 ? src : src.slice(0, hashIndex)
  const separator = source.includes('?') ? '&' : '?'
  return `${source}${separator}variant=${encodeURIComponent(variant)}${hash}`
}
