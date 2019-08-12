import {
  NOTIFICATION_SERVICE_ACCOUNT,
  NOTIFICATION_SERVICE_LOGIN,
  NOTIFICATION_SERVICE_VERIFY,
  NOTIFICATION_SERVICE_SUBSCRIPTIONS,
  NOTIFICATION_SERVICE_TOKEN_KEY,
  NOTIFICATION_SERVICE_EMAIL_KEY,
  EXPIRED_TOKEN_MESSAGE,
  ExpiredTokenError,
  UnauthroizedError,
} from './constants'
import { getEthNetworkType } from '../../../local-settings'


const isTokenExpired = response =>
  response.statusCode === 401 && response.message === EXPIRED_TOKEN_MESSAGE

const isUnauthorized = rawResponse => rawResponse.status === 401

export const login = async ({ email, dao, network }) => {
  try {
    const rawResponse = await fetch(NOTIFICATION_SERVICE_LOGIN, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, dao, network }),
    })
    if (!rawResponse.ok) {
      throw new Error(rawResponse.statusText)
    }
  } catch (e) {
    console.error(e)
    throw e
  }
}

// Verify the short lived email token and fetch a long lived token
export async function verifyEmailToken(shortLivedToken) {
  try {
    const rawResponse = await fetch(NOTIFICATION_SERVICE_VERIFY, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        authorization: shortLivedToken,
      },
    })

    if (!rawResponse.ok) {
      // In case of errors the api will return json payload
      const response = await rawResponse.json()

      if (isTokenExpired(response))
        throw new ExpiredTokenError(response.message)

      if (isUnauthorized(rawResponse)) {
        throw new UnauthroizedError(rawResponse.statusText)
      }

      throw new Error(rawResponse.statusText)
    }

    // Get the long lived token from header
    return rawResponse.headers.get('authorization')
  } catch (e) {
    console.error(e.message)
    throw e
  }
}

/**
 * Delete a user account
 *
 * @param {string} token long lived api token
 * @returns {Number} 1 if the account was deleted successfully
 */
export async function deleteAccount(token) {
  try {
    const rawResponse = await fetch(NOTIFICATION_SERVICE_ACCOUNT, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        authorization: token,
      },
    })

    const response = await rawResponse.json()

    if (!rawResponse.ok) {
      // In case of errors the api will return json payload
      if (isTokenExpired(response))
        throw new ExpiredTokenError(response.message)

      if (isUnauthorized(rawResponse)) {
        throw new UnauthroizedError(rawResponse.statusText)
      }

      throw new Error(rawResponse.statusText)
    }

    localStorage.removeItem(NOTIFICATION_SERVICE_TOKEN_KEY)
    localStorage.removeItem(NOTIFICATION_SERVICE_EMAIL_KEY)

    return response
  } catch (e) {
    console.error(e.message)
    throw e
  }
}

export const getSubscriptions = async ({ token }) => {
  const url = new URL(NOTIFICATION_SERVICE_SUBSCRIPTIONS)
  url.searchParams.append('network', getEthNetworkType())

  try {
    const rawResponse = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        authorization: token,
      },
    })

    const response = await rawResponse.json()

    if (isTokenExpired(response)) throw new ExpiredTokenError(response.message)

    if (isUnauthorized(rawResponse)) {
      throw new UnauthroizedError(rawResponse.statusText)
    }

    if (!rawResponse.ok) {
      throw new Error(response.statusText)
    }

    return response
  } catch (e) {
    console.error(e)
    throw e
  }
}

/**
 * Create subscription
 *
 * @param {Object} options options object
 * @param {string} options.token api token
 * @param {string} options.appName appName aka the ens name of the APM repo
 * @param {string} options.eventName event name as defined in the ABI
 * @param {string} options.contractAddress address of the proxy contract
 * @param {string} options.ensName ens name of the DAO with the app installed
 * @param {string} options.network network, e.g. mainnet, rinkeby
 * @param {object} options.abi abi of the appName
 *
 * @returns {Promise} Promise that resolves with response body if successful
 */
export const createSubscription = async ({
  abi,
  appName,
  contractAddress, // TODO: rename to proxyAddress. Contract address can be confused as the app repo's contract address
  ensName,
  eventName,
  network,
  token,
} = {}) => {
  try {
    const rawResponse = await fetch(NOTIFICATION_SERVICE_SUBSCRIPTIONS, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        authorization: token,
      },
      body: JSON.stringify({
        appName,
        eventName,
        contractAddress,
        ensName,
        network,
        abi,
      }),
    })

    const response = await rawResponse.json()

    if (isTokenExpired(response)) throw new ExpiredTokenError(response.message)

    if (isUnauthorized(rawResponse)) {
      throw new UnauthroizedError(rawResponse.statusText)
    }

    if (!rawResponse.ok) {
      throw new Error(rawResponse.statusText)
    }

    return response
  } catch (e) {
    console.error(e)
    throw e
  }
}
