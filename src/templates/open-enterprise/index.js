/* eslint-disable react/prop-types */
import React from 'react'
import BN from 'bn.js'
import {
  ClaimDomainScreen,
  DotVotingScreen,
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

export default {
  id: 'open-enterprise-template.aragonpm.eth',
  name: 'Open Enterprise',
  header,
  icon,
  description: `
    A suite of apps for organizations, including project management
    , bounties, budget planning and rewards.
  `,
  userGuideUrl: 'https://autark.gitbook.io/open-enterprise/',
  sourceCodeUrl: 'https://github.com/AutarkLabs/open-enterprise',
  registry: 'hatch.aragonpm.eth',
  apps: [
    { appName: 'voting.aragonpm.eth', label: 'Voting' },
    { appName: 'token-manager.aragonpm.eth', label: 'Tokens' },
    { appName: 'finance.aragonpm.eth', label: 'Finance' },
    { appName: 'address-book.hatch.aragonpm.eth', label: 'Address Book' },
    { appName: 'allocations.hatch.aragonpm.eth', label: 'Allocations' },
    { appName: 'dot-voting.hatch.aragonpm.eth', label: 'Dot Voting' },
    { appName: 'projects.hatch.aragonpm.eth', label: 'Projects' },
    { appName: 'rewards.hatch.aragonpm.eth', label: 'Rewards' },
  ],
  screens: [
    [
      data => completeDomain(data.domain) || 'Claim domain',
      props => <ClaimDomainScreen screenProps={props} />,
    ],
    ['Configure template', props => <VotingScreen screenProps={props} />],
    ['Configure template', props => <DotVotingScreen screenProps={props} />],
    ['Configure template', props => <TokensScreen screenProps={props} />],
    [
      'Review information',
      props => {
        const { domain, dotVoting, tokens, voting } = props.data
        return (
          <ReviewScreen
            screenProps={props}
            items={[
              {
                label: 'General info',
                fields: [
                  ['Organization template', 'Open Enterprise'],
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
                    appName="dot-voting.hatch.aragonpm.eth"
                    label="Dot Voting"
                  />
                ),
                fields: DotVotingScreen.formatReviewFields(dotVoting),
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
  prepareTransactions(createTx, data) {
    const allocationsPeriod = 0 // default
    const financePeriod = 0 // default

    const { domain, dotVoting, tokens, voting } = data
    const useDiscussions = dotVoting.discussions

    const { tokenName, tokenSymbol, members } = tokens
    const accounts = members.map(([account]) => account)

    const { support, quorum, duration } = voting
    const onePercent = new BN(10).pow(new BN(16))
    const adjustedSupport = onePercent.mul(new BN(support)).toString()
    const adjustedQuorum = onePercent.mul(new BN(quorum)).toString()
    const adjustedDuration = new BN(duration).toString()
    const votingSettings = [adjustedSupport, adjustedQuorum, adjustedDuration]

    const { dvSupport, dvQuorum, dvDuration } = dotVoting
    const adjustedDvSupport = onePercent.mul(new BN(dvSupport)).toString()
    const adjustedDvQuorum = onePercent.mul(new BN(dvQuorum)).toString()
    const adjustedDvDuration = new BN(dvDuration).toString()
    const dotVotingSettings = [
      adjustedDvSupport,
      adjustedDvQuorum,
      adjustedDvDuration,
    ]

    /* For Open Enterprise, is currently not possible to use a single tx, the creation process cost is ~10M gas */

    return [
      {
        name: 'Create token and base organization',
        transaction: createTx('newTokenAndInstance', [
          tokenName,
          tokenSymbol,
          domain,
          accounts,
          votingSettings,
          financePeriod,
        ]),
      },
      {
        name: 'Setup Open Enterprise apps',
        transaction: createTx('newOpenEnterprise', [
          dotVotingSettings,
          allocationsPeriod,
          useDiscussions,
        ]),
      },
    ]
  },
}
