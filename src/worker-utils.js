/**
 * Fetch the given script and create a local URL for it
 *
 * @param {string} scriptUrl Real world location of the script
 * @returns {Promise<string>} Local url for the script
 */
export async function getBlobUrl(scriptUrl) {
  const text = scriptUrl.startsWith('ipfs')
    ? await fetchIpfsUrl(scriptUrl)
    : await fetchUrl(scriptUrl)
  const blob = new Blob([text], { type: 'application/javascript' })

  return URL.createObjectURL(blob)
}

const fetchUrl = async url => {
  const res = await fetch(url, {
    method: 'GET',
    mode: 'cors',
  })

  // If status is not a 2xx (based on Response.ok), assume it's an error
  // See https://developer.mozilla.org/en-US/docs/Web/API/GlobalFetch/fetch
  if (!(res && res.ok)) {
    throw res
  }

  return res.text()
}

const fetchIpfsUrl = async ipfsUrl => {
  // TODO: Use ipfs-js-api to cat the file?
  throw new Error(ipfsUrl)
}
