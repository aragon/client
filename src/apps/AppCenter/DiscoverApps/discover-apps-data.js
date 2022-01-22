import agentIcon from './icons/agent.svg'
import dandelionIcon from './icons/dandelion.svg'
import openEnterpriseIcon from './icons/open-enterprise.svg'
import pandoIcon from './icons/pando.svg'
import payrollIcon from './icons/payroll.svg'
import redemptionsIcon from './icons/redemptions.svg'
import timeLockIcon from './icons/time-lock.svg'
import tokenRequestIcon from './icons/token-request.svg'
import { shuffleArray } from '../../../util/utils'

export const appsInDevelopment = [
  // Ready
  ...shuffleArray([
    {
      icon: agentIcon,
      name: 'Agent',
      status: 'ready',
      description: `
        Hold assets and interact with any other app, directly from your Aragon organization.
      `,
      link:
        'https://hack.aragon.org/docs/guides-use-agent#installing-aragon-agent',
    },
    {
      icon: openEnterpriseIcon,
      name: 'Open Enterprise',
      status: 'not maintained',
      description: `
        Suite for open and fluid organizations.
        Bounties, range voting, and more.
      `,
      link: 'https://github.com/AutarkLabs/open-enterprise',
    },
    {
      icon: dandelionIcon,
      name: 'Dandelion',
      status: 'not maintained',
      description: `
        Facilitate collaboration with an organization that makes it easy
        for contributors to simply part ways when disagreements occur.
      `,
      link: 'https://github.com/1Hive/dandelion-template',
    },
    {
      icon: redemptionsIcon,
      name: 'Redemptions',
      status: 'ready',
      description: `
        Redeem tokens in exchange for a proportional
        amount of the organization's eligible assets.
      `,
      link: 'https://github.com/1Hive/redemptions-app',
    },
    {
      icon: tokenRequestIcon,
      name: 'Token Request',
      status: 'ready',
      description: `
        Requests an organization's tokens in exchange
        for payment.
      `,
      link: 'https://github.com/1Hive/token-request-app',
    },
    {
      icon: timeLockIcon,
      name: 'Time Lock',
      status: 'ready',
      description: `
        Require users to lock tokens for a configurable
        period of time in order to forward an intent.
      `,
      link: 'https://github.com/1Hive/time-lock-app',
    },
  ]),
  // Experimental
  ...shuffleArray([
    {
      icon: payrollIcon,
      name: 'Payroll',
      status: 'experimental',
      description: `
        Pay and get paid, by the block.
      `,
      link: 'https://github.com/1Hive/payroll-app',
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
]
