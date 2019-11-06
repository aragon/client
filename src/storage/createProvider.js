/*
  to avoid using any heavy IPFS dependencies, this file allows us to instantiate
  objects that look a lot like an IPFS HTTP client with a few different popular providers.

  at first, we'll only be using the aragon-association provider, but later we might
  use pinata, infura, temporal (not yet implemented) or custom providers (not yet implemented)

  the only method we need right now is dag.get
*/

const getPinataNode = async () => {
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

export default async provider => {
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
