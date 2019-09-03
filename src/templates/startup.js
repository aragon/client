import React, { useCallback, useState } from 'react'
import { Field, GU, Info, TextInput, useTheme } from '@aragon/ui'
import {
  ClaimDomain,
  Header,
  PercentageField,
  PrevNextFooter,
} from './template-kit'

import startupHeader from './assets/header-startup.svg'
import startupIcon from './assets/icon-startup.svg'

export default {
  id: 'startup',
  name: 'Startup',
  header: startupHeader,
  icon: startupIcon,
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
      ['Claim domain', ClaimDomain],
      [
        'Configure template',
        function Configure({ back, data, fields, next, screenIndex, screens }) {
          const theme = useTheme()

          const [support, setSupport] = useState(data.support || 50)
          const [quorum, setQuorum] = useState(data.quorum || 15)

          const handleSupportChange = useCallback(
            value => {
              setSupport(Math.max(value, quorum))
            },
            [quorum]
          )

          const handleQuorumChange = useCallback(
            value => {
              setQuorum(Math.min(value, support))
            },
            [support]
          )

          const handleNext = useCallback(() => {
            next({
              ...data,
              support,
              quorum,
            })
          }, [data, next, support, quorum])

          return (
            <div
              css={`
                display: grid;
                align-items: center;
                justify-content: center;
              `}
            >
              <div
                css={`
                  max-width: ${82 * GU}px;
                `}
              >
                <Header
                  title="Configure template"
                  subtitle="Choose your Voting settings below."
                />

                <PercentageField
                  label="Support"
                  value={support}
                  onChange={handleSupportChange}
                />

                <PercentageField
                  label="Minimum approval %"
                  value={quorum}
                  onChange={handleQuorumChange}
                />

                <Field label="vote duration">
                  <div css="display: flex">
                    {['Days', 'Hours', 'Minutes'].map(label => (
                      <div
                        css={`
                          margin-right: ${2 * GU}px;
                        `}
                      >
                        <TextInput
                          key={label}
                          adornment={
                            <span
                              css={`
                                padding: 0 ${2 * GU}px;
                                color: ${theme.contentSecondary};
                              `}
                            >
                              {label}
                            </span>
                          }
                          adornmentPosition="end"
                          adornmentSettings={{
                            width: 8 * GU,
                            padding: 0,
                          }}
                          css={`
                            width: ${17 * GU}px;
                            text-align: center;
                          `}
                        />
                      </div>
                    ))}
                  </div>
                </Field>

                <Info
                  css={`
                    margin-bottom: ${3 * GU}px;
                  `}
                >
                  These settings will define your organization’s governance, for
                  example, the support required for a vote to pass or its
                  duration.
                </Info>

                <PrevNextFooter
                  backEnabled
                  nextEnabled
                  onBack={back}
                  onNext={handleNext}
                  screenIndex={screenIndex}
                  screens={screens}
                />
              </div>
            </div>
          )
        },
      ],
      [
        'Review information',
        function Review({ next, fields, data }) {
          return <h1>Review information</h1>
        },
      ],

      // ({ next, fields, data }) => {
      //   const { domain = '' } = data

      //   next({ ...data, domain })

      //   // const data = {
      //   //   domain: '',
      //   //   name: '',
      //   //   apps: [
      //   //     { appId: '', label: 'optional', support: 30 },
      //   //     { appId: '', label: 'optional', support: 30 },
      //   //   ],
      //   // }
      // },

      // Voting: Configure 1
      // ({ next, fields, data }) => {
      //   const { support = -1, quorum = -1 } = data

      //   next({
      //     // ...data,
      //     // apps: {
      //     //   ...data.apps,
      //     //   [appId]: {
      //     //     ...data.apps[appId],
      //     //     support: 1,
      //     //   }
      //     // },
      //   })

      //   // const data = {
      //   //   domain: '',
      //   //   name: '',
      //   //   apps: [
      //   //     { appId: '', label: 'optional', support: 30 },
      //   //     { appId: '', label: 'optional', support: 30 },
      //   //   ],
      //   // }
      // },

      // Summary
      // ({ next, fields, data }) => {
      //   return (
      //     <GenericSummary
      //       entries={[{ type: 'app', id: '' }, { type: 'label', id: '' }]}
      //     />
      //   )

      //   // const data = {
      //   //   domain: '',
      //   //   name: '',
      //   //   apps: [
      //   //     { appId: '', label: 'optional', support: 30 },
      //   //     { appId: '', label: 'optional', support: 30 },
      //   //   ],
      //   // }
      // },
    ],
    prepareTransaction(data) {
      // return txdata
    },
  },
}
