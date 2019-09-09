/* eslint-disable react/prop-types */
import React from 'react'
import BN from 'bn.js'
import { ClaimDomain, Review, Voting, Tokens } from '../kit'

import header from './header.svg'
import icon from './icon.svg'

export default {
  id: 'company-template.aragonpm.eth',
  name: 'Company',
  header,
  icon,
  description: `
    Use fully transferrable tokens to represent ownership stake in your
    organization. Decisions are made based on stake-weighted voting.
  `,
  // longdesc: '',
  // caseStudyUrl: 'https://aragon.org/case-study/company',
  sourceCodeUrl:
    'https://github.com/aragon/dao-templates/tree/master/templates/company',
  registry: 'aragonpm.eth',
  modules: [],
  screens: [
    [data => data.domain || 'Claim domain', ClaimDomain],
    ['Configure template', Voting],
    ['Configure template', Tokens],
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
                ['Template of organization', 'Company'],
                ['Domain', data.domain],
              ],
            },
            {
              label: 'Voting',
              fields: [
                ['Support', `${data.voting.support}%`],
                ['Minimum approval %', `${data.voting.quorum}%`],
              ],
            },
            {
              label: 'Tokens',
              fields: [
                [
                  'Token',
                  `${data.tokens.tokenName} (${data.tokens.tokenSymbol})`,
                ],
                ...data.tokens.members.map((account, i) => [
                  `Address ${i + 1}`,
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

    if (!hasPayroll) {
      return [
        {
          name: 'Create organization',
          transaction: createTx('newTokenAndInstance', [
            tokenName,
            tokenSymbol,
            domain,
            members,
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
          members,
          stakes,
          votingSettings,
          financePeriod,
          useAgentAsVault,
        ]),
      },
    ]
  },
}
