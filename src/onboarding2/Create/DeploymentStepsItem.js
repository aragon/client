import React, { useMemo } from 'react'
import PropTypes from 'prop-types'
import { textStyle, GU, IconCheck, useTheme } from '@aragon/ui'

function DeploymentStepsItem({ index, name, status }) {
  const theme = useTheme()

  const stepStyles = useMemo(() => {
    if (status === 'pending') {
      return `
        border: 2px solid ${theme.selected};
      `
    }
    if (status === 'success') {
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
        {status === 'success' ? (
          <IconCheck />
        ) : (
          status === 'upcoming' && index + 1
        )}
      </div>
      <div
        css={`
          margin-left: ${3 * GU}px;
          font-size: 18px;
          font-weight: ${status === 'pending' ? '600' : '400'};
          overflow: hidden;
          text-overflow: ellipsis;
        `}
      >
        <div>{name}</div>
        {status === 'success' && (
          <div
            css={`
              ${textStyle('body3')};
              color: ${theme.surfaceContentSecondary};
            `}
          >
            Transaction successful
          </div>
        )}
      </div>
    </div>
  )
}

DeploymentStepsItem.propTypes = {
  index: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  status: PropTypes.string.isRequired,
}

export default DeploymentStepsItem
