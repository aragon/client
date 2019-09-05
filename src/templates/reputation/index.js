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
  sourceCodeUrl: 'https://github.com/aragon/dao-templates/tree/master/templates/reputation',
  registry: 'aragonpm.eth',
  modules: [],
  template: {
    screens: [
      [data => data.domain || 'Claim domain', ClaimDomain],
      ['Configure template', Voting],
      ['Configure template', Tokens],
      [
        'Review information',
        ({ back, data, next }) => (
          <Review
            back={back}
            next={next}
            items={[
              {
                label: 'General info',
                fields: [
                  ['Template of organization', 'Reputation'],
                  ['Domain', data.domain],
                ],
              },
              {
                label: 'Voting',
                fields: [
                  ['Support', `${data.support}%`],
                  ['Minimum approval %', `${data.quorum}%`],
                ],
              },
              {
                label: 'Tokens',
                fields: [
                  ['Token', `${data.tokenName} (${data.tokenSymbol})`],
                  ...data.members.map((account, i) => [
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
    prepareTransaction(data) {
      // return txdata
    },
  },
}
