import React, { useMemo } from 'react'
import PropTypes from 'prop-types'
import { textStyle, GU, IconCheck, useTheme } from '@aragon/ui'
import { TransactionStatusType } from '../../prop-types'
import {
  TRANSACTION_STATUS_PENDING,
  TRANSACTION_STATUS_SUCCESS,
  TRANSACTION_STATUS_UPCOMING,
} from '../../symbols'

function DeploymentStepsItem({ index, name, status }) {
  const theme = useTheme()

  const stepStyles = useMemo(() => {
    if (status === TRANSACTION_STATUS_PENDING) {
      return `
        border: 2px solid ${theme.selected};
      `
    }
    if (status === TRANSACTION_STATUS_SUCCESS) {
      return `
        border: 2px solid ${theme.positive};
        color: ${theme.positive};
      `
    }
    return `
      padding-top: 2px;
      background: #ECEFF4;
      color: #9CA7B8;
    `
  }, [status, theme])

  return (
    <div
      css={`
        display: flex;
        align-items: center;
        height: ${5 * GU}px;
        margin-top: ${3 * GU}px;
      `}
    >
      <div
        css={`
          width: ${5 * GU}px;
          height: ${5 * GU}px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          font-size: 18px;
          font-weight: 600;
          ${stepStyles};
          flex-shrink: 0;
          flex-grow: 0;
        `}
      >
        {status === TRANSACTION_STATUS_SUCCESS ? (
          <IconCheck />
        ) : (
          status === TRANSACTION_STATUS_UPCOMING && index + 1
        )}
      </div>
      <div
        css={`
          margin-left: ${3 * GU}px;
          font-size: 18px;
          font-weight: ${status === TRANSACTION_STATUS_PENDING ? '600' : '400'};
          overflow: hidden;
          text-overflow: ellipsis;
        `}
      >
        <div>{name}</div>
        {status === TRANSACTION_STATUS_SUCCESS && (
          <div
            css={`
              ${textStyle('body3')};
              color: ${theme.surfaceContentSecondary};
            `}
          >
            Signature successful
          </div>
        )}
      </div>
    </div>
  )
}

DeploymentStepsItem.propTypes = {
  index: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  status: TransactionStatusType.isRequired,
}

export default DeploymentStepsItem
