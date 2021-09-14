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
import { log, addStartingSlash } from './util/utils'
import { staticApps } from './static-apps'
import { isAddress, isValidEnsName } from './util/web3'

import { trackPage } from './analytics'
import { useAPM, instrumentAPMRouts } from './contexts/elasticAPM'

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
  // Preferences
  const search = getPreferencesSearch(preferences)

  // Fallback if no expected path was found
  const fallbackPath = `/${search}`

  if (!mode) {
    return fallbackPath
  }

  if (mode.name === 'onboarding') {
    const { status } = mode
    return `/${!status || status === 'welcome' ? '' : status}${search}`
  }

  if (mode.name === 'org') {
    let { orgAddress } = mode

    if (!orgAddress) {
      log(
        "Routing(path): 'orgAddress' is a required component for 'org' mode. " +
          `Defaulted to '${fallbackPath}'.`
      )
      return fallbackPath
    }

    // Only keep the full address if it ends in aragonid.eth
    if (orgAddress.endsWith(ARAGONID_ENS_DOMAIN)) {
      orgAddress = orgAddress.substr(
        0,
        orgAddress.indexOf(ARAGONID_ENS_DOMAIN) - 1
      )
    }

    // Either the address of an app instance or the path of an internal app.
    const { instanceId = '' } = mode
    const instancePart = staticApps.has(instanceId)
      ? staticApps.get(instanceId).route
      : instanceId
      ? `/${instanceId}`
      : ''

    let { instancePath = '' } = mode
    if (instancePath && !instanceId) {
      log(
        "Routing(path): 'instancePath' can only be provided if an " +
          `'instanceId' is provided in 'org' mode. Ignored '${instancePath}'.`
      )
      instancePath = ''
    }

    return (
      '/' + orgAddress + instancePart + encodeAppPath(instancePath) + search
    )
  }

  log(
    `Routing(path): invalid mode '${mode.name}' set. Defaulted to '${fallbackPath}'.`
  )

  return fallbackPath
}

// Preferences
export function parsePreferences(search = '') {
  const searchParams = new URLSearchParams(search)
  const path = searchParams.get('preferences') || ''
  // Ignore labels if search does not contain a preferences path
  const labels = searchParams.has('preferences')
    ? searchParams.get('labels')
    : ''

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
  if (!section) {
    if (subsection) {
      log(
        "Routing(preferences): 'subsection' can only be provided if 'section' " +
          `is provided. Ignored '${subsection}'.`
      )
    }
    return ''
  }

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
    locatorUpdate => {
      if (typeof locatorUpdate === 'function') {
        locatorUpdate = locatorUpdate(locator) || {}
      }
      return getPath(locatorUpdate)
    },
    [locator]
  )

  const updatePathFromLocator = useCallback(
    locatorUpdate => {
      updatePath(getPathFromLocator(locatorUpdate))
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

    // analytics
    history.current.listen(change => {
      trackPage(change.pathname)
    })

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

  const { apm } = useAPM()
  useEffect(() => {
    instrumentAPMRouts(apm, routing.mode)
  }, [apm, routing.mode])

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
