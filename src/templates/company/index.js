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
  id: 'company-template.aragonpm.eth',
  name: 'Company',
  header,
  icon,
  description: `
    Use transferrable tokens to represent ownership stake in your
    organization. Decisions are made based on stake-weighted voting.
  `,
  // longdesc: '',
  // caseStudyUrl: 'https://aragon.org/case-study/company',
  // TODO: Insert proper user guide URL
  userGuide: 'https://help.aragon.org/',
  sourceCodeUrl:
    'https://github.com/aragon/dao-templates/tree/master/templates/company',
  registry: 'aragonpm.eth',
  modules: [
    { appName: 'voting.aragonpm.eth', label: 'Voting' },
    { appName: 'token-manager.aragonpm.eth', label: 'Tokens' },
    { appName: 'finance.aragonpm.eth', label: 'Finance' },
    { appName: 'vault.aragonpm.eth', label: 'Vault' },
  ],
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
                ['Organization template', 'Company'],
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
    const useAgentAsVault = false

    const { domain, tokens, voting } = data
    const { tokenName, tokenSymbol, members } = tokens
    const baseStake = new BN(10).pow(new BN(18))
    const stakes = members.map(([_, stake]) =>
      baseStake.mul(new BN(stake)).toString()
    )
    const accounts = members.map(([account]) => account)

    const { support, quorum, duration } = voting
    const onePercent = new BN(10).pow(new BN(16))
    const adjustedSupport = onePercent.mul(new BN(support)).toString()
    const adjustedQuorum = onePercent.mul(new BN(quorum)).toString()
    const adjustedDuration = new BN(duration).toString()
    const votingSettings = [adjustedSupport, adjustedQuorum, adjustedDuration]

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
