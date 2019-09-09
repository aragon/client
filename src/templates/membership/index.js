/* eslint-disable react/prop-types */
import React from 'react'
import { ClaimDomain, Review, Voting, Tokens } from '../kit'

import header from './header.svg'
import icon from './icon.svg'

export default {
  id: 'membership',
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
                ['Organization template', 'Membership'],
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
                ...data.members.map((account, i) => [
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
