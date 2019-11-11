export const ensureServerIsListeningToStorageContract = async contractAddress => {
  try {
    const response = await fetch('http://localhost:3001/api/v0/contracts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ contractAddress }),
    })
    if (response.status === 201 || response.sstatus === 204) return true
    return false
  } catch (err) {
    return false
  }
}

export const optmisticallyPinDag = async dag => {
  const response = await fetch('http://localhost:3001/api/v0/dag/put', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(dag),
  })

  if (response.status === 201) return response.text()

  throw new Error(
    'There was a problem pinning your data. Please wait a few minutes and try again'
  )
}

const getIPFSGatewayURLs = async () => {
  const response = await fetch('http://localhost:3001/api/v0/ipfs-provider')
  return response.json()
}

export const createIpfsProvider = async () => {
  const { baseUrl, dagGetUrl } = await getIPFSGatewayURLs()
  return {
    dag: {
      get: async cid => {
        const response = await fetch(`${baseUrl}${dagGetUrl}${cid}`)
        return response.json()
      },
    },
  }
}
