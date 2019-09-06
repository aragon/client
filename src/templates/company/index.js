/* eslint-disable react/prop-types */
import React from 'react'
import { ClaimDomain, Review, Voting, Tokens } from '../kit'

import header from './header.svg'
import icon from './icon.svg'

export default {
  id: 'company',
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
                  ['Template of organization', 'Company'],
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
    deploy(template, data) {
      return [
        {
          name: 'First signature',
          transaction: async () => {
            return new Promise(resolve => {
              setTimeout(() => resolve([]), 2000)
            })
            // const { tokenName, tokenSymbol } = data
            // const call = template.methods.newToken(tokenName, tokenSymbol)
            // const receipt = await call.send({
            //   from,
            //   ...(await applyCallGasOptions(call, options)),
            // })
            // return receipt.events.DeployToken.returnValues
          },
        },
        {
          name: 'Second signature',
          transaction: async ([
            returnValues /* returnValues from the previous transaction  */,
          ]) => {
            return new Promise(resolve => {
              setTimeout(() => resolve([]), 2000)
            })
            // const call = template.methods.newInstance(/* … */)
            // const receipt = await call.send({
            //   from,
            //   ...(await applyCallGasOptions(call, options)),
            // })
            // return receipt.events.DeployInstance.returnValues
          },
        },
      ]
    },
  },
}
