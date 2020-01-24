/* eslint-disable react/prop-types */
import React from 'react'
import { Decimal } from 'decimal.js'
import {
  ClaimDomainScreen,
  FundraisingScreen,
  KnownAppBadge,
  ReviewScreen,
} from '../kit'
import Board from './components/Board'
import Share from './components/Share'
import BoardInfo from './components/BoardInfo'
import ShareInfo from './components/ShareInfo'
import header from './header.svg'
import icon from './icon.svg'

function BN(value) {
  return new Decimal(value)
}

const oneDay = BN(24).mul(BN(3600))
const oneMonth = BN(30).mul(oneDay)
const oneDAI = BN(10).pow(BN(18))
const onePercent = BN(10).pow(BN(16))
const onePercentPPM = BN(10).pow(BN(4))
const PPM = onePercentPPM.mul(BN(100))
const oneBlock = BN(15)
const one = BN(1)

function completeDomain(domain) {
  return domain ? `${domain}.aragonid.eth` : ''
}

function adjustVotingSettings(support, quorum) {
  // The max value for both support and quorum is 100% - 1
  const hundredPercent = onePercent.mul(BN(100))

  let adjustedSupport = onePercent.mul(BN(support))
  if (adjustedSupport.eq(hundredPercent)) {
    adjustedSupport = adjustedSupport.sub(one)
  }

  let adjustedQuorum = onePercent.mul(BN(quorum))
  if (adjustedQuorum.eq(hundredPercent)) {
    adjustedQuorum = adjustedQuorum.sub(one)
  }

  return [adjustedSupport.toFixed(0), adjustedQuorum.toFixed(0)]
}

function extractVotingSettings(voting) {
  const [adjustedSupport, adjustedQuorum] = adjustVotingSettings(
    voting.support,
    voting.quorum
  )
  const duration = BN(voting.duration).toFixed(0)

  return [adjustedSupport, adjustedQuorum, duration]
}

function extractFundraisingAppsSettings(fundraising) {
  const goal = oneDAI.mul(BN(fundraising.targetGoal)).toFixed(0)
  const period = oneDay.mul(BN(fundraising.fundingPeriod)).toFixed(0)
  const exchangeRate = PPM.div(BN(fundraising.presalePrice)).toFixed(0)
  const vestingCliffPeriod = oneDay.mul(BN(fundraising.cliffPeriod)).toFixed(0)
  const vestingCompletePeriod = oneDay
    .mul(BN(fundraising.vestingSchedule))
    .toFixed(0)
  const maximumMonthlyUpdates = onePercent
    .mul(BN(fundraising.maximumMonthlyUpdates))
    .toFixed(0)
  const supplyOfferedPct = onePercentPPM
    .mul(BN(fundraising.tokensOffered))
    .toFixed(0)
  const fundingForBeneficiaryPct = onePercentPPM
    .mul(BN(fundraising.projectFunding))
    .toFixed(0)

  return {
    goal,
    period,
    exchangeRate,
    vestingCliffPeriod,
    vestingCompletePeriod,
    maximumMonthlyUpdates,
    supplyOfferedPct,
    fundingForBeneficiaryPct,
  }
}

function extractCollateralizationSettings(fundraising) {
  const cwDAI = BN(0.1)

  const slippages = [
    BN(fundraising.slippageDai)
      .mul(onePercent)
      .toFixed(0),
    BN(fundraising.slippageAnt)
      .mul(onePercent)
      .toFixed(0),
  ]
  const tapRate = BN(fundraising.tapRate)
    .mul(oneDAI)
    .div(oneMonth)
    .mul(oneBlock)
    .toFixed(0)
  const tapFloor = oneDAI.mul(BN(fundraising.tapFloor)).toFixed(0)

  const xRate = one.div(BN(fundraising.presalePrice))
  const goal = BN(fundraising.targetGoal).times(oneDAI)
  const growth = BN(fundraising.expectedGrowth)
  const pctOffered = BN(fundraising.tokensOffered).div(BN(100))
  const pctBeneficiary = BN(fundraising.projectFunding).div(BN(100))

  const sSupply = goal.times(xRate).div(pctOffered)
  const sBalance = goal.times(one.minus(pctBeneficiary))
  const sPrice = BN(fundraising.initialPricePerShare)
  const sMarketCap = sSupply.times(sPrice)

  const eMarketCap = sMarketCap.times(growth)
  const ePrice = sPrice.times(growth.squareRoot())

  const ppSupplyDAI = ePrice
    .div(eMarketCap.pow(one.minus(cwDAI)).times(sPrice.pow(cwDAI)))
    .pow(one.div(cwDAI.minus(one)))
  const vSupplyDAI = ppSupplyDAI.minus(sSupply)

  const ppBalanceDAI = sPrice.times(ppSupplyDAI).times(cwDAI)
  const vBalanceDAI = ppBalanceDAI.minus(sBalance)

  const virtualSupplies = [vSupplyDAI.toFixed(0), vSupplyDAI.toFixed(0)]
  const virtualBalances = [
    vBalanceDAI.toFixed(0),
    vBalanceDAI.div(BN(10)).toFixed(0),
  ]

  return {
    virtualSupplies,
    virtualBalances,
    slippages,
    tapRate,
    tapFloor,
  }
}

