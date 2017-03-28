import jdenticon from 'jdenticon'
import { sha3, bufferToHex } from 'ethereumjs-util'

export default (str: string): string => {
  const svg = jdenticon.toSvg(bufferToHex(sha3(str)).slice(2), 128)
  const blob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' })
  return URL.createObjectURL(blob)
}
