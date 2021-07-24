/* eslint-disable react/prop-types */
import React from 'react'
import BN from 'bn.js'
import {
  ClaimDomainScreen,
  KnownAppBadge,
  ReviewScreen,
  TokensScreen,
  VotingScreen,
} from '../kit'

import header from './header.svg'
import icon from './icon.svg'

function completeDomain(domain) {
  return domain ? `${domain}.aragonid.eth` : ''
}

function adjustVotingSettings(support, quorum) {
  // The max value for both support and quorum is 100% - 1
  const onePercent = new BN(10).pow(new BN(16))
  const hundredPercent = onePercent.mul(new BN(100))

  let adjustedSupport = onePercent.mul(new BN(support))
  if (adjustedSupport.eq(hundredPercent)) {
    adjustedSupport = adjustedSupport.sub(new BN(1))
  }

  let adjustedQuorum = onePercent.mul(new BN(quorum))
  if (adjustedQuorum.eq(hundredPercent)) {
    adjustedQuorum = adjustedQuorum.sub(new BN(1))
  }

  return [adjustedSupport.toString(), adjustedQuorum.toString()]
}

export default {
  id: 'company-template.aragonpm.eth',
  name: 'Company',
  header,
  icon,
  description: `
    Use transferable tokens to represent ownership stake in your
    organization. Decisions are made based on stake-weighted voting.
  `,
  userGuideUrl:
    'https://help.aragon.org/article/30-create-a-new-company-organization',
  sourceCodeUrl:
    'https://github.com/aragon/dao-templates/tree/templates-company-v1.0.0/templates/company',
  registry: 'aragonpm.eth',
  apps: [
    { appName: 'voting.aragonpm.eth', label: 'Voting' },
    { appName: 'token-manager.aragonpm.eth', label: 'Tokens' },
    { appName: 'finance.aragonpm.eth', label: 'Finance' },
  ],
  optionalApps: [{ appName: 'agent.aragonpm.eth', label: 'Agent' }],
  screens: [
    [
      data => completeDomain(data.domain) || 'Claim domain',
      props => <ClaimDomainScreen screenProps={props} />,
    ],
    ['Configure template', props => <VotingScreen screenProps={props} />],
    ['Configure template', props => <TokensScreen screenProps={props} />],
    [
      'Review information',
      props => {
        const { domain, voting, tokens } = props.data
        return (
          <ReviewScreen
            screenProps={props}
            items={[
              {
                label: 'General info',
                fields: [
                  ['Organization template', 'Company'],
                  ['Name', completeDomain(domain)],
                ],
              },
              {
                label: (
                  <KnownAppBadge appName="voting.aragonpm.eth" label="Voting" />
                ),
                fields: VotingScreen.formatReviewFields(voting),
              },
              {
                label: (
                  <KnownAppBadge
                    appName="token-manager.aragonpm.eth"
                    label="Tokens"
                  />
                ),
                fields: TokensScreen.formatReviewFields(tokens),
              },
            ]}
          />
        )
      },
    ],
  ],
  prepareTransactions(createTx, data, networkType) {
    const financePeriod = 0 // default
    const hasPayroll = false

    const { domain, optionalApps = [], tokens, voting } = data
    const useAgentAsVault = optionalApps.includes('agent.aragonpm.eth')

    const { tokenName, tokenSymbol, members } = tokens
    const baseStake = new BN(10).pow(new BN(18))
    const stakes = members.map(([_, stake]) =>
      baseStake.mul(new BN(stake.toString())).toString()
    )
    const accounts = members.map(([account]) => account)

    const { support, quorum, duration } = voting
    const [adjustedSupport, adjustedQuorum] = adjustVotingSettings(
      support,
      quorum
    )
    const adjustedDuration = new BN(duration).toString()
    const votingSettings = [adjustedSupport, adjustedQuorum, adjustedDuration]

    // Rinkeby has its gas limit capped at 7M, so some larger 6.5M+ transactions are
    // often not mined
    const forceMultipleTransactions =
      networkType === 'rinkeby' && members.length > 1

    if (!hasPayroll && !forceMultipleTransactions) {
      return [
        {
          name: 'Create organization',
          transaction: createTx('newTokenAndInstance', [
            tokenName,
            tokenSymbol,
            domain,
            accounts,
            stakes,
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
          accounts,
          stakes,
          votingSettings,
          financePeriod,
          useAgentAsVault,
        ]),
      },
    ]
  },
}
