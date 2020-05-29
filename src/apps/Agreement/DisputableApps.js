import React, { useCallback } from 'react'
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
} from '@aragon/ui'
import { KnownAppBadge } from '../../templates/kit'
import InfoField from './InfoField'

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

  const actions = [
    [handleUpdateApp, IconEdit, 'Update'],
    [handleRemoveApp, IconTrash, 'Remove'],
  ]

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
              color: ${theme.surfaceContentSecondary};
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

function EntryExpansion() {
  return (
    <div
      css={`
        width: 100%;
      `}
    >
      <InfoField label="test">dsdfsdf</InfoField>
      <InfoField label="test">dsdfsdf</InfoField>
      <InfoField label="test">dsdfsdf</InfoField>
      <InfoField label="test">dsdfsdf</InfoField>
    </div>
  )
}

function DisputableApps({ items }) {
  const layoutName = useLayout()
  return (
    <DataView
      fields={[
        { label: 'App', priority: 1, childStart: true },
        { label: 'Allowed Actions', align: 'left' },
      ]}
      entries={items}
      renderEntry={({ actions }) => renderEntry(actions, layoutName)}
      renderEntryExpansion={() => <EntryExpansion />}
      renderEntryActions={() => <EntryActions />}
    />
  )
}

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
