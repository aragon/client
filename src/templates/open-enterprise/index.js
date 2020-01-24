import React, { useEffect } from 'react'
import BN from 'bn.js'
import {
  ClaimDomainScreen,
  DotVotingScreen,
  KnownAppBadge,
  ReviewScreen,
  VotingScreen,
} from '../kit'

import TokenSelection from './components/TokenSelection'
import Tokens from './components/AdvancedTokens'

import header from './header.svg'
import icon from './icon.svg'

const ONE_PERCENT = new BN(10).pow(new BN(16))

function completeDomain(domain) {
  return domain ? `${domain}.aragonid.eth` : ''
}

function adjustVotingSettings(support, quorum) {
  // The max value for both support and quorum is 100% - 1
  const hundredPercent = ONE_PERCENT.mul(new BN(100))

  let adjustedSupport = ONE_PERCENT.mul(new BN(support))
  if (adjustedSupport.eq(hundredPercent)) {
    adjustedSupport = adjustedSupport.sub(new BN(1))
  }

  let adjustedQuorum = ONE_PERCENT.mul(new BN(quorum))
  if (adjustedQuorum.eq(hundredPercent)) {
    adjustedQuorum = adjustedQuorum.sub(new BN(1))
  }

  return [adjustedSupport.toString(), adjustedQuorum.toString()]
}

function adjustDotVotingSettings(dvSupport, dvQuorum) {
  const adjustedDvSupport = ONE_PERCENT.mul(new BN(dvSupport))

  // The min value for quorum must be 1 or greater
  const adjustedDvQuorum = new BN(dvQuorum).isZero()
    ? new BN(1)
    : ONE_PERCENT.mul(new BN(dvQuorum))

  return [adjustedDvSupport.toString(), adjustedDvQuorum.toString()]
}

const showDomainOrText = data => completeDomain(data.domain) || 'Claim domain'

const loadScreen = ScreenComponent => props => (
  <ScreenComponent screenProps={props} />
)

const loadReviewScreen = () => props => {
  const {
    domain,
    dotVoting,
    tokens,
    secondTokens,
    selectedTokens,
    voting,
  } = props.data
  const tokensReviewItems = [
    {
      label: (
        <KnownAppBadge
          appName="token-manager.aragonpm.eth"
          label={`${selectedTokens > 1 ? 'First ' : ''}Tokens`}
        />
      ),
      fields: Tokens.formatReviewFields(tokens),
    },
    {
      label: (
        <KnownAppBadge
          appName="token-manager.aragonpm.eth"
          label="Second Tokens"
        />
      ),
      fields:
        selectedTokens > 1 ? Tokens.formatReviewFields(secondTokens) : null,
    },
  ]

  const adjustedTokens =
    selectedTokens > 1 ? tokensReviewItems : [tokensReviewItems[0]]
  const formatGovToken = app => {
    const govToken = [tokens, secondTokens][app.govToken]
    return selectedTokens > 1
      ? [
          [
            'Governance Token',
            `${govToken.tokenName} (${govToken.tokenSymbol})`,
          ],
        ]
      : []
  }

  return (
    <ReviewScreen
      screenProps={props}
      items={[
        {
          label: 'General info',
          fields: [
            ['Organization template', 'Open Enterprise'],
            ['Name', completeDomain(domain)],
          ],
        },
        ...adjustedTokens,
        {
          label: <KnownAppBadge appName="voting.aragonpm.eth" label="Voting" />,
          fields: [
            ...formatGovToken(voting),
            ...VotingScreen.formatReviewFields(voting),
          ],
        },
        {
          label: (
            <KnownAppBadge
              appName="dot-voting.aragonpm.eth"
              label="Dot Voting"
            />
          ),
          fields: [
            ...formatGovToken(dotVoting),
            ...DotVotingScreen.formatReviewFields(dotVoting),
          ],
        },
      ]}
    />
  )
}

/* A bit hacky but simple, just a component
 * to go back/next screen on mount,
 * needed to adjust single token case, as the screens number value seems to be
 * statically accessed just once, at the beginning of the onboarding process
 */
const conditionalToken = () => props => {
  const { back, data, next } = props
  useEffect(() => {
    if (data.selectedTokens === 1) {
      data.skip ? back() : next({ ...data, skip: true })
    }
  }, []) // eslint-disable-line

  return <Tokens screenProps={props} dataKey="secondTokens" />
}

