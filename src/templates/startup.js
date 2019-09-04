import React from 'react'
import { ClaimDomain, Review, Voting, Tokens } from './kit'

import header from './assets/header-startup.svg'
import icon from './assets/icon-startup.svg'

export default {
  id: 'startup',
  name: 'Startup',
  header,
  icon,
  description: `
    Use fully transferrable tokens to represent ownership stake in your
    organization. Decisions are made based on stake-weighted voting.
  `,
  longdesc: `
    The different type of business goals mentioned above can help you
    determine which priorities you want to go after. You can use them as a
    reference for adjustments and future decisions, and they can aid in
    creating the right strategies for accomplishing your company goals and
    objectives.
  `,
  caseStudyUrl: 'https://aragon.org/case-study/startup',
  sourceCodeUrl: 'aragon/aragon/dao-kit-startup',
  registry: 'aragonpm.eth',
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
                  ['Template of organization', 'Startup'],
                  ['Domain', data.domain],
                ],
              },
              {
                label: 'Voting',
                fields: [
                  ['Support', data.support],
                  ['Minimum approval %', data.quorum],
                ],
              },
              { label: 'Tokens', fields: [] },
              { label: 'Finance', fields: [] },
              { label: 'Payroll', fields: [] },
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
