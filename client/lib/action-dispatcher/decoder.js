import { sha3, bufferToHex } from 'ethereumjs-util'
import abi from 'ethereumjs-abi'

import actions from './actions'

const actionFromData = data => {
  const functionSig = data.slice(0, 10)

  for (const action of Object.values(actions)) {
    if (bufferToHex(sha3(action.signature)).indexOf(functionSig) === 0) {
      return action
    }
  }

  console.warn('not found for function sig', functionSig)
  return null
}

const isHexType = type => (
  _.contains(['address', 'bytes'], type) || type.match(/bytes\d+/g)
)

const padLeft = (string, chars) => (
  (new Array((chars - string.length) + 1).join('0')) + string
)

// From: https://github.com/ethereum/mist/blob/master/modules/abi.js
const decode = _data => {
  const action = actionFromData(_data)
  const data = _data.slice(10, _data.length)
  const signature = action.signature.match(/\((.+)\)/i)

  if (!signature) return

  const paramTypes = signature[1].split(',')

  try {
    const paramsResponse = abi.rawDecode(paramTypes, new Buffer(data, 'hex'))

    // Turns addresses into proper hex string
    // Turns numbers into their decimal string version
    return paramTypes.map((type, index) => {
      const conversionFlag = isHexType(type) ? 16 : null
      const prefix = isHexType(type) ? '0x' : ''

      let response = paramsResponse[index].toString(conversionFlag)

      const res = type.match(/bytes(\d+)/i)

      if (type === 'address') {
          response = padLeft(response, 40)
      } else if (res) {
          response = padLeft(response, Number(res[1]) * 2)
      }

      return { type, value: prefix + response }
    })

  } catch (e) {
     console.warn('ABI.js Warning:', e.message)
  }

  return null
}

export { actionFromData, decode }
