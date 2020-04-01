/* eslint-disable react/prop-types */
// THE PEOPLE ASKED FOR IT... 2020/04/01
import React from 'react'
import {
  ClaimDomainScreen,
  KnownAppBadge,
  ReviewScreen,
  TokensScreen,
} from '../kit'
import DictatorScreen from './components/DictatorScreen'

import header from './header.svg'
import icon from './icon.svg'

function completeDomain(domain) {
  return domain ? `${domain}.aragonid.eth` : ''
}

export default {
  id: 'dictatorship-template.open.aragonpm.eth',
  name: 'Dictatorship',
  new: true,
  header,
  icon,
  description: `
    From Hungary, to Russia, to China, to Venezuela: Dictatorship is the
    new Democracy. Introducing the Dictatorship template.
  `,
  userGuideUrl: 'https://en.wikipedia.org/wiki/Human_rights_in_North_Korea',
  sourceCodeUrl: 'Code is closed source',
  registry: 'Private',
  apps: [
    { appName: 'token-manager.aragonpm.eth', label: 'Henchmen' },
    { appName: 'finance.aragonpm.eth', label: 'Hyperinflation' },
    { appName: 'agent.aragonpm.eth', label: 'Spy' },
  ],
  screens: [
    [
      data => completeDomain(data.domain) || 'Claim domain',
      props => <ClaimDomainScreen screenProps={props} />,
    ],
    ['Configure template', props => <DictatorScreen screenProps={props} />],
    [
      'Configure template',
      props => (
        <TokensScreen
          accountStake={1}
          allowNoHolders
          screenProps={props}
          title="Henchmen"
        />
      ),
    ],
    [
      'Review information',
      props => {
        const { domain, tokens } = props.data
        return (
          <ReviewScreen
            screenProps={props}
            items={[
              {
                label: 'General info',
                fields: [
                  ['Organization template', 'Dictatorship'],
                  ['Name', completeDomain(domain)],
                ],
              },
              {
                label: (
                  <KnownAppBadge
                    appName="token-manager.aragonpm.eth"
                    label="Henchmen"
                  />
                ),
                fields: TokensScreen.formatReviewFields(tokens),
              },
            ]}
          />
        )
      },
    ],
  ],
  prepareTransactions(createTx, data) {
    const financePeriod = 0 // default

    const { dictator, domain, tokens } = data

    const { members, tokenName, tokenSymbol } = tokens
    const accounts = members.map(([account]) => account)

    return [
      {
        name: 'Create organization',
        transaction: createTx('newTokenAndInstance', [
          tokenName,
          tokenSymbol,
          domain,
          dictator,
          accounts,
          financePeriod,
        ]),
      },
    ]
  },
}
