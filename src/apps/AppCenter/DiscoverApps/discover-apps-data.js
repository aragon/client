import payrollIcon from './icons/payroll.svg'
import agentIcon from './icons/agent.svg'
import surveyIcon from './icons/survey.svg'
import pandoIcon from './icons/pando.svg'
import openEnterpriseIcon from './icons/open-enterprise.svg'
import redemptionsIcon from './icons/redemptions.svg'
import tokenRequestIcon from './icons/token-request.svg'
import timeLockIcon from './icons/time-lock.svg'
import { shuffleArray } from '../../../utils'

export const appsInDevelopment = [
  // Experimental
  ...shuffleArray([
    {
      icon: surveyIcon,
      name: 'Survey',
      status: 'experimental',
      description: `Create multi-option signaling votes.`,
      link: 'https://github.com/aragon/aragon-apps/tree/master/apps/survey',
    },
    {
      icon: agentIcon,
      name: 'Agent',
      status: 'experimental',
      description: `
        Hold assets and perform actions from DAOs.
      `,
      link:
        'https://hack.aragon.org/docs/guides-use-agent#installing-aragon-agent',
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
      icon: redemptionsIcon,
      name: 'Redemptions',
      status: 'experimental',
      description: `
        Redeem tokens in exchange for a proportional
        amount of the organization's eligible assets
      `,
      link: 'https://github.com/1Hive/redemptions-app',
    },
    {
      icon: openEnterpriseIcon,
      name: 'Open Enterprise',
      status: 'experimental',
      description: `
        Suite for open and fluid organizations.
        Bounties, range voting, and more.
      `,
      link: 'https://github.com/AutarkLabs/open-enterprise',
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
    {
      icon: tokenRequestIcon,
      name: 'Token Request',
      status: 'experimental',
      description: `
        Requests an organization's tokens in exchange
        for payment
      `,
      link: 'https://github.com/1Hive/token-request-app',
    },
    {
      icon: timeLockIcon,
      name: 'Time Lock',
      status: 'experimental',
      description: `
        Require users to lock tokens for a configurable
        period of time in order to forward an intent
      `,
      link: 'https://github.com/1Hive/time-lock-app',
    },
  ]),
]
