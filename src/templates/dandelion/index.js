/* eslint-disable react/prop-types */
import React from 'react'
import BN from 'bn.js'
import {
  ClaimDomainScreen,
  KnownAppBadge,
  ReviewScreen,
  TokensScreen,
} from '../kit'
import {
  DandelionVotingScreen,
  LockScreen,
  RedemptionsScreen,
  TokenRequestScreen,
} from './config'

import getBlockTime from './config/helpers/getBlockTime'
import header from './header.svg'
import icon from './icon.svg'

const onePercent = new BN(10).pow(new BN(16))

function completeDomain(domain) {
  return domain ? `${domain}.aragonid.eth` : ''
}

function adjustVotingSettings(support, quorum) {
  // The max value for both support and quorum is 100% - 1
  const onePercent = new BN(10).pow(new BN(16))
  const hundredPercent = onePercent.mul(new BN(100))

  let adjustedSupport = onePercent.mul(new BN(support))
  if (adjustedSupport.eq(hundredPercent)) {
    adjustedSupport = adjustedSupport.sub(new BN(1))
  }

  let adjustedQuorum = onePercent.mul(new BN(quorum))
  if (adjustedQuorum.eq(hundredPercent)) {
    adjustedQuorum = adjustedQuorum.sub(new BN(1))
  }

  return [adjustedSupport.toString(), adjustedQuorum.toString()]
}

export default {
  id: 'dandelion-org-template.aragonpm.eth',
  name: 'Dandelion',
  not_maintained: true,
  header,
  icon,
  description: `
  Facilitate collaboration with an organization that makes it easy for contributors to simply part ways when disagreements occur.
  `,
  userGuideUrl:
    'https://github.com/1Hive/dandelion-template/blob/master/README.md',
  sourceCodeUrl: 'https://github.com/1hive/dandelion-org',
  registry: 'aragonpm.eth',
  apps: [
    { appName: 'token-manager.aragonpm.eth', label: 'Tokens' },
    { appName: 'finance.aragonpm.eth', label: 'Finance' },
    {
      appName: 'dandelion-voting.aragonpm.eth',
      label: 'Voting',
    },
    { appName: 'time-lock.aragonpm.eth', label: 'Time Lock' },
    { appName: 'redemptions.aragonpm.eth', label: 'Redemptions' },
    { appName: 'token-request.aragonpm.eth', label: 'Token Request' },
  ],
  optionalApps: [{ appName: 'agent.aragonpm.eth', label: 'Agent' }],
  screens: [
    [
      data => completeDomain(data.domain) || 'Claim domain',
      props => <ClaimDomainScreen screenProps={props} />,
    ],
    [
      'Configure template',
      props => <DandelionVotingScreen screenProps={props} />,
    ],
    ['Configure template', props => <TokensScreen screenProps={props} />],
    ['Configure template', props => <LockScreen screenProps={props} />],
    ['Configure template', props => <RedemptionsScreen screenProps={props} />],
    ['Configure template', props => <TokenRequestScreen screenProps={props} />],

    [
      'Review information',
      props => {
        const {
          domain,
          voting,
          tokens,
          lock,
          redemptions,
          tokenRequest,
        } = props.data
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
                    appName="dandelion-voting.aragonpm.eth"
                    label="Voting"
                  />
                ),
                fields: DandelionVotingScreen.formatReviewFields(voting),
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
                  <KnownAppBadge
                    appName="time-lock.aragonpm.eth"
                    label="Time lock"
                  />
                ),
                fields: LockScreen.formatReviewFields(lock),
              },
              {
                label: (
                  <KnownAppBadge
                    appName="redemptions.aragonpm.eth"
                    label="Redemptions"
                  />
                ),
                fields: RedemptionsScreen.formatReviewFields(redemptions),
              },
              {
                label: (
                  <KnownAppBadge
                    appName="token-request.aragonpm.eth"
                    label="Token Request"
                  />
                ),
                fields: TokenRequestScreen.formatReviewFields(tokenRequest),
              },
            ]}
          />
        )
      },
    ],
  ],
  prepareTransactions(createTx, data, networkType) {
    const {
      domain,
      optionalApps = [],
      tokens,
      voting,
      lock,
      redemptions,
      tokenRequest,
    } = data
    const useAgentAsVault = optionalApps.includes('agent.aragonpm.eth')
    const blockTime = getBlockTime(networkType)

    // Tokens app
    const { tokenName, tokenSymbol, members } = tokens
    const baseStake = new BN(10).pow(new BN(18))
    const stakes = members.map(([_, stake]) =>
      baseStake.mul(new BN(stake.toString())).toString()
    )
    const accounts = members.map(([account]) => account)

    // Finance app
    const financePeriod = 0 // Fallback to default 30 days

    // Voting app
    const { support, quorum, duration, buffer, delay } = voting

    const [adjustedSupport, adjustedQuorum] = adjustVotingSettings(
      support,
      quorum
    )
    const numericVotingDuration = duration / blockTime
    const adjustedDuration = new BN(numericVotingDuration).toString()

    const numericBuffer = buffer / blockTime
    const adjustedBuffer = new BN(numericBuffer).toString()

    const numericDelay = delay / blockTime
    const adjustedDelay = new BN(numericDelay).toString()

    const votingSettings = [
      adjustedSupport,
      adjustedQuorum,
      adjustedDuration,
      adjustedBuffer,
      adjustedDelay,
    ]

    // Time Lock app
    const { lockDuration, lockAmount, spamPenalty, lockToken } = lock
    const lockTokenAddress = lockToken.data.address
    const adjustedLockDuration = new BN(lockDuration).toString()
    const adjustedLockAmount = new BN(lockAmount.toString()).toString()
    const adjustedSpamPenalty = onePercent.mul(new BN(spamPenalty)).toString()
    const lockSettings = [
      adjustedLockDuration,
      adjustedLockAmount,
      adjustedSpamPenalty,
    ]

    // Redemptions apps
    const redeemableTokens = redemptions.redeemableTokens.map(
      ({ token }) => token.address
    )

    // Token Request app
    const acceptedDepositToken = tokenRequest.acceptedTokens
      .map(({ token }) => token.address)
      .sort()

    return [
      {
        name: 'Create organization',
        transaction: createTx('newTokenAndBaseInstance', [
          tokenName,
          tokenSymbol,
          accounts,
          stakes,
          financePeriod,
          useAgentAsVault,
        ]),
      },
      {
        name: 'Install dandelion apps',
        transaction: createTx('installDandelionApps', [
          domain,
          redeemableTokens,
          acceptedDepositToken,
          lockTokenAddress,
          lockSettings,
          votingSettings,
        ]),
      },
    ]
  },
}
