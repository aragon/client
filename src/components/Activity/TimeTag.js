import React from 'react'
import { formatDistance } from 'date-fns'
import PropTypes from 'prop-types'

export default function TimeTag({ style, date }) {
  const [relativeTime, setRelativeTime] = React.useState('')
  React.useEffect(() => {
    const interval = setInterval(() => {
      const relativeTime = formatDistance(new Date(), new Date(date))
        .replace('about', '')
        .trim()
      setRelativeTime(relativeTime)
    }, 1000)

    return () => clearInterval(interval)
  }, [date])

  return <span style={style}>{relativeTime} ago</span>
}

TimeTag.propTypes = {
  style: PropTypes.object,
  date: PropTypes.number.isRequired, // unix timestamp
}
