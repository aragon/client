/* eslint-disable react/prop-types */
import React from 'react'
import { ClaimDomain, Review, Voting, Tokens } from '../kit'

import header from './header.svg'
import icon from './icon.svg'

function completeDomain(domain) {
  return domain ? `${domain}.aragonid.eth` : ''
}

export default {
  disabled: true,
  id: 'fundraising',
  name: 'Fundraising',
  header,
  icon,
  description: `
    Initialize a transparent and accountable crowdfunding campaign for your
    organization.
  `,
  // longdesc: ``,
  // caseStudyUrl: 'https://aragon.org/case-study/fundraising',
  // TODO: Insert proper user guide URL
  userGuide: 'https://help.aragon.org/',
  // sourceCodeUrl: 'https://github.com/aragon/dao-templates/tree/master/templates/',
  registry: 'aragonpm.eth',
  modules: [],
  screens: [
    [data => completeDomain(data.domain) || 'Claim domain', ClaimDomain],
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
                ['Organization template', 'Fundraising'],
                ['Name', completeDomain(data.domain)],
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
                [
                  'Token name & symbol',
                  `${data.tokenName} (${data.tokenSymbol})`,
                ],
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
