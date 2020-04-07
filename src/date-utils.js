import { format } from 'date-fns'

const KNOWN_FORMATS = {
  iso: "yyyy-MM-dd'T'HH:mm:ss",
  standard: 'dd MMM yyyy, HH:mm:ss',
  onlyDate: 'yyyy-MM-dd',
}

export function dateFormat(date, formatName) {
  return format(date, KNOWN_FORMATS[formatName])
}
