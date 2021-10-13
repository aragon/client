import { networkConfigs } from '../network-config'
import { getLocalStorageKey } from '../util/utils'

const getGraphEndpoint = networkType => {
  return networkConfigs[networkType].connectGraphEndpoint
}

const query = `query Organizations($id: ID!) {
    organizations(where: {id: $id},  orderBy: createdAt, orderDirection: desc){ 
      id
      address
      createdAt
    }
  }`

const ORGANIZATION_INFO = 'ORGANIZATION_INFO&'

export async function getOrganizationByAddress(networkType, daoAddress) {
  const LOCAL_STORAGE_KEY = getLocalStorageKey(
    `${ORGANIZATION_INFO}${daoAddress}`,
    networkType
  )
  if (localStorage.getItem(LOCAL_STORAGE_KEY)) {
    return JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY))
  }

  const graphEndpoint = getGraphEndpoint(networkType)
  if (!graphEndpoint) {
    // some network do not have subgraph (i.e. polygon)
    return null
  }

  const data = await fetch(graphEndpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      query,
      variables: { id: daoAddress.toLowerCase() },
    }),
  })

  if (data.ok) {
    const json = await data.json()
    if (
      json &&
      json.data.organizations &&
      json.data.organizations.length === 1
    ) {
      const organization = json.data.organizations[0]
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(organization))
      return json.data.organizations[0]
    }
  }
  return null
}
