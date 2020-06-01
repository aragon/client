import React from 'react'
import {
  DataView,
  ContextMenu,
  ContextMenuItem,
  useTheme,
  GU,
  useLayout,
  Help,
  TokenBadge,
} from '@aragon/ui'
import { KnownAppBadge } from '../../../templates/kit'
import InfoField from './../InfoField'
import { ItemsType } from './../prop-types'
import SubtleLabel from './SubtleLabel'
import TokenAmount from './TokenAmount'

const EXPANDABLE_ROW_GAP = `${GU * 3}px`

const DisputableApps = React.memo(({ items }) => {
  const { layoutName } = useLayout()
  const theme = useTheme()

  return (
    <DataView
      fields={[
        { label: 'App', priority: 1, childStart: true },
        { label: 'Actions', align: 'left' },
      ]}
      entries={items}
      renderEntry={entry => renderEntry(entry, layoutName)}
      renderEntryExpansion={entry => renderEntryExpansion(entry, layoutName)}
      renderEntryActions={entry => renderEntryActions(entry, theme)}
    />
  )
})

DisputableApps.propTypes = {
  items: ItemsType.isRequired,
}

function renderEntry({ allowedActions }, layoutName) {
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

function renderEntryExpansion(entry, layoutName) {
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
        padding-top: ${GU * 3}px;
        padding-bottom: ${GU * 3}px;
      `}
    >
      <div
        css={`
          display: inline-grid;
          grid-template-columns: ${layoutName === 'small' ? '1fr' : '1fr 1fr'};
          column-gap: ${GU * 8}px;
        `}
      >
        <div>
          <InfoField
            label={
              <React.Fragment>
                Action Collateral
                <Help hint="What is Action Collateral?">
                  <strong>Action Collateral</strong> is the lorem ipsum dolor
                  sit amet, consectetur adipiscing elit.
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
                  <strong>Challenge Collateral</strong> is the lorem ipsum dolor
                  sit amet, consectetur adipiscing elit.
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
                  <strong>Challenge Period</strong> is the lorem ipsum dolor sit
                  amet, consectetur adipiscing elit.
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
                  <strong>Settlement Period</strong> is the lorem ipsum dolor
                  sit amet, consectetur adipiscing elit.
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
        Open to tokenholders with a minimun token balance of{' '}
        {signerEligibility.amount}{' '}
        <div
          css={`
            display: inline-block;
            position: relative;
            top: 3px;
          `}
        >
          <TokenBadge
            address={signerEligibility.address}
            symbol={signerEligibility.symbol}
          />
        </div>
      </InfoField>

      <InfoField label="Challenger Eligibility">
        {challengeEligibility}
      </InfoField>
    </div>
  )
}

export default DisputableApps
