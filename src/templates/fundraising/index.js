/* eslint-disable react/prop-types */
import React from 'react'
import {
  ClaimDomainScreen,
  FundraisingScreen,
  KnownAppBadge,
  ReviewScreen,
  TokensScreen,
  VotingScreen,
} from '../kit'

import header from './header.svg'
import icon from './icon.svg'

function completeDomain(domain) {
  return domain ? `${domain}.aragonid.eth` : ''
}

export default {
  id: 'fundraising',
  name: 'Fundraising',
  header,
  icon,
  description: `
    Initialize a transparent and accountable crowdfunding campaign for your
    organization.
  `,
  userGuideUrl: 'https://help.aragon.org/',
  sourceCodeUrl: 'https://github.com/AragonBlack/fundraising',
  registry: 'aragonpm.eth',
  apps: [
    { appName: 'voting.aragonpm.eth', label: 'Voting' },
    { appName: 'token-manager.aragonpm.eth', label: 'Tokens ANT' },
    { appName: 'token-manager.aragonpm.eth', label: 'Tokens DAI' },
    { appName: 'finance.aragonpm.eth', label: 'Finance' },
  ],
  optionalApps: [
    { appName: 'payroll.aragonpm.eth', label: 'Payroll' },
    { appName: 'agent.aragonpm.eth', label: 'Agent' },
  ],
  screens: [
    [
      data => completeDomain(data.domain) || 'Claim domain',
      props => <ClaimDomainScreen screenProps={props} />,
    ],
    ['Configure template', props => <FundraisingScreen screenProps={props} />],
    ['Configure template', props => <VotingScreen screenProps={props} />],
    [
      'Configure template',
      props => (
        <TokensScreen
          appLabel="Tokens ANT"
          dataKey="tokensAnt"
          screenProps={props}
        />
      ),
    ],
    [
      'Configure template',
      props => (
        <TokensScreen
          appLabel="Tokens DAI"
          dataKey="tokensDai"
          screenProps={props}
        />
      ),
    ],
    [
      'Review information',
      props => {
        const { domain, voting, tokensAnt, tokensDai, fundraising } = props.data
        return (
          <ReviewScreen
            screenProps={props}
            items={[
              {
                label: 'General info',
                fields: [
                  ['Organization template', 'Fundraising'],
                  ['Name', completeDomain(domain)],
                ],
              },
              {
                label: (
                  <KnownAppBadge
                    appName="fundraising.aragonpm.eth"
                    label="Fundraising"
                  />
                ),
                fields: FundraisingScreen.formatReviewFields(fundraising),
              },
              {
                label: (
                  <KnownAppBadge appName="voting.aragonpm.eth" label="Voting" />
                ),
                fields: VotingScreen.formatReviewFields(voting),
              },
              {
                label: (
                  <KnownAppBadge
                    appName="token-manager.aragonpm.eth"
                    label="Tokens ANT"
                  />
                ),
                fields: TokensScreen.formatReviewFields(tokensAnt),
              },
              {
                label: (
                  <KnownAppBadge
                    appName="token-manager.aragonpm.eth"
                    label="Tokens DAI"
                  />
                ),
                fields: TokensScreen.formatReviewFields(tokensDai),
              },
            ]}
          />
        )
      },
    ],
  ],
  prepareTransactions(createTx, data) {
    return []
  },
}
