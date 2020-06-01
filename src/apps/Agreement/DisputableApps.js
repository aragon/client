import React, { useCallback, useMemo } from 'react'
import PropTypes from 'prop-types'
import {
  DataView,
  ContextMenu,
  ContextMenuItem,
  IconEdit,
  IconTrash,
  useTheme,
  GU,
  useLayout,
  Help,
  Box,
  textStyle,
  tokenIconUrl,
} from '@aragon/ui'
import { KnownAppBadge } from '../../templates/kit'
import InfoField from './InfoField'
import noRegisteredApps from './assets/no-registered-apps.png'

function renderEntry(actions, layoutName) {
  return [
    <div
      css={`
        display flex;
        align-items: center;

        /* Height must match expansion button to align nicely */
        ${(layoutName === 'medium' || layoutName === 'large') &&
          'height: 32px;'}
        
      `}
    >
      <KnownAppBadge appName="voting.aragonpm.eth" label="Test app" />
    </div>,
    <React.Fragment>{actions.join(', ')}</React.Fragment>,
  ]
}

function EntryActions() {
  const theme = useTheme()

  const handleUpdateApp = useCallback(() => {}, [])
  const handleRemoveApp = useCallback(() => {}, [])

  const actions = useMemo(
    () => [
      [handleUpdateApp, IconEdit, 'Update'],
      [handleRemoveApp, IconTrash, 'Remove'],
    ],
    [handleUpdateApp, handleRemoveApp]
  )

  return (
    <ContextMenu>
      {actions.map(([onClick, Icon, label], index) => (
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
            <Icon />
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

function EmptyState() {
  const theme = useTheme()
  const { layoutName } = useLayout()

  return (
    <Box heading="Apps registered to this agreement">
      <div
        css={`
          display: flex;
          flex-direction: column;
          align-items: center;
        `}
      >
        <img
          src={noRegisteredApps}
          css={`
            height: ${layoutName === 'small' ? '100px' : '130px'};
          `}
        />

        <div
          css={`
            text-align: center;
            max-width: ${GU * 60}px;
          `}
        >
          <h2
            css={`
              ${textStyle('body1')}
              color: ${theme.surfaceContent};
              margin-top: ${GU * 3}px;
              margin-bottom: ${GU * 1}px;
            `}
          >
            There’re no registered apps yet.
          </h2>
          <p
            css={`
                ${textStyle('body2')}
                color: ${theme.surfaceContentSecondary};
              `}
          >
            You can configure any of the available apps, upgrade or install new
            ones, to make their actions bound by the Agreement.
          </p>
        </div>
      </div>
    </Box>
  )
}

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

SubtleLabel.propTypes = {
  children: PropTypes.node,
}

function TokenAmount({ tokenAddress, tokenSymbol, amount }) {
  const iconSize = 20

  return (
    <div
      css={`
        position: relative;
        padding-left: ${iconSize + GU}px;
      `}
    >
      <span
        css={`
          position: absolute;
          top: 0;
          left: 0;
          width: ${iconSize}px;
          height: ${iconSize}px;
          background-position: 50% 50%;
          background-repeat: no-repeat;
          background-size: contain;
          background-image: url(${tokenIconUrl(tokenAddress)});
        `}
      />
      <span>
        {amount} {tokenSymbol} <SubtleLabel>(per action)</SubtleLabel>
      </span>
    </div>
  )
}

TokenAmount.propTypes = {
  tokenAddress: PropTypes.string,
  tokenSymbol: PropTypes.string,
  amount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
}

function EntryExpansion() {
  return (
    <div
      css={`
        width: 100%;
        padding-top: ${GU * 3}px;
        padding-bottom: ${GU * 3}px;
      `}
    >
      <div
        css={`
          display: inline-grid;
          grid-template-columns: 1fr 1fr;
          column-gap: ${GU * 8}px;
          row-gap: ${GU * 3}px;
        `}
      >
        <InfoField
          label={
            <React.Fragment>
              Action Collateral
              <Help hint="What is Action Collateral?">
                <strong>Action Collateral</strong> is the lorem ipsum dolor sit
                amet, consectetur adipiscing elit.
              </Help>
            </React.Fragment>
          }
        >
          <TokenAmount
            tokenAddress="0x960b236A07cf122663c4303350609A66A7B288C0"
            tokenSymbol="ANT"
            amount="100"
          />
        </InfoField>
        <InfoField
          label={
            <React.Fragment>
              Challenge Period
              <Help hint="What is Challenge Period?">
                <strong>Challenge Period</strong> is the lorem ipsum dolor sit
                amet, consectetur adipiscing elit.
              </Help>
            </React.Fragment>
          }
        >
          48 <SubtleLabel>Hours</SubtleLabel>
        </InfoField>
        <InfoField
          label={
            <React.Fragment>
              Challenge Collateral
              <Help hint="What is Challenge Collateral?">
                <strong>Challenge Collateral</strong> is the lorem ipsum dolor
                sit amet, consectetur adipiscing elit.
              </Help>
            </React.Fragment>
          }
        >
          <TokenAmount
            tokenAddress="0x960b236A07cf122663c4303350609A66A7B288C0"
            tokenSymbol="ANT"
            amount="100"
          />
        </InfoField>
        <InfoField
          label={
            <React.Fragment>
              Settlement Period
              <Help hint="What is Settlement Period?">
                <strong>Settlement Period</strong> is the lorem ipsum dolor sit
                amet, consectetur adipiscing elit.
              </Help>
            </React.Fragment>
          }
        >
          24 <SubtleLabel>Hours</SubtleLabel>
        </InfoField>
        <InfoField
          label="Signer Eligibility"
          css={`
            grid-column: span 2;
          `}
        >
          Open to tokenholders with a minimun token balance of 1
        </InfoField>

        <InfoField
          label="Challenger Eligibility"
          css={`
            grid-column: span 2;
          `}
        >
          Open to everyone
        </InfoField>
      </div>
    </div>
  )
}

const DisputableApps = React.memo(({ items }) => {
  const layoutName = useLayout()

  if (items && items.length > 0) {
    return (
      <DataView
        fields={[
          { label: 'App', priority: 1, childStart: true },
          { label: 'Actions', align: 'left' },
        ]}
        entries={items}
        renderEntry={({ actions }) => renderEntry(actions, layoutName)}
        renderEntryExpansion={() => <EntryExpansion />}
        renderEntryActions={() => <EntryActions />}
      />
    )
  } else {
    return <EmptyState />
  }
})

DisputableApps.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      actions: PropTypes.arrayOf(PropTypes.string).isRequired,
      collateral: PropTypes.number.isRequired,
      challenge: PropTypes.number.isRequired,
      signerEligibility: PropTypes.number.isRequired,
      challengeEligibility: PropTypes.string.isRequired,
      challengePeriod: PropTypes.number.isRequired,
      settlementPeriod: PropTypes.number.isRequired,
    })
  ).isRequired,
}

export default DisputableApps
