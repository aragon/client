import aragonGovernanceImage from './images/aragon-governance.svg'
import aragonOneImage from './images/aragon-one.svg'
import melonCouncilImage from './images/melon-council.svg'
import blankDaoImage from './images/blankdao.svg'
import livepeerImage from './images/livepeer.svg'
import myBitImage from './images/mybit.svg'

const TEMPLATE_DEMOCRACY = 'Democracy'

export const KnownOrganizations = {
  main: new Map(
    [
      {
        address: '0xfe1f2de598f42ce67bb9aad5ad473f0272d09b74',
        domain: 'meloncouncil.eth',
        image: melonCouncilImage,
        name: 'Melon Council',
        template: TEMPLATE_DEMOCRACY,
      },
      {
        address: '0x2de83b50af29678774d5abc4a7cb2a588762f28c',
        domain: 'governance.aragonproject.eth',
        name: 'Aragon Governance',
        image: aragonGovernanceImage,
        recommended: true,
        template: TEMPLATE_DEMOCRACY,
      },
      {
        address: '0x635193983512c621e6a3e15ee1dbf36f0c0db8e0',
        domain: 'a1.aragonid.eth',
        name: 'Aragon One',
        image: aragonOneImage,
        template: TEMPLATE_DEMOCRACY,
      },
      {
        address: '0x67757A18eDA83125270Ef94dCec7658Eb39bD8a5',
        domain: 'blankdao.aragonid.eth',
        name: 'BlankDAO',
        image: blankDaoImage,
        recommended: true,
        template: TEMPLATE_DEMOCRACY,
      },
      {
        address: '0xcD3d9b832BfF15E0a519610372c6AAC651872DdE',
        domain: '',
        name: 'MyBit',
        image: myBitImage,
        recommended: true,
        template: TEMPLATE_DEMOCRACY,
      },
      {
        address: '0x0ee165029b09d91a54687041Adbc705F6376C67F',
        domain: '',
        name: 'Livepeer',
        image: livepeerImage,
        recommended: true,
        template: TEMPLATE_DEMOCRACY,
      },
    ].map(org => [org.address, org])
  ),
  rinkeby: new Map(
    [
      {
        address: '0x383037aD4E2341835Bfe719E4Bddc5936c271409',
        domain: 'governance.aragonproject.eth',
        name: 'Aragon Governance',
        image: aragonGovernanceImage,
        recommended: true,
        template: TEMPLATE_DEMOCRACY,
      },
      {
        address: '0x837354C9dBEB4169157ef335762367e350e90eEd',
        domain: 'a1.aragonid.eth',
        name: 'Aragon One',
        image: aragonOneImage,
        recommended: true,
        template: TEMPLATE_DEMOCRACY,
      },
    ].map(org => [org.address, org])
  ),
}

// Get the organizations that might appear in the suggestions,
// using the format `{ address, name }` where name is the ENS domain.
export const getRecommendedOrganizations = (networkType, max = -1) => {
  if (!KnownOrganizations[networkType]) {
    return []
  }

  const recommended = []
  for (const [address, org] of KnownOrganizations[networkType]) {
    if (org.recommended) {
      recommended.push({ address, name: org.domain })
      if (recommended.length === max) {
        break
      }
    }
  }

  return recommended
}

export const getKnownOrganization = (networkType, address) => {
  if (!KnownOrganizations[networkType]) return null
  return KnownOrganizations[networkType].get(address) || null
}
