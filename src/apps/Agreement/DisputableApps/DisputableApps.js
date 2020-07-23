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
import LocalLabelAppBadge from '../../../components/LocalLabelAppBadge/LocalLabelAppBadge'

const DisputableApps = React.memo(({ items }) => {
  const { layoutName } = useLayout()
  const theme = useTheme()
  const compactMode = layoutName === 'small'

  return (
    <DataView
      fields={[
        { label: 'App', priority: 1, childStart: true },
        { label: 'Allowed actions', align: 'left' },
      ]}
      entries={items}
      renderEntry={entry => renderEntry(entry, compactMode)}
      renderEntryExpansion={entry => renderEntryExpansion(entry, compactMode)}
      renderEntryActions={entry => renderEntryActions(entry, theme)}
    />
  )
})

function renderEntry({ allowedActions, app }, compactMode) {
  return [
    <div
      css={`
        display flex;
        align-items: center;

        /* Height must match expansion button to align nicely */
        ${!compactMode && `height: ${4 * GU}px;`}
      `}
    >
      {app && <LocalLabelAppBadge app={app} apps={[]} noIdentifier />}
    </div>,
    <React.Fragment>
      {allowedActions.length > 0
        ? allowedActions.join(', ')
        : 'No assigned actions to display'}
    </React.Fragment>,
  ]
}

function renderEntryActions(entry, theme) {
  const { entryActions } = entry

  return (
    <ContextMenu disabled>
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
      <TokenBadge
        name={amount}
        address={address}
        symbol={symbol}
        compact
        badgeOnly
      />
      <SubtleLabel>(per action)</SubtleLabel>
    </div>
  )
}
/* eslint-disable react/prop-types */

function renderEntryExpansion(entry, compactMode) {
  const { actionCollateral, challengeCollateral, settlementPeriod } = entry

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
          grid-auto-flow: row;
          grid-gap: ${3 * GU}px;
        `}
      >
        <InfoField
          label={
            <React.Fragment>
              Action Collateral
              <Help hint="What is Action Collateral?">
                The <strong>action collateral</strong> is the amount of
                collateral tokens required to be locked every time an action is
                created. This amount will be automatically locked from the
                staking pool balance given that access is granted to the
                Agreements app as the Lock Manager.
              </Help>
            </React.Fragment>
          }
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
                The <strong>challenge collateral</strong> is the amount of
                collateral tokens required to be locked every time an action is
                challenged.
              </Help>
            </React.Fragment>
          }
        >
          <TokenAmount
            address={challengeCollateral.address}
            symbol={challengeCollateral.symbol}
            amount={challengeCollateral.amount}
          />
        </InfoField>

        <InfoField
          label={
            <React.Fragment>
              Settlement Period
              <Help hint="What is Challenge Period?">
                The <strong>settlement period</strong> is the interval of time
                that starts when a disputable action is challenged and lasts
                until it’s resolved between the parties (submitter and
                challenger), by accepting the settlement offer or by raising the
                dispute to Aragon Court.
              </Help>
            </React.Fragment>
          }
        >
          {settlementPeriod} <SubtleLabel>Hours</SubtleLabel>
        </InfoField>
      </div>
    </div>
  )
}

DisputableApps.propTypes = {
  items: DisputableAppDetailsType.isRequired,
}

export default DisputableApps
