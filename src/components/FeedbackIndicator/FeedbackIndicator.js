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
        width: 64px;
        height: 64px;
        border: 2px solid ${color};
        border-radius: 50%;
        transition: border-color 150ms ease-in-out;
      `}
      {...props}
    >
      {status === 'error' ? (
        <IconCross
          size="large"
          css={`
            color: ${color};
            transition: color 150ms ease-in-out;
          `}
        />
      ) : (
        <IconCheck
          size="large"
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
