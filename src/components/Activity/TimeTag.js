import React from 'react'
import PropTypes from 'prop-types'
import { GU, textStyle, useTheme } from '@aragon/ui'
import { useNow } from '../../hooks'
import { getRelativeTime } from '../../util/date'

function TimeTag({ date, label, ...props }) {
  const theme = useTheme()
  const now = useNow()
  const targetDate = new Date(date)
  return (
    <div
      css={`
        max-width: ${15.75 * GU}px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        ${textStyle('label2')}
        color: ${theme.surfaceContentSecondary};
      `}
      {...props}
    >
      {label || getRelativeTime(now, targetDate)}
    </div>
  )
}

TimeTag.propTypes = {
  date: PropTypes.number.isRequired, // unix timestamp
  label: PropTypes.node,
}

export default TimeTag
