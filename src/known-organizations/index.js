import aragonGovernanceImage from './images/aragon-governance.svg'
import aragonOneImage from './images/aragon-one.svg'
import brightIdImage from './images/brightid.svg'
import melonCouncilImage from './images/melon-council.svg'

export const KnownOrganizations = {
  main: new Map([
    // meloncouncil.eth
    [
      '0xfe1f2de598f42ce67bb9aad5ad473f0272d09b74',
      { name: 'Melon Council', image: melonCouncilImage },
    ],

    // governance.aragonproject.eth
    [
      '0x2de83b50af29678774d5abc4a7cb2a588762f28c',
      { name: 'Aragon Governance', image: aragonGovernanceImage },
    ],

    // a1.aragonid.eth
    [
      '0x635193983512c621e6a3e15ee1dbf36f0c0db8e0',
      { name: 'Aragon One', image: aragonOneImage },
    ],

    // brightid.aragonid.eth
    [
      '0x5aad137d8f7d2dc6e1b2548c059b1483360bcc6a',
      { name: 'BrightID', image: brightIdImage },
    ],
  ]),
}

export const getKnownOrganization = (networkType, address) => {
  if (!KnownOrganizations[networkType]) return null
  return KnownOrganizations[networkType].get(address.toLowerCase()) || null
}