export default {
  id: 'fundraising-multisig-template.aragonpm.eth',
  name: 'Fundraising',
  beta: true,
  header,
  icon,
  description: `
    Launch a transparent and accountable crowdfunding campaign for your
    organization.
  `,
  userGuideUrl: 'https://fundraising.aragon.black/',
  sourceCodeUrl: 'https://github.com/AragonBlack/fundraising',
  registry: 'aragonpm.eth',
  apps: [
    {
      appName: 'aragon-fundraising.aragonpm.eth',
      label: 'Fundraising',
    },
    { appName: 'agent.aragonpm.eth', label: 'Agent: Reserve Pool' },
    { appName: 'voting.aragonpm.eth', label: 'Voting: Board' },
    { appName: 'token-manager.aragonpm.eth', label: 'Tokens: Board' },
    { appName: 'voting.aragonpm.eth', label: 'Voting: Shareholder' },
    { appName: 'token-manager.aragonpm.eth', label: 'Tokens: Shareholder' },
    { appName: 'finance.aragonpm.eth', label: 'Finance' },
  ],
  optionalApps: [],
  screens: [
    [
      data => completeDomain(data.domain) || 'Claim domain',
      props => <ClaimDomainScreen screenProps={props} />,
    ],
    ['Configure board', props => <BoardInfo screenProps={props} />],
    [
      'Configure board',
      props => (
        <Board dataKey="board" screenProps={props} title="Configure board" />
      ),
    ],
    ['Configure shareholders', props => <ShareInfo screenProps={props} />],
    [
      'Configure shareholders',
      props => (
        <Share
          dataKey="share"
          screenProps={props}
          title="Configure shareholders"
        />
      ),
    ],
    [
      'Configure fundraising',
      props => <FundraisingScreen screenProps={props} />,
    ],
    [
      'Review information',
      props => {
        const { domain, board, share, fundraising } = props.data
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
                label: 'Board',
                fields: Board.formatReviewFields(board),
              },
              {
                label: 'Shareholders',
                fields: Share.formatReviewFields(share),
              },
              {
                label: (
                  <KnownAppBadge
                    appName="aragon-fundraising.aragonpm.eth"
                    label="Fundraising"
                  />
                ),
                fields: FundraisingScreen.formatReviewFields(fundraising),
              },
            ]}
          />
        )
      },
    ],
  ],
  prepareTransactions(createTx, data) {
    const financePeriod = 0 // default
    const openDate = 0 // default

    const { domain, board, share, fundraising } = data

    const boardMembers = board.members
    const boardVotingSettings = extractVotingSettings(board)
    const shareVotingSettings = extractVotingSettings(share)
    const {
      goal,
      period,
      exchangeRate,
      vestingCliffPeriod,
      vestingCompletePeriod,
      maximumMonthlyUpdates,
      supplyOfferedPct,
      fundingForBeneficiaryPct,
    } = extractFundraisingAppsSettings(fundraising)
    const {
      virtualSupplies,
      virtualBalances,
      slippages,
      tapRate,
      tapFloor,
    } = extractCollateralizationSettings(fundraising)

    return [
      {
        name: 'Prepare instance',
        transaction: createTx('prepareInstance', [
          board.tokenName,
          board.tokenSymbol,
          boardMembers,
          boardVotingSettings,
          financePeriod,
        ]),
      },
      {
        name: 'Install share apps',
        transaction: createTx('installShareApps', [
          share.tokenName,
          share.tokenSymbol,
          shareVotingSettings,
        ]),
      },
      {
        name: 'Install fundraising apps',
        transaction: createTx('installFundraisingApps', [
          goal,
          period,
          exchangeRate,
          vestingCliffPeriod,
          vestingCompletePeriod,
          supplyOfferedPct,
          fundingForBeneficiaryPct,
          openDate,
          fundraising.batchLength,
          maximumMonthlyUpdates,
          maximumMonthlyUpdates,
        ]),
      },
      {
        name: 'Finalize instance',
        transaction: createTx('finalizeInstance', [
          domain,
          virtualSupplies,
          virtualBalances,
          slippages,
          tapRate,
          tapFloor,
        ]),
      },
    ]
  },
}
