import abi from 'web3-eth-abi'

export function encodeFunctionCallFromSignature(signature, params = []) {
  const sigBytes = abi.encodeFunctionSignature(signature)

  const types = signature.replace(')', '').split('(')[1]

  // No params, return signature directly
  if (types === '') {
    return sigBytes
  }
  const paramBytes = abi.encodeParameters(types.split(','), params)

  return `${sigBytes}${paramBytes.slice(2)}`
}
