import aragonGovernanceImage from './images/aragon-governance.svg'
import aragonMesh from './images/aragon-mesh.svg'
import aragonNetworkImage from './images/aragon-network.svg'
import aragonOneImage from './images/aragon-one.svg'
import blankDaoImage from './images/blankdao.svg'
import brightIdImage from './images/brightid.svg'
import decentralandImage from './images/decentraland.svg'
import millstoneImage from './images/millstone.png'
import lexdaoImage from './images/lexdao.png'
import lightwaveImage from './images/lightwave.svg'
import livepeerImage from './images/livepeer.svg'
import melonCouncilImage from './images/melon-council.svg'
import myBitImage from './images/mybit.svg'
import onehive from './images/1hive.svg'
import saintFameImage from './images/saint-fame.svg'
import pieDaoImage from './images/pie-dao.png'
import valtechImage from './images/valtech.png'
import pNetworkImage from './images/pnetwork.png'
import cryptokekImage from './images/cryptokek.svg'
import nucypherDaoImage from './images/nucypher.svg'
import nucypherIbexImage from './images/nucypher-ibex.png'

const TEMPLATE_DEMOCRACY = 'Democracy'
const TEMPLATE_REPUTATION = 'Reputation'
const TEMPLATE_COMPANY = 'Company'
const TEMPLATE_MEMBERSHIP = 'Membership'
const TEMPLATE_DANDELION = 'Dandelion'

export const KnownOrganizations = {
  main: new Map(
    [
      {
        address: '0xF47917B108ca4B820CCEA2587546fbB9f7564b56',
        domain: 'dcl.eth',
        image: decentralandImage,
        name: 'Decentraland',
        template: TEMPLATE_DEMOCRACY,
      },
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
        address: '0x67757a18eda83125270ef94dcec7658eb39bd8a5',
        domain: 'blankdao.aragonid.eth',
        name: 'BlankDAO',
        image: blankDaoImage,
        recommended: true,
        template: TEMPLATE_DEMOCRACY,
      },
      {
        address: '0xcd3d9b832bff15e0a519610372c6aac651872dde',
        domain: '',
        name: 'MyBit',
        image: myBitImage,
        recommended: true,
        template: TEMPLATE_DEMOCRACY,
      },
      {
        address: '0x0ee165029b09d91a54687041adbc705f6376c67f',
        domain: '',
        name: 'Livepeer',
        image: livepeerImage,
        recommended: true,
        template: TEMPLATE_DEMOCRACY,
      },
      {
        address: '0x5aad137d8f7d2dc6e1b2548c059b1483360bcc6a',
        domain: 'brightid.aragonid.eth',
        name: 'BrightID',
        image: brightIdImage,
        recommended: true,
        template: TEMPLATE_DEMOCRACY,
      },
      {
        address: '0x5fEED010a99f695852F8eB7B12E77CF6eCd7bE17',
        domain: 'lightwave.aragonid.eth',
        name: 'Lightwave',
        image: lightwaveImage,
        recommended: true,
        template: TEMPLATE_MEMBERSHIP,
      },
      {
        address: '0x40204DaaCb1480019A7A6826C699903dF94eE019',
        domain: 'network.aragonid.eth',
        name: 'Aragon Network',
        image: aragonNetworkImage,
        template: TEMPLATE_MEMBERSHIP,
      },
      {
        address: '0x08ac31Dd93c16F1f6c4A0FAE540bA1aD52f581d0',
        domain: 'sf.aragonid.eth',
        name: 'Saint Fame',
        image: saintFameImage,
        template: TEMPLATE_REPUTATION,
      },
      {
        address: '0xa365A8429FceFdbE1E684dDdDA3531b6e8d96e75',
        domain: 'lexdao.aragonid.eth',
        image: lexdaoImage,
        name: 'lexDAO',
        template: TEMPLATE_MEMBERSHIP,
      },
      {
        address: '0x0c188b183ff758500d1d18b432313d10e9f6b8a4',
        domain: 'piedao.aragonid.eth',
        image: pieDaoImage,
        name: 'PieDAO',
        template: TEMPLATE_DANDELION,
      },
      {
        address: '0xC9Fe36760d8Fe233307E26b094De1f4fA090a12A',
        domain: 'millstone.aragonid.eth',
        image: millstoneImage,
        name: 'Millstone',
        template: TEMPLATE_COMPANY,
      },
      {
        address: '0x4Eef8CFf7fd9bfab6CbcDF05b74d2161cadAFf52',
        domain: 'valtech.aragonid.eth',
        image: valtechImage,
        name: 'Valtech',
        template: TEMPLATE_COMPANY,
      },
      {
        address: '0x2732fD9fD5F0E84B1b774cf5E6f5c812EAfd455b',
        domain: 'pnetwork.aragonid.eth',
        image: pNetworkImage,
        name: 'pNetwork',
        template: null,
      },
      {
        address: '0xe00F7B744AB8333d64ed940dd36ed9398D8eDBD2',
        domain: 'kek.aragonid.eth',
        image: cryptokekImage,
        name: 'Cryptokek.com',
        template: TEMPLATE_COMPANY,
      },
      {
        address: '0x7809e69Cf83Fcb768dA9E7A698EDC9f159b7D6f4',
        domain: 'nucypherdao.aragonid.eth',
        image: nucypherDaoImage,
        name: 'NuCypher DAO',
        template: null,
      },
    ].map(org => [org.address.toLowerCase(), org])
  ),
  rinkeby: new Map(
    [
      {
        address: '0x43374144c33def77a0ebacec72e9c944a6c375fe',
        domain: 'reputation08.aragonid.eth',
        name: 'Example reputation organization',
        image: null,
        recommended: true,
        template: TEMPLATE_REPUTATION,
      },
      {
        address: '0xb2a22974bd09eb5d1b5c726e7c29f4faef636dd2',
        domain: 'company08.aragonid.eth',
        name: 'Example company',
        image: null,
        recommended: true,
        template: TEMPLATE_COMPANY,
      },
      {
        address: '0x0d9938b8720eb5124371c9fa2049144626f67d2e',
        domain: 'membership08.aragonid.eth',
        name: 'Example membership',
        image: null,
        recommended: true,
        template: TEMPLATE_MEMBERSHIP,
      },
      {
        address: '0xe520428c232f6da6f694b121181f907931fd2211',
        domain: 'hive.aragonid.eth',
        name: '1Hive',
        image: onehive,
        recommended: true,
        template: null,
      },
      {
        address: '0xa48300a4e89b59a79452db7d3cd408df57f4aa78',
        domain: 'mesh.aragonid.eth',
        name: 'Aragon Mesh',
        image: aragonMesh,
        recommended: true,
        template: null,
      },
      {
        address: '0xf55DB37807a95C937A0c9c16941D19B54Ce046D2',
        domain: 'pnetwork.aragonid.eth',
        image: pNetworkImage,
        name: 'pNetwork',
        template: null,
      },
      {
        address: '0x6781aa0CA10d409010d169C9598AC89F2446F2A5',
        domain: 'ibex.aragonid.eth',
        image: nucypherIbexImage,
        name: 'NuCypher IBEX Tesnet DAO',
        template: null,
      },
    ].map(org => [org.address.toLowerCase(), org])
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
  return KnownOrganizations[networkType].get(address.toLowerCase()) || null
}
