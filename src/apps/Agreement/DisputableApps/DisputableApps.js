import React from 'react'
import {
  ContextMenu,
  ContextMenuItem,
  DataView,
  Help,
  TokenBadge,
  useLayout,
  useTheme,
  GU,
} from '@aragon/ui'
import { DisputableAppDetailsType } from './../prop-types'
import InfoField from './../InfoField'
import { KnownAppBadge } from '../../../templates/kit'

const EXPANDABLE_ROW_GAP = `${3 * GU}px`

const DisputableApps = React.memo(({ items }) => {
  const { layoutName } = useLayout()
  const theme = useTheme()
  const compactMode = layoutName === 'small'

  return (
    <DataView
      fields={[
        { label: 'App', priority: 1, childStart: true },
        { label: 'Actions', align: 'left' },
      ]}
      entries={items}
      renderEntry={entry => renderEntry(entry, compactMode)}
      renderEntryExpansion={entry => renderEntryExpansion(entry, compactMode)}
      renderEntryActions={entry => renderEntryActions(entry, theme)}
    />
  )
})

function renderEntry({ allowedActions }, compactMode) {
  return [
    <div
      css={`
        display flex;
        align-items: center;

        /* Height must match expansion button to align nicely */
        ${!compactMode && `height: ${4 * GU}px;`}
      `}
    >
      {/* TODO: Replace with LocalLabelAppBadge */}
      <KnownAppBadge appName="voting.aragonpm.eth" label="Voting" />
    </div>,
    <React.Fragment>{allowedActions.join(', ')}</React.Fragment>,
  ]
}

function renderEntryActions(entry, theme) {
  const { entryActions } = entry

  return (
    <ContextMenu>
      {entryActions.map(([onClick, Icon, label], index) => (
        <ContextMenuItem onClick={onClick} key={index}>
          <span
            css={`
              position: relative;
              display: flex;
              align-items: center;
              justify-content: center;
              color: ${theme.surfaceIcon};
            `}
          >
            {Icon}
          </span>
          <span
            css={`
              margin-left: ${1 * GU}px;
            `}
          >
            {label}
          </span>
        </ContextMenuItem>
      ))}
    </ContextMenu>
  )
}

/* eslint-disable react/prop-types */
function SubtleLabel({ children }) {
  const theme = useTheme()

  return (
    <span
      css={`
        color: ${theme.surfaceContentSecondary};
      `}
    >
      {children}
    </span>
  )
}

function TokenAmount({ address, symbol, amount }) {
  return (
    <div
      css={`
        display: flex;
        align-items: center;
        position: relative;

        /* Align left edge against label */
        margin-left: -${1 * GU}px;
      `}
    >
      <TokenBadge name={amount} address={address} symbol={symbol} compact />
      <SubtleLabel>(per action)</SubtleLabel>
    </div>
  )
}
/* eslint-disable react/prop-types */

function renderEntryExpansion(entry, compactMode) {
  const {
    actionCollateral,
    challengeCollateral,
    settlementPeriod,
    challengePeriod,
    signerEligibility,
    challengeEligibility,
  } = entry

  return (
    <div
      css={`
        width: 100%;
        padding-top: ${3 * GU}px;
        padding-bottom: ${3 * GU}px;
      `}
    >
      <div
        css={`
          display: inline-grid;
          grid-auto-flow: ${compactMode ? 'row' : 'column'};
          column-gap: ${8 * GU}px;
        `}
      >
        <div>
          <InfoField
            label={
              <React.Fragment>
                Action Collateral
                <Help hint="What is Action Collateral?">
                  <strong>Action Collateral</strong>.
                </Help>
              </React.Fragment>
            }
            css={`
              margin-bottom: ${EXPANDABLE_ROW_GAP};
            `}
          >
            <TokenAmount
              address={actionCollateral.address}
              symbol={actionCollateral.symbol}
              amount={actionCollateral.amount}
            />
          </InfoField>
          <InfoField
            label={
              <React.Fragment>
                Challenge Collateral
                <Help hint="What is Challenge Collateral?">
                  <strong>Challenge Collateral</strong>.
                </Help>
              </React.Fragment>
            }
            css={`
              margin-bottom: ${EXPANDABLE_ROW_GAP};
            `}
          >
            <TokenAmount
              address={challengeCollateral.address}
              symbol={challengeCollateral.symbol}
              amount={challengeCollateral.amount}
            />
          </InfoField>
        </div>
        <div>
          <InfoField
            label={
              <React.Fragment>
                Challenge Period
                <Help hint="What is Challenge Period?">
                  <strong>Challenge Period</strong>.
                </Help>
              </React.Fragment>
            }
            css={`
              margin-bottom: ${EXPANDABLE_ROW_GAP};
            `}
          >
            {settlementPeriod} <SubtleLabel>Hours</SubtleLabel>
          </InfoField>

          <InfoField
            label={
              <React.Fragment>
                Settlement Period
                <Help hint="What is Settlement Period?">
                  <strong>Settlement Period</strong>.
                </Help>
              </React.Fragment>
            }
            css={`
              margin-bottom: ${EXPANDABLE_ROW_GAP};
            `}
          >
            {challengePeriod} <SubtleLabel>Hours</SubtleLabel>
          </InfoField>
        </div>
      </div>

      <InfoField
        label="Signer Eligibility"
        css={`
          margin-bottom: ${EXPANDABLE_ROW_GAP};
        `}
      >
        Open to tokenholders with a minimun token balance of
        <div
          css={`
            display: inline-block;
            position: relative;
            top: ${0.5 * GU}px;
          `}
        >
          <TokenBadge
            address={signerEligibility.address}
            name={signerEligibility.amount}
            symbol={signerEligibility.symbol}
            compact
          />
        </div>
      </InfoField>

      <InfoField label="Challenger Eligibility">
        {challengeEligibility}
      </InfoField>
    </div>
  )
}

DisputableApps.propTypes = {
  items: DisputableAppDetailsType.isRequired,
}

export default DisputableApps
