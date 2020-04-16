import PropTypes from 'prop-types'
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
} from 'react'
import { createHashHistory as createHistory } from 'history'
import { staticApps } from './static-apps'
import { isAddress, isValidEnsName } from './web3-utils'
import { addStartingSlash } from './utils'

export const ARAGONID_ENS_DOMAIN = 'aragonid.eth'

// The locator represents the current route.
// It contains a mode object, which represents one of the app modes.
//
// Locator {
//   mode: // OrgMode or OnboardingMode (see below)
//   preferences: {
//     section    // preferences section name
//     subsection // preferences subsection
//     data       // section data
//   }
// }
//
// OrgMode {
//   name = "org"
//   orgAddress   // ENS domain or Ethereum address for the organization
//   instanceId   // app proxy address or internal app identifier (apps, console, etc.)
//   instancePath // app local path
// }
//
// OnboardingMode {
//   name = "onboarding"
//   status       // "open" or "create"
// }

// Encode an app local path in a way that can be safely used in the URL
function encodeAppPath(path) {
  return addStartingSlash(
    path
      .split('/')
      .map(v => encodeURIComponent(v))
      .join('/')
  )
}

// Decodes an app local path from the URL
function decodeAppPathParts(pathParts) {
  return pathParts.map(v => decodeURIComponent(v)).join('/')
}

// Parse a path and a search query and return a locator object.
export function parsePath(pathname, search = '') {
  const [, ...parts] = pathname.split('/')

  const baseLocator = {
    preferences: parsePreferences(search),
  }

  // Onboarding
  if (!parts[0] || parts[0] === 'open' || parts[0] === 'create') {
    return {
      ...baseLocator,
      mode: {
        name: 'onboarding',
        status: parts[0] || 'welcome',
      },
    }
  }

  let [orgAddress] = parts
  const validAddress = isAddress(orgAddress)
  const validDomain = isValidEnsName(orgAddress)

  // Assume .aragonid.eth if not given a valid address or a valid ENS domain
  if (!validAddress && !validDomain) {
    orgAddress += `.${ARAGONID_ENS_DOMAIN}`
  }

  const [, instanceId, ...instancePathParts] = parts

  // The local path of an app (internal or external)
  const instancePath = `/${
    instancePathParts ? decodeAppPathParts(instancePathParts) : ''
  }`

  return {
    ...baseLocator,
    mode: {
      name: 'org',
      instanceId: instanceId || 'home',
      instancePath: instancePath || '',
      orgAddress: orgAddress || '',
    },
  }
}

// Return a path string from a locator updater.
export function getPath({ mode, preferences } = {}) {
  // preferences
  const search =
    preferences && preferences.section ? getPreferencesSearch(preferences) : ''

  if (!mode) {
    return `/${search}`
  }

  if (mode.name === 'onboarding') {
    return `/${
      !mode.status || mode.status === 'welcome' ? '' : mode.status
    }${search}`
  }

  if (mode.name !== 'org') {
    return `/${search}`
  }

  // Only keep the full address if it ends in aragonid.eth
  let { orgAddress } = mode
  if (orgAddress.endsWith(ARAGONID_ENS_DOMAIN)) {
    orgAddress = orgAddress.substr(
      0,
      orgAddress.indexOf(ARAGONID_ENS_DOMAIN) - 1
    )
  }

  if (!orgAddress) {
    return `/${search}`
  }

  const { instanceId = '', instancePath = '' } = mode

  // Either the address of an app instance or the path of an internal app.
  const instancePart = staticApps.has(instanceId)
    ? staticApps.get(instanceId).route
    : `/${instanceId}`

  return '/' + orgAddress + instancePart + encodeAppPath(instancePath) + search
}

// Preferences
function parsePreferences(search = '') {
  const searchParams = new URLSearchParams(search)
  const path = searchParams.get('preferences') || ''
  const labels = searchParams.get('labels')

  const [, section = '', subsection = ''] = path.split('/')

  const data = {}

  if (labels) {
    data.labels = labels
  }

  return { section, subsection, data }
}

// For preferences, get the “search” part of the path (?=something)
// This function will probably be unified with parsePath() later.
export function getPreferencesSearch({ section, subsection, data = {} } = {}) {
  const params = new URLSearchParams()

  params.append(
    'preferences',
    `/${section}${subsection ? `/${subsection}` : ''}`
  )

  if (data.labels) {
    params.append('labels', data.labels)
  }

  const search = decodeURIComponent(params.toString())
  return search ? `?${search}` : ''
}

const RoutingContext = React.createContext()

export function RoutingProvider({ children }) {
  const history = useRef(null)

  const [{ locator, previousLocator }, updateLocator] = useReducer(
    ({ locator, previousLocator }, newLocator) => ({
      previousLocator: locator,
      locator: newLocator,
    }),
    null,
    () => ({ locator: parsePath('/'), previousLocator: null })
  )

  // Change the URL if needed
  const updatePath = useCallback(path => {
    const location = history.current && history.current.location

    if (location && path !== location.pathname + location.search) {
      history.current.push(path)
    }
  }, [])

  const getPathFromLocator = useCallback(
    (locatorUpdate, extend = true) => {
      if (typeof locatorUpdate === 'function') {
        locatorUpdate = locatorUpdate(locator)
      }

      const baseLocator = extend
        ? { ...locator, ...locatorUpdate }
        : locatorUpdate

      const mode = locatorUpdate.mode
        ? {
            ...locatorUpdate.mode,

            // If no mode name is set, use the current
            name: locatorUpdate.mode.name || locator.mode.name,
          }
        : locator.mode

      return getPath({ ...baseLocator, mode })
    },
    [locator]
  )

  const updatePathFromLocator = useCallback(
    (locatorUpdate, extend = true) => {
      updatePath(getPathFromLocator(locatorUpdate, extend))
    },
    [getPathFromLocator, updatePath]
  )

  const handleLocation = useCallback(({ pathname, search, state = {} }) => {
    if (state.alreadyParsed) {
      return
    }

    const locator = parsePath(pathname, search)

    // Replace URL with non-aragonid.eth version
    if (
      locator.orgAddress &&
      locator.orgAddress.endsWith(ARAGONID_ENS_DOMAIN)
    ) {
      history.current.replace({
        pathname: locator.pathname.replace(`.${ARAGONID_ENS_DOMAIN}`, ''),
        search: locator.search,
        state: { alreadyParsed: true },
      })
    }

    updateLocator(locator)
  }, [])

  const back = useCallback(() => {
    if (!history.current) {
      return
    }
    if (previousLocator) {
      history.current.goBack()
    } else {
      updatePath('/')
    }
  }, [previousLocator, updatePath])

  useEffect(() => {
    history.current = createHistory()

    handleLocation(history.current.location)

    // history.current.listen() returns a function to stop listening.
    return history.current.listen(handleLocation)
  }, [handleLocation])

  const routing = useMemo(
    () => ({
      back,
      locator,
      mode: locator.mode,
      path: getPathFromLocator,
      preferences: locator.preferences,
      update: updatePathFromLocator,
    }),
    [back, getPathFromLocator, locator, updatePathFromLocator]
  )

  return (
    <RoutingContext.Provider value={routing}>
      {children}
    </RoutingContext.Provider>
  )
}

RoutingProvider.propTypes = { children: PropTypes.node }

export function useRouting() {
  return useContext(RoutingContext)
}
