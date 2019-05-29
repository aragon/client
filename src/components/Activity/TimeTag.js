import React from 'react'
import PropTypes from 'prop-types'
import { font, theme } from '@aragon/ui'
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
  const now = useNow()
  const targetDate = new Date(date)
  return (
    <span
      css={`
        opacity: 0.7;
        color: ${theme.textSecondary};
        letter-spacing: 0;
        white-space: nowrap;
        ${font({ size: 'xsmall', weight: 'bold' })}
      `}
      {...props}
    >
      {label || getRelativeTime(now, targetDate)}
    </span>
  )
}

TimeTag.propTypes = {
  date: PropTypes.number.isRequired, // unix timestamp
  label: PropTypes.node,
}

export default TimeTag
