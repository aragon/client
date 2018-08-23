/*
 * This utils library is meant to capture all of the web3-related utilities
 * that we use. Any utilities we need from web3-utils should be re-exported
 * from this file.
 */
import Web3 from 'web3'
import BigNumber from 'bignumber.js'

/** 
 * Check address equality without checksums
 * @param {string} first - First address
 * @param {string} second - Second address
 * @returns {boolean} - Address equality
 */ 
export function addressesEqual(first, second) {
  first = first && first.toLowerCase()
  second = second && second.toLowerCase()
  return first === second
}

/**
 *  Takes a Wei value and returns it converted to the specified Ether subunit rounded to the specified number of digits after the decimal point.
 * @param {string} wei - Value in Wei
 * @param {number} [digits=2] - Number of digits after the decimal point (by default 2)
 * @param {string} [unit='ether'] - Unit to convert to (by default 'ether')
 * @return {string} - The converted Wei value to the specified Ether subunit and rounded to the specified digits after the decimal point
 */
export function fromWeiRounded(wei, digits = 2, unit = 'ether') {
  var unitBalance = Web3.utils.fromWei(wei, unit)
  unitBalance = new BigNumber(unitBalance)
  return unitBalance.toFormat(digits).replace(/,/g, '')
}

/** 
 * Shorten an Ethereum address. `charsLength` allows to change the number of
 * characters on both sides of the ellipsis.
 *
 * Examples:
 *   shortenAddress('0x19731977931271')    // 0x1973…1271
 *   shortenAddress('0x19731977931271', 2) // 0x19…71
 *   shortenAddress('0x197319')            // 0x197319 (already short enough)
 * 
 * @param {string} address - The address to shorten
 * @param {number}[charsLength=4] - The number of characters to change on both sides of the ellipsis
 * @returns {string} The shortened address
 */
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

/** 
 * Cache web3 instances used in the app
 * @param provider
 * @returns The web3 instance
 */
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
export { fromWei, isAddress, toChecksumAddress, toWei } from 'web3-utils'
