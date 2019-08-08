import {
  NOTIFICATION_SERVICE_LOGIN,
  NOTIFICATION_SERVICE_VERIFY,
  NOTIFICATION_SERVICE_SUBSCRIPTIONS,
  EXPIRED_TOKEN_MESSAGE,
  ExpiredTokenError,
  UnauthroizedError,
} from './constants'

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

    if (isUnauthorized(rawResponse)) {
      throw new UnauthroizedError(rawResponse.statusText)
    }
    if (!rawResponse.ok) {
      throw new Error(rawResponse.statusText)
    }
    // Get the long lived token from header
    return rawResponse.headers.get('authorization')
  } catch (e) {
    console.error(e.message)
    throw e
  }
}

export const getSubscriptions = async token => {
  try {
    const rawResponse = await fetch(NOTIFICATION_SERVICE_SUBSCRIPTIONS, {
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
      throw new Error(response)
    }

    return response
  } catch (e) {
    console.error(e)
    throw e
  }
}
