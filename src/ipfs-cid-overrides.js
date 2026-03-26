// Map of IPFS CID overrides: original CID -> replacement CID
// Add entries here to redirect IPFS content requests to different CIDs
const IPFS_CID_OVERRIDES = {
  QmPcQYEx666a5SQciecUUd5j57Exzs3stFrEzU2zrp6h8t:
    'QmVFVRLSANw4JHqSWYfuPzy5Q4DqcPeTmd1eqR2anXucnz',
}

export function rewriteCid(cid) {
  return IPFS_CID_OVERRIDES[cid] || cid
}

function rewriteIpfsUrl(url) {
  for (const [oldCid, newCid] of Object.entries(IPFS_CID_OVERRIDES)) {
    if (url.includes(oldCid)) {
      return url.replace(oldCid, newCid)
    }
  }
  return url
}

// Patch fetch
const originalFetch = window.fetch.bind(window)
window.fetch = function (input, init) {
  if (typeof input === 'string') {
    return originalFetch(rewriteIpfsUrl(input), init)
  }
  if (input instanceof Request) {
    const rewritten = rewriteIpfsUrl(input.url)
    if (rewritten !== input.url) {
      return originalFetch(rewritten, init)
    }
  }
  return originalFetch(input, init)
}

// Patch XMLHttpRequest
const originalXhrOpen = XMLHttpRequest.prototype.open
XMLHttpRequest.prototype.open = function (method, url, ...rest) {
  if (typeof url === 'string') {
    return originalXhrOpen.call(this, method, rewriteIpfsUrl(url), ...rest)
  }
  return originalXhrOpen.call(this, method, url, ...rest)
}
