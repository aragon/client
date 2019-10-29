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

const getPinataNode = async (key, secret) => {
  const pinataGatewayEndpoint =
    'https://gateway.pinata.cloud/api/v0/object/get?arg=/ipfs'

  return {
    dag: {
      get: async cid => {
        const response = await fetch(`${pinataGatewayEndpoint}/${cid}`)
        const res = await response.json()
        return res.Data
      },
    },
  }
}

const getInfuraNode = () => {
  const getEndpoint = `https://ipfs.infura.io:5001/api/v0/dag/get?arg=`

  return {
    dag: {
      get: async cid => {
        const url = `${getEndpoint}${cid}`
        const response = await fetch(url, {
          method: 'GET',
        })
        return response.json()
      },
    },
  }
}

const getAragonAssociationNode = () => {
  const baseEndpoint = 'https://aragon-1.pinata.cloud:443/ipfs/api/v0'
  const getEndpoint = `${baseEndpoint}/dag/get?arg=`
  return {
    dag: {
      get: async cid => {
        const url = `${getEndpoint}${cid}`
        const response = await fetch(url, {
          method: 'GET',
        })
        return response.json()
      },
    },
  }
}

export const createIpfsProvider = async provider => {
  console.log('PROVIDER', provider)
  switch (provider.toLowerCase()) {
    case 'pinata':
      return getPinataNode()
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

export const getIPFSProvider = async () => {
  const response = await fetch('http://localhost:3001/api/v0/ipfs-provider')
  return response.json()
}
