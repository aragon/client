import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

// dayjs plugins
dayjs.extend(relativeTime)

const KNOWN_FORMATS = {
  onlyDate: 'yyyy-MM-dd',
}

export function dateFormat(date, formatName) {
  return dayjs(date).format(KNOWN_FORMATS[formatName])
}

// Displays the difference between two dates
export function getRelativeTime(from, to) {
  return dayjs(to)
    .from(from)
    .replace(/minutes?/, 'min')
    .replace(/seconds?/, 'sec')
    .trim()
}
