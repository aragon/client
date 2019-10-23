import React from 'react'
import PropTypes from 'prop-types'
import { GU, textStyle, useTheme } from '@aragon/ui'
import { formatDistance, formatDistanceStrict } from 'date-fns'
import { useNow } from '../../hooks'

function getRelativeTime(now, targetDate) {
  const past = targetDate < now
  const fn = past ? formatDistance : formatDistanceStrict
  const options = { addSuffix: true, ...(past && { unit: 'minute' }) }
  return fn(targetDate, now, options)
    .replace('about', '')
    .replace(/minutes?/, 'min')
    .replace(/seconds?/, 'sec')
    .trim()
}

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
