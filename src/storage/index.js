const pinataAuthUrl = `https://api.pinata.cloud/data/testAuthentication`

export const instantiateStorageContract = (address, abi, wrapper) => {
  const contract = {}
  abi
    .filter(item => item.type === 'function' && !item.constant)
    .forEach(
      intentMethod =>
        (contract[intentMethod.name] = async (...params) => {
          const transactionPath = await wrapper.getExternalTransactionPath(
            address,
            intentMethod,
            params
          )
          return wrapper.performTransactionPath(transactionPath)
        })
    )

  abi
    .filter(item => item.type === 'function' && item.constant)
    .forEach(callMethod => {
      const singleMethodContract = new wrapper.web3.eth.Contract(
        [callMethod],
        address
      )
      contract[callMethod.name] = (...params) =>
        singleMethodContract.methods[callMethod.name](...params).call()
    })
  return contract
}

export const storeInCache = (wrapper, key, value) => {
  return wrapper.cache.set(key, value)
}

export const getFromCache = (wrapper, key) =>
  new Promise(resolve => {
    wrapper.cache.observe(key).subscribe(res => {
      resolve(res)
    })
  })

const getPinataNode = async (key, secret) => {
  await fetch(pinataAuthUrl, {
    method: 'GET',
    headers: {
      pinata_api_key: key,
      pinata_secret_api_key: secret,
    },
  })
  return pinataNode(key, secret)
}

const pinataNode = (key, secret) => {
  const pinataPutEndpoint = `https://api.pinata.cloud/pinning/pinJSONToIPFS`
  const pinataGatewayEndpoint =
    'https://gateway.pinata.cloud/api/v0/object/get?arg=/ipfs'

  return {
    dag: {
      get: async cid => {
        const response = await fetch(`${pinataGatewayEndpoint}/${cid}`)
        const res = await response.json()
        return res.Data
      },
      put: async json => {
        const response = await fetch(pinataPutEndpoint, {
          method: 'POST',
          headers: {
            pinata_api_key: key,
            pinata_secret_api_key: secret,
            'Content-Type': 'application/json',
          },
          body: json,
        })
        const { IpfsHash } = await response.json()
        return { cid: IpfsHash }
      },
    },
  }
}

const getInfuraNode = () => {
  const getEndpoint = `https://ipfs.infura.io:5001/api/v0/dag/get?arg=`
  const putEndpoint = `https://ipfs.infura.io:5001/api/v0/dag/put?pin=true`

  return {
    dag: {
      get: async cid => {
        const url = `${getEndpoint}${cid}`
        const response = await fetch(url, {
          method: 'GET',
        })
        return response.json()
      },
      put: async json => {
        let data = new FormData()
        data.append('v0', JSON.stringify(json))
        const response = await fetch(putEndpoint, {
          method: 'POST',
          body: data,
        })
        const { Cid } = await response.json()
        return { cid: Cid['/'] }
      },
    },
  }
}

const getAragonAssociationNode = () => {
  const baseEndpoint = 'https://aragon-1.pinata.cloud:443/ipfs/api/v0'
  const getEndpoint = `${baseEndpoint}/dag/get?arg=`
  const putEndpoint = `${baseEndpoint}/dag/put?pin=true`
  return {
    dag: {
      get: async cid => {
        const url = `${getEndpoint}${cid}`
        const response = await fetch(url, {
          method: 'GET',
        })
        return response.json()
      },
      put: async json => {
        let data = new FormData()
        data.append('v0', JSON.stringify(json))
        const response = await fetch(putEndpoint, {
          method: 'POST',
          body: data,
        })
        const { Cid } = await response.json()
        return { cid: Cid['/'] }
      },
    },
  }
}

export const createIpfsProvider = async (provider, uri = '', creds) => {
  switch (provider.toLowerCase()) {
    case 'pinata':
      if (!creds) {
        throw new Error('No credentials found')
      } else {
        return getPinataNode(creds.providerKey, creds.providerSecret)
      }
    case 'infura':
      return getInfuraNode()
    case 'aragon_association':
      return getAragonAssociationNode()
    default:
      return getAragonAssociationNode()
  }
}

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

  return response.text()
}
