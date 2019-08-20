import startupHeader from './assets/header-startup.svg'
import reputationHeader from './assets/header-reputation.svg'
import membershipHeader from './assets/header-membership.svg'
import fundraisingHeader from './assets/header-fundraising.svg'
import multisignHeader from './assets/header-multisign.svg'

// see the corresponding prop type, OrgTemplateType, in prop-types.js.
export default [
  {
    id: 'startup',
    name: 'Startup',
    header: startupHeader,
    description: `
      Use fully transferrable tokens to represent ownership stake in your
      organization. Decisions are made based on stake-weighted voting.
    `,
    detailsUrl: 'http://example.com/',
  },
  {
    id: 'reputation',
    name: 'Reputation',
    header: reputationHeader,
    description: `
      Use non-transferrable tokens to represent reputation. Decisions are made
      using reputation-weighted voting.
    `,
    detailsUrl: 'http://example.com/',
  },
  {
    id: 'membership',
    name: 'Membership',
    header: membershipHeader,
    description: `
      Use a non-transferrable token to represent membership. Decisions can be
      made based on one-member-one-vote governance.
    `,
    detailsUrl: 'http://example.com/',
  },
  {
    id: 'fundraising',
    name: 'Fundraising',
    header: fundraisingHeader,
    description: `
      Initialize a transparent and accountable crowdfunding campaign for your
      project or community organization.
    `,
    detailsUrl: 'http://example.com/',
  },
  {
    id: 'multisign',
    name: 'Multisign',
    header: multisignHeader,
    description: `
      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
      tempor incididunt ut labore et dolore magna aliqua. 
    `,
    detailsUrl: 'http://example.com/',
  },
]
