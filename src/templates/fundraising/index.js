/* eslint-disable react/prop-types */
import React from 'react'
import { ClaimDomain, Review, Voting, Tokens } from '../kit'

import header from './header.svg'
import icon from './icon.svg'

export default {
  id: 'fundraising',
  name: 'Fundraising',
  header,
  icon,
  description: `
    Initialize a transparent and accountable crowdfunding campaign for your
    project or community organization.
  `,
  // longdesc: ``,
  // caseStudyUrl: 'https://aragon.org/case-study/fundraising',
  // sourceCodeUrl: 'https://github.com/aragon/dao-templates/tree/master/templates/',
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
            data={data}
            next={next}
            items={[
              {
                label: 'General info',
                fields: [
                  ['Template of organization', 'Fundraising'],
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
