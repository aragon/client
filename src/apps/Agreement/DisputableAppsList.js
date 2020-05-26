import React from 'react'
import PropTypes from 'prop-types'
import { DataView, ContextMenu, ContextMenuItem } from '@aragon/ui'
import { KnownAppBadge } from '../../templates/kit'

function DisputableAppsList({ items }) {
  return (
    <DataView
      fields={['App', 'Allowed actions']}
      entries={items}
      renderEntry={({ actions }) => {
        return [
          <div>
            <KnownAppBadge appName="voting.aragonpm.eth" label="Test app" />
          </div>,
          <div>
            {actions.map(action => action)}
            <ContextMenu>
              <ContextMenuItem>Some Action</ContextMenuItem>
              <ContextMenuItem>Another Action</ContextMenuItem>
            </ContextMenu>
          </div>,
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
    />
  )
}

DisputableAppsList.propTypes = {
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

export default DisputableAppsList
