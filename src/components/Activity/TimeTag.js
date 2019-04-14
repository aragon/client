import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { formatDistance } from 'date-fns'

function TimeTag({ style, date }) {
  const [relativeTime, setRelativeTime] = useState('')

  useEffect(() => {
    const interval = setInterval(() => {
      const relativeTime = formatDistance(new Date(), new Date(date))
        .replace('about', '')
        .replace('minutes', 'min')
        .trim()
      setRelativeTime(relativeTime)
    }, 1000)

    return () => {
      clearInterval(interval)
    }
  }, [date])

  return <span style={style}>{relativeTime} ago</span>
}

TimeTag.propTypes = {
  style: PropTypes.object,
  date: PropTypes.number.isRequired, // unix timestamp
}

export default TimeTag
