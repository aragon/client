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
  DAO_CREATION_TEMPLATE_SELECTED: 'daoCreation_template_selected',

  OPEN_ORGANIZATION_CLICKED: 'openOrganization_clicked',
  CREATE_ORGANIZATION_CLICKED: 'createOrganization_clicked',
  ORGANIZATION_LINK_CLICKED: 'organizationLink_clicked',
  FAVORITE_ORGANIZATION_TOGGLED: 'favoriteOrganization_toggled',
  USER_SETTINGS_CLICKED: 'userSettings_clicked',
  USER_NETWORK_SETTINGS_SAVED: 'userNetworkSettings_saved',
  CACHE_CLEARED: 'cache_cleared',
  NAVIGATION_OPTION_SELECTED: 'navigation_option_selected',
  DAO_CREATION_NEXT_CLICKED: 'daoCreation_next_clicked',
  DAO_NOT_FOUND: 'dao_notFound',
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
 * @param {String} networkType The network the wallet is connected to
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
