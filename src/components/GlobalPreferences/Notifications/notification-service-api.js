// const NOTIFICATION_SERVICE_URL = 'https://notifications.eth.aragon.network'
const NOTIFICATION_SERVICE_URL = 'http://localhost:4000'
const NOTIFICATION_SERVICE_LOGIN = `${NOTIFICATION_SERVICE_URL}/login`
const NOTIFICATION_SERVICE_VERIFY = `${NOTIFICATION_SERVICE_URL}/verify`
const NOTIFICATION_SERVICE_SUBSCRIPTIONS = `${NOTIFICATION_SERVICE_URL}/subscriptions`

export const login = async (email, dao) => {
  try {
    const rawResponse = await fetch(NOTIFICATION_SERVICE_LOGIN, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, dao }),
    })
    if (!rawResponse.ok) {
      throw new Error('Login failed')
    }
  } catch (e) {
    console.error(e)
    throw e
  }
}

// Verify the short lived email token and fetch a long lived token
export const verifyEmailToken = async shortLivedToken => {
  try {
    const rawResponse = await fetch(NOTIFICATION_SERVICE_VERIFY, {
      method: 'POST',
      // credentials: 'include', // Not needed. Only relevant for cookies
      headers: {
        'Content-Type': 'application/json',
        authorization: shortLivedToken,
      },
    })
    if (!rawResponse.ok) {
      throw new Error(rawResponse.statusText)
    }
    // Get the long lived token from header
    return rawResponse.headers.get('authorization')
  } catch (e) {
    console.error(e)
    throw e
  }
}

// Verify the short lived email token and fetch a long lived token
export const getSubscriptions = async token => {
  try {
    const rawResponse = await fetch(NOTIFICATION_SERVICE_SUBSCRIPTIONS, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        authorization: token,
      },
    })
    if (!rawResponse.ok) {
      throw new Error(rawResponse.statusText)
    }
    // Get the long lived token from header
    const subscriptions = await rawResponse.json()
    return subscriptions
  } catch (e) {
    console.error(e)
    throw e
  }
}
