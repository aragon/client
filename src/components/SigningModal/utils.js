import { addressesEqual } from '../../web3-utils'

// Temporarily clean the error messages coming from Aragon.js and Metamask
const cleanErrorMessage = errorMsg =>
  errorMsg
    // Only use the first line if multiple lines are available.
    // This makes sure we don't show the stack trace if it becomes part of the message.
    .split('\n')[0]
    .replace(/^Returned error: /, '')
    .replace(/^Error: /, '')

export function getErrorMessage(warning, error) {
  const cleanedErrorMessage = cleanErrorMessage((error && error.message) || '')

  return `${warning} ${
    cleanedErrorMessage
      ? `Error: ${cleanedErrorMessage}`
      : `There may have been a problem with your Ethereum wallet.`
  }`
}

export function getAppByProxyAddress(proxyAddress, apps) {
  if (!proxyAddress) {
    return null
  }
  return apps.find(app => addressesEqual(app.proxyAddress, proxyAddress))
}
