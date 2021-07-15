const methods = {
  PAGE: 0,
  IDENTIFY: 1,
  EVENT: 2,
}

export const events = {
  TEMPLATE_SELECTED: 'template_selected',
  WALLET_DISCONNECTED: 'wallet_disconnected',
}

/**
 * This private method extracts the necessary method from the global window object.
 *
 * @param {methods} method Type of analyts to track
 * @returns {void} the corresponding analytics method
 */
function getAnalyticsMethod(method) {
  var windowAnalytics = window.analytics
  if (!windowAnalytics) {
    return
  }
  if (method === methods.PAGE) return windowAnalytics.page
  if (method === methods.IDENTIFY) return windowAnalytics.identify
  if (method === methods.EVENT) return windowAnalytics.track
}
/**
 * This method keeps track of certain events (like creation of proposals, etc.).
 *
 * @param {events} event name of the event to be tracked
 * @param {Object} eventData relating to tracked event
 * @returns {void}
 */
export function trackEvent(event, eventData) {
  var trackerMethod = getAnalyticsMethod(methods.EVENT)
  if (typeof trackerMethod !== 'function') {
    return
  }
  trackerMethod(event, eventData)
}

/**
 * Sends analytics informations about the pages visited.
 *
 * @param {String} pathName (Dynamic) Path name as given by the router.
 * @returns {void}
 */
export function trackPage(pathName) {
  var trackerMethod = getAnalyticsMethod(methods.PAGE)
  if (typeof trackerMethod !== 'function') {
    return
  }
  trackerMethod({
    path: pathName,
  })
}

/**
 * Sends analytics informations about the connected wallets.
 *
 * @param {String} account Wallet address
 * @param {String} networkName Name of the ethereum network the wallet is connected to
 * @param {String} connector Wallet connector used by use-wallet library
 * @returns {void}
 */
export function identifyUser(account, networkName, connector) {
  var trackerMethod = getAnalyticsMethod(methods.IDENTIFY)
  if (typeof trackerMethod !== 'function') {
    return
  }
  var walletData = {
    wallet_address: account,
    wallet_provider: connector,
    network: networkName,
  }
  trackerMethod(walletData)
}
