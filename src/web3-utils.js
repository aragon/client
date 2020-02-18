/* This utils library is meant to capture all of the web3-related utilities
 * that we use. Any utilities we need from web3-utils should be re-exported
 * from this file.
 */
import Web3 from 'web3'
import { toWei } from 'web3-utils'
import BN from 'bn.js'
import { InvalidNetworkType, InvalidURI, NoConnection } from './errors'
import { network } from './environment'
import { log } from './utils'

const EMPTY_ADDRESS = '0x0000000000000000000000000000000000000000'
const ETH_ADDRESS_SPLIT_REGEX = /(0x[a-fA-F0-9]{40}(?:\b|\.|,|\?|!|;))/g
const ETH_ADDRESS_TEST_REGEX = /(0x[a-fA-F0-9]{40}(?:\b|\.|,|\?|!|;))/g

// Filter the value we get from getBalance() before passing it to BN.js.
// This is because passing some values to BN.js can lead to an infinite loop
// when .toString() is called. Returns "-1" when the value is invalid.
//
// See https://github.com/indutny/bn.js/issues/186
export function filterBalanceValue(value) {
  if (value === null) {
    return '-1'
  }
  if (typeof value === 'object') {
    value = String(value)
  }
  if (typeof value === 'string') {
    return /^[0-9]+$/.test(value) ? value : '-1'
  }
  return '-1'
}

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

const websocketRegex = /^wss?:\/\/.+/

/**
 * Check if the ETH node at the given URI is compatible for the current environment
 * @param {string} uri URI of the ETH node.
 * @param {string} expectedNetworkType The expected network type of the ETH node.
 * @returns {Promise} Resolves if the ETH node is compatible, otherwise throws:
 *    - InvalidURI: URI given is not compatible (e.g. must be WebSockets)
 *    - InvalidNetworkType: ETH node connected to wrong network
 *    - NoConnection: Couldn't connect to URI
 */
export async function checkValidEthNode(uri, expectedNetworkType) {
  // Must be websocket connection
  if (!websocketRegex.test(uri)) {
    throw new InvalidURI('The URI must use the WebSocket protocol')
  }

  try {
    const web3 = new Web3(uri)
    const connectedNetworkType = await web3.eth.net.getNetworkType()
    if (web3.currentProvider.disconnect) {
      web3.currentProvider.disconnect()
    } else {
      // Older versions of web3's providers didn't expose a generic interface for disconnecting
      web3.currentProvider.connection.close()
    }

    if (connectedNetworkType !== expectedNetworkType) {
      throw new InvalidNetworkType()
    }
  } catch (err) {
    if (err instanceof InvalidNetworkType) {
      throw err
    }
    throw new NoConnection()
  }

  return true
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

export function getEmptyAddress() {
  return EMPTY_ADDRESS
}

export async function getAccountBalance(web3, account) {
  try {
    const balanceValue = await web3.eth.getBalance(account)
    return new BN(filterBalanceValue(balanceValue))
  } catch (err) {
    return getUnknownBalance()
  }
}

/**
 * Get whether an account is a contract
 *
 * @param {Web3} web3 The web3 instance
 * @param {string} account The account being checked
 *
 * @returns {boolean} Whether the account is a contract or not
 */
export async function getIsContractAccount(web3, account) {
  try {
    const accountCode = await web3.eth.getCode(account)
    return accountCode !== '0x'
  } catch (err) {
    return false
  }
}

const gasPriceApi = 'https://ethgasstation.info/json/ethgasAPI.json'
export async function getGasPrice({
  mainnet: { safeMinimum = '3', disableEstimate } = {},
} = {}) {
  if (network.type !== 'main') {
    // Hardcode 10 for non-mainnet networks
    return toWei('10', 'gwei')
  }

  // Mainnet and gas estimation disabled; let the web3 provider handle gas price
  if (disableEstimate) {
    return
  }

  const safeMinimumInWei = toWei(safeMinimum, 'gwei')
  let priceInWei

  try {
    const response = await fetch(gasPriceApi, {
      method: 'GET',
      mode: 'cors',
      cache: 'no-cache',
    })
    const jsonResponse = await response.json()

    // Note that all prices from ethgasstation need to be divided by 10 to be in gwei.
    // The response contains a list of suggested gas prices from 2-120 in
    // gasPriceRange, so 40 is "slightly higher than the recommended price".
    let fasterPrice = parseInt(jsonResponse.gasPriceRange[40], 10)
    fasterPrice = isNaN(fasterPrice) ? 0 : fasterPrice / 10

    // Just in case, if this isn't available or is way too high,
    // prefer the suggested safe low price.
    let safePrice = parseInt(jsonResponse.safeLow, 10)
    safePrice = isNaN(safePrice) ? 0 : safePrice / 10

    const recommendedPrice = Math.max(
      safePrice,
      Math.min(fasterPrice, safePrice + 10)
    )

    priceInWei = toWei(recommendedPrice.toString(), 'gwei')
  } catch (e) {
    log('Error fetching gas price: ', e)
  }

  // If we couldn't find the price or it was lower than the safe minimum,
  // use the safe minimum
  priceInWei = new BN(priceInWei || 0).lt(new BN(safeMinimumInWei))
    ? safeMinimumInWei
    : priceInWei
  return priceInWei
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

export async function getLatestBlockTimestamp(web3) {
  const { timestamp } = (await web3.eth.getBlock('latest')) || {}
  if (!timestamp) {
    throw new Error('Could not fetch the latest block timestamp')
  }
  return new Date(timestamp * 1000)
}

export function getUnknownBalance() {
  return new BN('-1')
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

export function isConnected(provider) {
  // EIP-1193 compliant providers may not include `isConnected()`, but most should support it for
  // the foreseeable future to be backwards compatible with older Web3.js implementations.
  // The `status` property is also not required by EIP-1193, but is often set on providers for
  // backwards compatibility as well.
  return typeof provider.isConnected === 'function'
    ? provider.isConnected()
    : provider.status === 'connected'
}

// Check if the address represents an empty address
export function isEmptyAddress(address) {
  return addressesEqual(address, EMPTY_ADDRESS)
}

export function isValidEnsName(name) {
  return /^([\w-]+\.)+eth$/.test(name)
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

// Detect Ethereum addresses in a string and transform each part.
//
// `callback` is called on every part with two params:
//   - The string of the current part.
//   - A boolean indicating if it is an address.
//
export function transformAddresses(str, callback) {
  return str
    .split(ETH_ADDRESS_SPLIT_REGEX)
    .map((part, index) =>
      callback(part, ETH_ADDRESS_TEST_REGEX.test(part), index)
    )
}

// Re-export some utilities from web3-utils
export {
  fromWei,
  isAddress,
  soliditySha3,
  toChecksumAddress,
  toWei,
} from 'web3-utils'
