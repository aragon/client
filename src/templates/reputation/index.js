/* eslint-disable react/prop-types */
import React from 'react'
import { ClaimDomain, Review, Voting, Tokens } from '../kit'

import header from './header.svg'
import icon from './icon.svg'

export default {
  id: 'reputation',
  name: 'Reputation',
  header,
  icon,
  description: `
    Use non-transferrable tokens to represent reputation. Decisions are made
    using reputation-weighted voting.
  `,
  // longdesc: ``,
  // caseStudyUrl: 'https://aragon.org/case-study/reputation',
  // TODO: Insert proper user guide URL
  userGuide: 'https://help.aragon.org/',
  sourceCodeUrl:
    'https://github.com/aragon/dao-templates/tree/master/templates/reputation',
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
                ['Organization template', 'Reputation'],
                ['Name', data.domain],
              ],
            },
            {
              label: 'Voting app',
              fields: [
                ['Support', `${data.support}%`],
                ['Minimum approval %', `${data.quorum}%`],
              ],
            },
            {
              label: 'Tokens app',
              fields: [
                ['Token name & symbol', `${data.tokenName} (${data.tokenSymbol})`],
                ...(data.members || []).map((account, i) => [
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
    const hasPayroll = false

    const {
      tokenName,
      tokenSymbol,
      subdomain,
      holders,
      stakes,
      votingSettings,
      financePeriod,
    } = data

    if (!hasPayroll) {
      return [
        {
          name: 'Create organization',
          transaction: createTx('newTokenAndInstance', [
            tokenName,
            tokenSymbol,
            subdomain,
            holders,
            stakes,
            votingSettings,
            financePeriod,
            true,
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
          subdomain,
          holders,
          stakes,
          votingSettings,
          financePeriod,
          true,
        ]),
      },
    ]
  },
}
