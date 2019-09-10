/* eslint-disable react/prop-types */
import React from 'react'
import BN from 'bn.js'
import { network } from '../../environment'
import { ClaimDomain, KnownAppBadge, Review, Tokens, Voting } from '../kit'

import header from './header.svg'
import icon from './icon.svg'

function completeDomain(domain) {
  return domain ? `${domain}.aragonid.eth` : ''
}

export default {
  id: 'membership-template.aragonpm.eth',
  name: 'Membership',
  header,
  icon,
  description: `
    Use a non-transferrable token to represent membership. Decisions are
    made based on one-member-one-vote governance.
  `,
  // longdesc: ``,
  // caseStudyUrl: 'https://aragon.org/case-study/membership',
  // TODO: Insert proper user guide URL
  userGuide: 'https://help.aragon.org/',
  sourceCodeUrl:
    'https://github.com/aragon/dao-templates/tree/master/templates/membership',
  registry: 'aragonpm.eth',
  modules: [
    { appName: 'voting.aragonpm.eth', label: 'Voting' },
    { appName: 'token-manager.aragonpm.eth', label: 'Tokens' },
    { appName: 'finance.aragonpm.eth', label: 'Finance' },
  ],
  optionalModules: [{ appName: 'agent.aragonpm.eth', label: 'Agent' }],
  screens: [
    [data => completeDomain(data.domain) || 'Claim domain', ClaimDomain],
    ['Configure template', Voting],
    ['Configure template', props => <Tokens {...props} accountStake={1} />],
    [
      'Review information',
      ({ back, data, next }) => (
        <Review
          back={back}
          data={data}
          next={next}
          items={[
            {
              label: 'General info',
              fields: [
                ['Organization template', 'Membership'],
                ['Name', completeDomain(data.domain)],
              ],
            },
            {
              label: (
                <KnownAppBadge appName="voting.aragonpm.eth" label="Voting" />
              ),
              fields: Voting.formatReviewFields(data.voting),
            },
            {
              label: (
                <KnownAppBadge
                  appName="token-manager.aragonpm.eth"
                  label="Tokens"
                />
              ),
              fields: Tokens.formatReviewFields(data.tokens),
            },
          ]}
        />
      ),
    ],
  ],
  prepareTransactions(createTx, data) {
    const financePeriod = 0 // default
    const hasPayroll = false

    const { domain, optionalModules = [], tokens, voting } = data
    const useAgentAsVault = optionalModules.includes('agent.aragonpm.eth')

    const { tokenName, tokenSymbol, members } = tokens

    const { support, quorum, duration } = voting
    const onePercent = new BN(10).pow(new BN(16))
    const adjustedSupport = onePercent.muln(support).toString()
    const adjustedQuorum = onePercent.muln(quorum).toString()
    const votingSettings = [adjustedSupport, adjustedQuorum, duration]

    // Rinkeby has its gas limit capped at 7M, so some larger 6.5M+ transactions are
    // often not mined
    const forceMultipleTransactions =
      network.type === 'rinkeby' && members.length > 1

    if (!hasPayroll && !forceMultipleTransactions) {
      return [
        {
          name: 'Create organization',
          transaction: createTx('newTokenAndInstance', [
            tokenName,
            tokenSymbol,
            domain,
            members.map(([account]) => account),
            votingSettings,
            financePeriod,
            useAgentAsVault,
          ]),
        },
      ]
    }

    return [
      {
        name: 'Create token',
        transaction: createTx('newToken', [tokenName, tokenSymbol]),
      },
      {
        name: 'Create organization',
        transaction: createTx('newInstance', [
          domain,
          members.map(([account]) => account),
          votingSettings,
          financePeriod,
          useAgentAsVault,
        ]),
      },
    ]
  },
}
