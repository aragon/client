import payrollIcon from './icons/payroll.svg'
import espressoIcon from './icons/espresso.svg'
import agentIcon from './icons/agent.svg'
import surveyIcon from './icons/survey.svg'
import pandoIcon from './icons/pando.svg'
import tpsIcon from './icons/that-planning-suite.svg'
import { shuffleArray } from '../../../utils'

export const appsInDevelopment = [
  // Ready
  ...shuffleArray([
    {
      icon: surveyIcon,
      name: 'Survey',
      status: 'ready',
      description: `Create multi-option signaling votes.`,
      link: 'https://github.com/aragon/aragon-apps/tree/master/apps/survey',
    },
  ]),

  // Experimental
  ...shuffleArray([
    {
      icon: agentIcon,
      name: 'Agent',
      status: 'experimental',
      description: `
        Hold assets and perform actions from DAOs.
      `,
      link: 'https://github.com/aragon/aragon-apps/tree/master/apps/agent',
    },
    {
      icon: payrollIcon,
      name: 'Payroll',
      status: 'experimental',
      description: `
        Pay and get paid, by the block.
        Supports tokens and price feeds.
      `,
      link:
        'https://github.com/aragon/aragon-apps/tree/master/future-apps/payroll',
    },
    {
      icon: tpsIcon,
      name: 'That Planning Suite',
      status: 'experimental',
      description: `
        Suite for open and fluid organizations.
        Bounties, range voting, and more.
      `,
      link: 'https://github.com/AutarkLabs/planning-suite',
    },
    {
      icon: pandoIcon,
      name: 'Pando',
      status: 'experimental',
      description: `
        Distributed git remote protocol based on IPFS,
        Ethereum and aragonOS.
      `,
      link: 'https://github.com/pandonetwork/pando',
    },
  ]),

  // Alpha
  ...shuffleArray([]),

  // Pre-alpha
  ...shuffleArray([
    {
      icon: espressoIcon,
      name: 'Espresso',
      status: 'pre-alpha',
      description: `
        Collaborative data vault.
        Encrypt and share data with people in your organization.
      `,
      link: 'https://github.com/espresso-org',
    },
    {
      icon: null,
      name: 'Liquid democracy',
      status: 'pre-alpha',
      description: `
        Delegate your voting power to others,
        and vote on important matters.
      `,
      link: 'https://github.com/aragonlabs/liquid-democracy',
    },
  ]),
]
