import React from 'react'
import PropTypes from 'prop-types'
import { IconCheck, IconCross, useTheme } from '@aragon/ui'

const FeedbackIndicator = ({ status, ...props }) => {
  const theme = useTheme()
  const color =
    status === 'success'
      ? theme.positive
      : status === 'error'
      ? theme.negative
      : theme.hint

  return (
    <div
      css={`
        display: flex;
        align-items: center;
        justify-content: center;
        width: 60px;
        height: 60px;
        border: 2px solid ${color};
        border-radius: 50%;
        transition: border-color 150ms ease-in-out;
      `}
      {...props}
    >
      {status === 'error' ? (
        <IconCross
          size="medium"
          css={`
            color: ${color};
            transition: color 150ms ease-in-out;
          `}
        />
      ) : (
        <IconCheck
          size="medium"
          css={`
            color: ${color};
            transition: color 150ms ease-in-out;
          `}
        />
      )}
    </div>
  )
}

FeedbackIndicator.propTypes = {
  status: PropTypes.oneOf(['pending', 'success', 'error']).isRequired,
}

export default FeedbackIndicator
