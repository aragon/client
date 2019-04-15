import resolvePathname from 'resolve-pathname'

// Stealing this from recompose / etc for now
export function compose(...funcs) {
  if (funcs.length === 0) {
    return arg => arg
  }

  if (funcs.length === 1) {
    return funcs[0]
  }

  return funcs.reduce((a, b) => (...args) => a(b(...args)))
}

// Get the best icon for the given size.
// Set size to -1 to get the largest one, or to 0 to get the smallest one.
function getAppIconBySize(icons, size = -1) {
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

  // Find the first icon that is equal or larger than the provided size.
  const greaterOrEqualSize = sizes.find(iconSize => iconSize[1] >= size)

  // Return the found icon, or the largest one otherwise.
  return icons[greaterOrEqualSize ? greaterOrEqualSize[0] : icons.length - 1]
}

// Get the icon URL of an app.
// `size` is the size at which the icon will be rendered.
export function appIconUrl(app, size = -1) {
  if (!app || !app.baseUrl || !Array.isArray(app.icons)) {
    return null
  }

  const icon = getAppIconBySize(app.icons, size)
  return icon
    ? resolvePathname(removeStartingSlash(icon.src), app.baseUrl)
    : null
}

export function isElectron() {
  // See https://github.com/electron/electron/issues/2288
  return (
    typeof navigator === 'object' &&
    typeof navigator.userAgent === 'string' &&
    navigator.userAgent.indexOf('Electron') >= 0
  )
}

export function noop() {}

export function removeStartingSlash(str) {
  return str.replace(/^\/+/, '')
}

// Append a trailing slash if needed
export function appendTrailingSlash(str) {
  return str + (str.endsWith('/') ? '' : '/')
}

export function log(...params) {
  if (process.env.NODE_ENV !== 'production') {
    console.log(...params)
  }
}

export function isString(str) {
  return typeof str === 'string' || str instanceof String
}
