const methods = {
  PAGE: 0,
  IDENTIFY: 1,
  EVENT: 2,
}

export const events = {
  DAO_CREATEBTN_CLICKED: 'dao_createBtn_clicked',
  DAO_CREATED: 'dao_created',
  DAO_CREATIONFAILED: 'dao_creationFailed',
  WALLET_DISCONNECTED: 'wallet_disconnected',
  DAOCREATION_TEMPLATE_SELECTED: 'daoCreation_template_selected',
}

/**
 * This private method extracts the necessary method from the global window object.
 *
 * @param {methods} method Type of analyts to track
 * @returns {void} the corresponding analytics method
 */
function getAnalyticsMethod(method) {
  var windowAnalytics = window.rudderanalytics
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
 * @param {String} networkType The ethereum network the wallet is connected to
 * @param {String} connector Wallet connector used by use-wallet library
 * @returns {void}
 */
export function identifyUser(account, networkType, connector) {
  var trackerMethod = getAnalyticsMethod(methods.IDENTIFY)
  if (typeof trackerMethod !== 'function') {
    return
  }
  var walletData = {
    wallet_address: account,
    wallet_provider: connector,
    network: networkType,
  }
  trackerMethod(walletData)
}
