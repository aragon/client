const MethodType = {
  PAGE: 0,
  IDENTIFY: 1,
  EVENT: 2,
}

export const EventType = {
  TEMPLATE_SELECTED: 'template_selected',
  WALLET_DISCONNECTED: 'wallet_disconnected',
}

/**
 * This private method extracts the necessary method from the global window object.
 *
 * @param {MethodType} methodType Type of analyts to track
 * @returns {void} the corresponding analytics method
 */
function getAnalyticsMethod(methodType) {
  var windowAnalytics = window.analytics
  if (!windowAnalytics) {
    return
  }
  if (methodType === MethodType.PAGE) return windowAnalytics.page
  if (methodType === MethodType.IDENTIFY) return windowAnalytics.identify
  if (methodType === MethodType.EVENT) return windowAnalytics.track
}
/**
 * This method keeps track of certain events (like creation of proposals, etc.).
 *
 * @param {EventType} eventType name of the event to be tracked
 * @param {Object} eventData relating to tracked event
 * @returns {void}
 */
export function trackEvent(eventType, eventData) {
  var trackerMethod = getAnalyticsMethod(MethodType.EVENT)
  if (typeof trackerMethod !== 'function') {
    return
  }
  trackerMethod(eventType, eventData)
}

/**
 * Sends analytics informations about the pages visited.
 *
 * @param {String} pathName (Dynamic) Path name as given by the router.
 * @returns {void}
 */
export function trackPage(pathName) {
  var trackerMethod = getAnalyticsMethod(MethodType.PAGE)
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
  var trackerMethod = getAnalyticsMethod(MethodType.IDENTIFY)
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
