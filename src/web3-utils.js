/*
 * This utils library is meant to capture all of the web3-related utilities
 * that we use. Any utilities we need from web3-utils should be re-exported
 * from this file.
 */
import Web3 from 'web3'

// Check address equality without checksums
export function addressesEqual(first, second) {
  first = first && first.toLowerCase()
  second = second && second.toLowerCase()
  return first === second
}

// Shorten an Ethereum address. `charsLength` allows to change the number of
// characters on both sides of the ellipsis.
//
// Examples:
//   shortenAddress('0x19731977931271')    // 0x1973…1271
//   shortenAddress('0x19731977931271', 2) // 0x19…71
//   shortenAddress('0x197319')            // 0x197319 (already short enough)
//
export function shortenAddress(address, charsLength = 4) {
  const prefixLength = 2 // "0x"
  if (address.length < charsLength * 2 + prefixLength) {
    return address
  }
  return (
    address.slice(0, charsLength + prefixLength) +
    '…' +
    address.slice(-charsLength)
  )
}

// Cache web3 instances used in the app
const cache = new WeakMap()
export function getWeb3(provider) {
  if (cache.has(provider)) {
    return cache.get(provider)
  }
  const web3 = new Web3(provider)
  cache.set(provider, web3)
  return web3
}

// Re-export some utilities from web3-utils
export {
  fromWei,
  isAddress,
  toChecksumAddress,
  toWei,
  keccak256,
} from 'web3-utils'
