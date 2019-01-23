/*
 * This utils library is meant to capture all of the web3-related utilities
 * that we use. Any utilities we need from web3-utils should be re-exported
 * from this file.
 */
import Web3 from 'web3'
import BN from 'bn.js'

const EMPTY_ADDRESS = '0x0000000000000000000000000000000000000000'

/**
 * Check address equality without checksums
 * @param {string} first First address
 * @param {string} second Second address
 * @returns {boolean} Address equality
 */
export function addressesEqual(first, second) {
  first = first && first.toLowerCase()
  second = second && second.toLowerCase()
  return first === second
}

/**
 * Format the balance to a fixed number of decimals
 *
 * @param {BN} amount The total amount.
 * @param {object} options The options object.
 * @param {BN} options.base The decimals base.
 * @param {number} options.precision Number of decimals to format.
 *
 * @returns {string} The formatted balance.
 */
export function formatBalance(
  amount,
  { base = new BN(10).pow(new BN(18)), precision = 2 } = {}
) {
  const baseLength = base.toString().length

  const whole = amount.div(base).toString()
  let fraction = amount.mod(base).toString()
  const zeros = '0'.repeat(Math.max(0, baseLength - fraction.length - 1))
  fraction = `${zeros}${fraction}`.replace(/0+$/, '').slice(0, precision)

  if (fraction === '' || parseInt(fraction, 10) === 0) {
    return whole
  }

  return `${whole}.${fraction}`
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
 * @param {string} address The address to shorten
 * @param {number} [charsLength=4] The number of characters to change on both sides of the ellipsis
 * @returns {string} The shortened address
 */
export function shortenAddress(address, charsLength = 4) {
  const prefixLength = 2 // "0x"
  if (!address) {
    return ''
  }
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
const web3Cache = new WeakMap()

/**
 * Get cached web3 instance
 * @param {Web3.Provider} provider Web3 provider
 * @returns {Web3} The web3 instance
 */
export function getWeb3(provider) {
  if (web3Cache.has(provider)) {
    return web3Cache.get(provider)
  }
  const web3 = new Web3(provider)
  web3Cache.set(provider, web3)
  return web3
}

// Get the first account of a web3 instance
export async function getMainAccount(web3) {
  try {
    const accounts = await web3.eth.getAccounts()
    return (accounts && accounts[0]) || null
  } catch (err) {
    return null
  }
}

// Check if the address represents an empty address
export function isEmptyAddress(address) {
  return addressesEqual(address, EMPTY_ADDRESS)
}

export function getEmptyAddress() {
  return EMPTY_ADDRESS
}

export function getUnknownBalance() {
  return new BN('-1')
}

// Returns an identifier for the provider, if it can be detected
export function identifyProvider(provider) {
  if (provider && provider.isMetaMask) {
    return 'metamask'
  }
  return 'unknown'
}

export function isValidEnsName(name) {
  return /^([\w-]+\.)+eth$/.test(name)
}

// Re-export some utilities from web3-utils
export { fromWei, isAddress, toChecksumAddress, toWei } from 'web3-utils'

/*
 * Return the injected provider, if any.
 */
export function getInjectedProvider() {
  // Status implements EIP 1102 using `ethereumBeta`
  if (window.ethereumBeta) {
    return window.ethereumBeta
  }
  if (window.ethereum) {
    return window.ethereum
  }
  if (window.web3 && window.web3.currentProvider) {
    return window.web3.currentProvider
  }
  return null
}
