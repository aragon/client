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
} from '@aragon/ui'
import { KnownAppBadge } from '../../templates/kit'

/* eslint-disable react/prop-types */
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
/* eslint-enable react/prop-types */

function DisputableApps({ items }) {
  return (
    <DataView
      fields={[
        { label: 'App', priority: 1, childStart: true },
        { label: 'Allowed Actions', align: 'left' },
      ]}
      entries={items}
      renderEntry={({ actions }) => {
        return [
          <div
            css={`
              display flex;
              align-items: center;

              /* Height must match expansion button to align nicely */
              height: 32px;
            `}
          >
            <KnownAppBadge appName="voting.aragonpm.eth" label="Test app" />
          </div>,
          <React.Fragment>{actions.join(', ')}</React.Fragment>,
        ]
      }}
      renderEntryExpansion={() => (
        <div
          css={`
            width: 100%;
          `}
        >
          Content
        </div>
      )}
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
