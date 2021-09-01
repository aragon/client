import resolvePathname from 'resolve-pathname'

export function pollEvery(fn, delay) {
  let timer = -1
  let stop = false
  const poll = async (request, onResult) => {
    let result
    try {
      result = await request()
    } catch (err) {
      log('Polling failed for fn:', fn)
      log('Error:', err)
      // Stop polling and let requester handle
      throw err
    }

    if (!stop) {
      onResult(result)
      timer = setTimeout(poll.bind(null, request, onResult), delay)
    }
  }
  return (...params) => {
    const { request, onResult } = fn(...params)
    poll(request, onResult)
    return () => {
      stop = true
      clearTimeout(timer)
    }
  }
}

// Get the icon URL of an app (legacy)
export function legacyAppIconUrl(app) {
  return app && app.baseUrl
    ? resolvePathname('images/icon.svg', app.baseUrl)
    : null
}

// Get the best icon for the given size.
// Set size to -1 to get the largest one, or to 0 to get the smallest one.
export function getAppIconBySize(icons, size = -1) {
  // Collect the sizes and sort them
  const sizes = icons
    .map((icon, i) => {
      const width = parseInt(icon.sizes.split('x')[1], 10)
      return [i, isNaN(width) ? -1 : width]
    })
    .filter(size => size[1] !== -1)
    .sort((a, b) => a[1] - b[1])

  // No valid size found
  if (sizes.length === 0) {
    return null
  }

  // No rendering size provided: return the largest icon.
  if (size === -1) {
    return icons[sizes[sizes.length - 1][0]]
  }

  // Find the first icon that is equal or larger than the provided size,
  // or the largest one otherwise.
  const iconIndex = (sizes.find(iconSize => iconSize[1] >= size) ||
    sizes[sizes.length - 1])[0]
  return icons[iconIndex]
}

export function imgSrcFromBase(baseUrl, imgSrc) {
  return resolvePathname(removeStartingSlash(imgSrc), baseUrl)
}

// Get the icon URL of an app.
// `size` is the size at which the icon will be rendered.
export function appIconUrl(app, size = -1) {
  if (!app || !app.baseUrl || !Array.isArray(app.icons)) {
    return null
  }

  const icon = getAppIconBySize(app.icons, size)
  return icon ? imgSrcFromBase(app.baseUrl, icon.src) : null
}

export function isElectron() {
  // See https://github.com/electron/electron/issues/2288
  return (
    typeof navigator === 'object' &&
    typeof navigator.userAgent === 'string' &&
    navigator.userAgent.indexOf('Electron') >= 0
  )
}

// do nothing
export function noop() {}

// return the first argument (named after lodash)
export const identity = arg => arg

export function removeStartingSlash(str) {
  return str.replace(/^\/+/, '')
}

export function addStartingSlash(str) {
  return str.startsWith('/') ? str : `/${str}`
}

// Append a trailing slash if needed
export function appendTrailingSlash(str) {
  return str + (str.endsWith('/') ? '' : '/')
}

export function log(...params) {
  if (
    process.env.NODE_ENV !== 'production' &&
    process.env.NODE_ENV !== 'test'
  ) {
    console.log(...params)
  }
}

export function isString(str) {
  return typeof str === 'string' || str instanceof String
}

export function isHumanReadable(str = '') {
  return !str.split(' ').some(word => word.length > 26)
}
// Thanks to https://stackoverflow.com/a/12646864
export function shuffleArray(original) {
  const array = [...original]
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[array[i], array[j]] = [array[j], array[i]]
  }
  return array
}

export function getLocalStorageKey(key, networkType) {
  return `${networkType}:${key}`
}

export function validateEmail(email) {
  // eslint-disable-next-line no-useless-escape
  return /^.+\@.+\..+$/.test(email)
}

export const iOS =
  /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream

export const isSafari = /Version\/[\d.]+.*Safari/.test(navigator.userAgent)
