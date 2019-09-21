/* eslint-disable react/prop-types */
import React from 'react'
import BN from 'bn.js'
import { network } from '../../environment'
import {
  ClaimDomainScreen,
  KnownAppBadge,
  ReviewScreen,
  TokensScreen,
} from '../kit'
import { VotingScreen, DelayScreen, LockScreen } from './config'

import header from './header.svg'
import icon from './icon.svg'

function completeDomain(domain) {
  return domain ? `${domain}.aragonid.eth` : ''
}

export default {
  id: 'dandelion-template.aragonpm.eth',
  name: 'Dandelion',
  header,
  icon,
  description: `
  Facilitate collaboration by providing an organization structure that makes it easy for contributors easily part ways when disagreements occur.
  `,
  // userGuideUrl:
  //   'https://help.aragon.org/article/32-create-a-new-reputation-organization',
  caseStudyUrl: 'aragon.org/case-study/hivecommons',
  sourceCodeUrl: 'https://github.com/aragon/dao-templates/tree/templates/1hive',
  registry: 'aragonpm.eth',
  modules: [
    { appName: 'token-manager.aragonpm.eth', label: 'Tokens' },
    { appName: 'finance.aragonpm.eth', label: 'Finance' },
    { appName: 'dissent-voting.aragonpm.eth', label: 'Voting' },
    { appName: 'delay.aragonpm.eth', label: 'Delay' },
    { appName: 'time-lock.aragonpm.eth', label: 'Time Lock' },
    { appName: 'redemptions.aragonpm.eth', label: 'Redemptions' },
    { appName: 'token-request.aragonpm.eth', label: 'Token Request' },
  ],
  optionalModules: [{ appName: 'agent.aragonpm.eth', label: 'Agent' }],
  screens: [
    [
      data => completeDomain(data.domain) || 'Claim domain',
      props => <ClaimDomainScreen screenProps={props} />,
    ],
    ['Configure template', props => <VotingScreen screenProps={props} />],
    ['Configure template', props => <TokensScreen screenProps={props} />],
    ['Configure template', props => <DelayScreen screenProps={props} />],
    ['Configure template', props => <LockScreen screenProps={props} />],

    [
      'Review information',
      props => {
        const { domain, voting, tokens, delay, lock } = props.data
        return (
          <ReviewScreen
            screenProps={props}
            items={[
              {
                label: 'General info',
                fields: [
                  ['Organization template', 'Dandelion'],
                  ['Name', completeDomain(domain)],
                ],
              },
              {
                label: (
                  <KnownAppBadge
                    appName="dissent-voting.aragonpm.eth"
                    label="Voting"
                  />
                ),
                fields: VotingScreen.formatReviewFields(voting),
              },
              {
                label: (
                  <KnownAppBadge
                    appName="token-manager.aragonpm.eth"
                    label="Tokens"
                  />
                ),
                fields: TokensScreen.formatReviewFields(tokens),
              },
              {
                label: (
                  <KnownAppBadge appName="delay.aragonpm.eth" label="Delay" />
                ),
                fields: DelayScreen.formatReviewFields(delay),
              },
              {
                label: (
                  <KnownAppBadge
                    appName="time-lock.aragonpm.eth"
                    label="Time lock"
                  />
                ),
                fields: LockScreen.formatReviewFields(lock),
              },
            ]}
          />
        )
      },
    ],
  ],
  prepareTransactions(createTx, data) {
    const financePeriod = 0 // default
    const hasPayroll = false

    const { domain, optionalModules = [], tokens, voting } = data
    const useAgentAsVault = optionalModules.includes('agent.aragonpm.eth')

    const { tokenName, tokenSymbol, members } = tokens
    const baseStake = new BN(10).pow(new BN(18))
    const stakes = members.map(([_, stake]) =>
      baseStake.mul(new BN(stake.toString())).toString()
    )
    const accounts = members.map(([account]) => account)

    const { support, quorum, duration } = voting
    const onePercent = new BN(10).pow(new BN(16))
    const adjustedSupport = onePercent.mul(new BN(support)).toString()
    const adjustedQuorum = onePercent.mul(new BN(quorum)).toString()
    const adjustedDuration = new BN(duration).toString()
    const votingSettings = [adjustedSupport, adjustedQuorum, adjustedDuration]

    // Rinkeby has its gas limit capped at 7M, so some larger 6.5M+ transactions are
    // often not mined
    const forceMultipleTransactions =
      network.type === 'rinkeby' && members.length > 1

    if (!hasPayroll && !forceMultipleTransactions) {
      return [
        {
          name: 'Create organization',
          transaction: createTx('newTokenAndInstance', [
            tokenName,
            tokenSymbol,
            domain,
            accounts,
            stakes,
            votingSettings,
            financePeriod,
            useAgentAsVault,
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
          domain,
          accounts,
          stakes,
          votingSettings,
          financePeriod,
          useAgentAsVault,
        ]),
      },
    ]
  },
}
