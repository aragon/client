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
import { DelayScreen, LockScreen, VotingScreen } from './config'

import header from './header.svg'
import icon from './icon.svg'
import getBlockTime from './config/helpers/getBlockTime'

const ETH_ADDRESS = '0x0000000000000000000000000000000000000000'

function completeDomain(domain) {
  return domain ? `${domain}.aragonid.eth` : ''
}

export default {
  id: 'dandelion-org-template-staging.open.aragonpm.eth',
  name: 'Dandelion',
  header,
  icon,
  description: `
  Facilitate collaboration by providing an organization structure that makes it easy for contributors to simply part ways when disagreements occur.
  `,
  // userGuideUrl:
  //   'https://help.aragon.org/article/32-create-a-new-reputation-organization',
  caseStudyUrl: 'aragon.org/case-study/hivecommons',
  sourceCodeUrl: 'https://github.com/aragon/dao-templates/tree/templates/1hive',
  registry: 'open.aragonpm.eth',
  apps: [
    { appName: 'token-manager.aragonpm.eth', label: 'Tokens' },
    { appName: 'finance.aragonpm.eth', label: 'Finance' },
    {
      appName: 'dandelion-voting.open.aragonpm.eth',
      label: 'Voting',
    },
    { appName: 'delay.open.aragonpm.eth', label: 'Delay' },
    { appName: 'time-lock.open.aragonpm.eth', label: 'Time Lock' },
    { appName: 'redemptions.open.aragonpm.eth', label: 'Redemptions' },
    { appName: 'token-request.open.aragonpm.eth', label: 'Token Request' },
  ],
  optionalApps: [{ appName: 'agent.aragonpm.eth', label: 'Agent' }],
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
                    appName="dandelion-voting.open.aragonpm.eth"
                    label="Voting"
                  />
                ),
                fields: VotingScreen.formatReviewFields(voting),
              },
              {
                label: (
                  <KnownAppBadge
                    appName="token-manager.open.aragonpm.eth"
                    label="Tokens"
                  />
                ),
                fields: TokensScreen.formatReviewFields(tokens),
              },
              {
                label: (
                  <KnownAppBadge
                    appName="delay.open.aragonpm.eth"
                    label="Delay"
                  />
                ),
                fields: DelayScreen.formatReviewFields(delay),
              },
              {
                label: (
                  <KnownAppBadge
                    appName="time-lock.open.aragonpm.eth"
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
    const hasPayroll = false
    const blockTime = getBlockTime()
    const { domain, optionalModules = [], tokens, voting, lock, delay } = data
    const useAgentAsVault = optionalModules.includes('agent.aragonpm.eth')

    const { tokenName, tokenSymbol, members } = tokens
    const baseStake = new BN(10).pow(new BN(18))
    const stakes = members.map(([_, stake]) =>
      baseStake.mul(new BN(stake.toString())).toString()
    )
    const accounts = members.map(([account]) => account)

    const { support, quorum, duration, buffer } = voting
    const onePercent = new BN(10).pow(new BN(16))
    const adjustedSupport = onePercent.mul(new BN(support)).toString()
    const adjustedQuorum = onePercent.mul(new BN(quorum)).toString()
    const numericVotingDuration = duration / blockTime
    const adjustedDuration = new BN(numericVotingDuration).toString()
    const numericBuffer = buffer / blockTime
    const adjustedBuffer = new BN(numericBuffer).toString()
    const votingSettings = [
      adjustedSupport,
      adjustedQuorum,
      adjustedDuration,
      adjustedBuffer,
    ]
    const { lockDuration, lockAmount, spamPenalty, tokenAddress } = lock
    const adjustedSpamPenalty = onePercent.mul(new BN(spamPenalty)).toString()
    const adjustedLockAmount = new BN(lockAmount.toString()).toString()
    const adjustedLockDuration = new BN(lockDuration).toString()
    const lockSettings = [
      adjustedLockDuration,
      adjustedLockAmount,
      adjustedSpamPenalty,
    ]

    const { delayDuration } = delay
    const adjustedDelayDuration = new BN(delayDuration).toString()
    const dissentWindowBlocks = new BN(
      delayDuration + numericVotingDuration
    ).toString()

    const acceptedDepositToken = [ETH_ADDRESS]

    // Rinkeby has its gas limit capped at 7M, so some larger 6.5M+ transactions are
    // often not mined
    const forceMultipleTransactions =
      network.type === 'rinkeby' && members.length > 1

    if (!hasPayroll && !forceMultipleTransactions) {
      return [
        {
          name: 'Create organization',
          transaction: createTx('newTokenAndBaseInstance', [
            tokenName,
            tokenSymbol,
            domain,
            accounts,
            stakes,
            useAgentAsVault,
          ]),
        },
        {
          name: 'Install dandelion apps',
          transaction: createTx('installDandelionApps', [
            domain,
            acceptedDepositToken,
            acceptedDepositToken,
            tokenAddress,
            lockSettings,
            votingSettings,
            adjustedDelayDuration,
            dissentWindowBlocks,
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
        transaction: createTx('newBaseInstance', [
          domain,
          accounts,
          stakes,
          useAgentAsVault,
        ]),
      },
      {
        name: 'Install dandelion apps',
        transaction: createTx('installDandelionApps', [
          domain,
          acceptedDepositToken,
          acceptedDepositToken,
          tokenAddress,
          lockSettings,
          votingSettings,
          adjustedDelayDuration,
        ]),
      },
    ]
  },
}
