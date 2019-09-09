/* eslint-disable react/prop-types */
import React from 'react'
import BN from 'bn.js'
import { network } from '../../environment'
import { ClaimDomain, Review, Voting, Tokens } from '../kit'

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
  modules: [],
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
              label: 'Voting app',
              fields: [
                ['Support', `${data.voting.support}%`],
                ['Minimum approval %', `${data.voting.quorum}%`],
              ],
            },
            {
              label: 'Tokens app',
              fields: [
                ['Token name & symbol', `${data.tokenName} (${data.tokenSymbol})`],
                ...data.tokens.members.map(([account], i) => [
                  `Tokenholder #${i + 1}`,
                  account,
                ]),
              ],
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
    const stake = new BN(10).pow(new BN(18)).toString()
    const stakes = members.map(() => stake)

    const { support, quorum, duration } = voting
    const onePercent = new BN(10).pow(new BN(16))
    const adjustedSupport = onePercent.muln(support).toString()
    const adjustedQuorum = onePercent.muln(quorum).toString()
    const votingSettings = [adjustedSupport, adjustedQuorum, duration]

    // Rinkeby has its gas limit capped at 7M, so some larger 6.5M+ transactions are
    // often not mined
    const forceMultipleTransactions =
      network.type === 'rinkeby' && members.length > 2

    if (!hasPayroll && !forceMultipleTransactions) {
      return [
        {
          name: 'Create organization',
          transaction: createTx('newTokenAndInstance', [
            tokenName,
            tokenSymbol,
            domain,
            members.map(([account]) => account),
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
          members.map(([account]) => account),
          stakes,
          votingSettings,
          financePeriod,
          useAgentAsVault,
        ]),
      },
    ]
  },
}