export const conditionalScreens = () => [
  [showDomainOrText, loadScreen(ClaimDomainScreen)],
  ['Configure template', loadScreen(TokenSelection)],
  ['Configure template', loadScreen(Tokens)],
  ['Configure template', conditionalToken()],
  ['Configure template', loadScreen(VotingScreen)],
  ['Configure template', loadScreen(DotVotingScreen)],
  ['Review information', props => loadReviewScreen()(props)],
]

export default {
  id: 'open-enterprise-template.aragonpm.eth',
  name: 'Open Enterprise',
  header,
  icon,
  description: `
    A suite of apps for organizations, including project management,
    bounties, budget planning and rewards.
  `,
  userGuideUrl: 'https://autark.gitbook.io/open-enterprise/',
  sourceCodeUrl: 'https://github.com/AutarkLabs/open-enterprise',
  registry: 'aragonpm.eth',
  optionalApps: [{ appName: 'agent.aragonpm.eth', label: 'Agent' }],
  apps: [
    { appName: 'voting.aragonpm.eth', label: 'Voting' },
    { appName: 'token-manager.aragonpm.eth', label: 'Tokens' },
    { appName: 'finance.aragonpm.eth', label: 'Finance' },
    { appName: 'address-book.aragonpm.eth', label: 'Address Book' },
    { appName: 'allocations.aragonpm.eth', label: 'Allocations' },
    { appName: 'dot-voting.aragonpm.eth', label: 'Dot Voting' },
    { appName: 'projects.aragonpm.eth', label: 'Projects' },
    { appName: 'rewards.aragonpm.eth', label: 'Rewards' },
  ],
  screens: conditionalScreens(),
  prepareTransactions(createTx, data) {
    const allocationsPeriod = 0 // default
    const financePeriod = 0 // default

    const {
      domain,
      dotVoting,
      optionalApps = [],
      secondTokens,
      selectedTokens,
      tokens,
      voting,
    } = data

    const useAgentAsVault = optionalApps.includes('agent.aragonpm.eth')

    const tokens2 = selectedTokens > 1 ? secondTokens : {}
    const { fixedStake, tokenName, tokenSymbol, members, transferable } = tokens
    const {
      fixedStake: fixedStake2,
      tokenName: tokenName2 = '',
      tokenSymbol: tokenSymbol2 = '',
      members: members2 = [],
      transferable: transferable2,
    } = tokens2

    const baseStake = new BN(10).pow(new BN(18))
    const stakes = members.map(([_, stake]) =>
      baseStake.mul(new BN(stake.toString())).toString()
    )
    const accounts = members.map(([account]) => account)
    const stakes2 = members2.map(([_, stake]) =>
      baseStake.mul(new BN(stake.toString())).toString()
    )
    const accounts2 = members2.map(([account]) => account)

    const { support, quorum, duration, govToken } = voting
    const [adjustedSupport, adjustedQuorum] = adjustVotingSettings(
      support,
      quorum
    )
    const adjustedDuration = new BN(duration).toString()
    const votingSettings = [adjustedSupport, adjustedQuorum, adjustedDuration]

    const {
      support: dvSupport,
      quorum: dvQuorum,
      duration: dvDuration,
      govToken: dvGovToken,
    } = dotVoting
    const [adjustedDvSupport, adjustedDvQuorum] = adjustDotVotingSettings(
      dvSupport,
      dvQuorum
    )
    const adjustedDvDuration = new BN(dvDuration).toString()
    const dotVotingSettings = [
      adjustedDvQuorum,
      adjustedDvSupport,
      adjustedDvDuration,
    ]

    /* For Open Enterprise, is currently not possible to use a single tx, the creation process cost is ~10M gas */
    return [
      {
        name: 'Create organization',
        transaction: createTx('newTokensAndInstance', [
          domain,
          tokenName,
          tokenSymbol,
          tokenName2,
          tokenSymbol2,
          [...dotVotingSettings, ...votingSettings],
          [Boolean(dvGovToken), Boolean(govToken)],
          useAgentAsVault,
        ]),
      },
      {
        name: 'Setup Tokens',
        transaction: createTx('newTokenManagers', [
          accounts,
          stakes,
          accounts2,
          stakes2,
          [fixedStake, transferable, fixedStake2, transferable2],
        ]),
      },
      {
        name: 'Finalize DAO creation',
        transaction: createTx('finalizeDao', [
          [financePeriod, allocationsPeriod],
          false, // use Discussions App
        ]),
      },
    ]
  },
}
