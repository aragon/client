import React from 'react'
import PropTypes from 'prop-types'
import { textStyle, GU, useTheme, ProgressBar, Info } from '@aragon/ui'
import DeploymentStepsItem from './DeploymentStepsItem'
import { TransactionStatusType } from '../../prop-types'

function DeploymentStepsPanel({ transactionsStatus, pending, allSuccess }) {
  const theme = useTheme()

  return (
    <aside
      css={`
        display: flex;
        flex-direction: column;
        width: 100%;
        min-height: 100%;
        padding: ${16 * GU}px ${3 * GU}px ${2 * GU}px;
        background: ${theme.surface};
        border-right: 1px solid ${theme.border};
      `}
    >
      <ProgressBar
        value={Math.max(
          0,
          Math.min(1, allSuccess ? 1 : pending / transactionsStatus.length)
        )}
      />
      <div
        css={`
          padding: ${3 * GU}px 0 ${3 * GU}px;
          ${textStyle('body1')};
          text-align: center;
          color: ${theme.surfaceContentSecondary};
        `}
      >
        Launching your organization
      </div>

      <div
        css={`
          flex-grow: 1;
          padding-top: ${8 * GU}px;
          padding-bottom: ${3 * GU}px;
        `}
      >
        <h1
          css={`
            ${textStyle('label2')};
            color: ${theme.surfaceContentSecondary};
          `}
        >
          Signature process
        </h1>

        <div>
          {transactionsStatus.map(({ name, status }, index) => (
            <DeploymentStepsItem
              key={index}
              index={index}
              name={name}
              status={status}
            />
          ))}
        </div>
      </div>

      {!allSuccess && (
        <Info>
          It might take some time before these transactions get processed.
          Please be patient and{' '}
          <strong>do not close this window until it finishes.</strong>
        </Info>
      )}
    </aside>
  )
}

DeploymentStepsPanel.propTypes = {
  allSuccess: PropTypes.bool.isRequired,
  pending: PropTypes.number.isRequired,
  transactionsStatus: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      status: TransactionStatusType.isRequired,
    })
  ).isRequired,
}

export default DeploymentStepsPanel
