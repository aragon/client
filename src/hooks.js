import {
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useState,
  useRef,
  useContext,
} from 'react'
import {
  IdentityContext,
  identityEventTypes,
} from './components/IdentityManager/IdentityManager'
import { log, removeStartingSlash } from './utils'
import { addressesEqual } from './web3-utils'

// Update `now` at a given interval.
export function useNow(updateEvery = 1000) {
  const [now, setNow] = useState(new Date())
  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date())
    }, updateEvery)
    return () => {
      clearInterval(timer)
    }
  }, [updateEvery])
  return now
}

function stepsReducer(state, { type, value, steps }) {
  const { step } = state

  let newStep = null

  if (type === 'set') {
    newStep = value
  }
  if (type === 'next' && step < steps - 1) {
    newStep = step + 1
  }
  if (type === 'prev' && step > 0) {
    newStep = step - 1
  }

  if (newStep !== null && step !== newStep) {
    return {
      step: newStep,
      direction: newStep > step ? 1 : -1,
    }
  }

  return state
}

// Simple hook to manage a given number of steps.
export function useSteps(steps) {
  const [{ step, direction }, updateStep] = useReducer(stepsReducer, {
    step: 0,
    direction: 0,
  })

  // If the number of steps change, we reset the current step
  useEffect(() => {
    updateStep({ type: 'set', value: 0, steps })
  }, [steps])

  const setStep = useCallback(
    value => {
      updateStep({ type: 'set', value, steps })
    },
    [steps]
  )

  const next = useCallback(() => {
    updateStep({ type: 'next', steps })
  }, [steps])

  const prev = useCallback(() => {
    updateStep({ type: 'prev', steps })
  }, [steps])

  return {
    direction,
    next,
    prev,
    setStep,
    step,
  }
}

export function usePromise(fn, memoParams, defaultValue) {
  const [result, setResult] = useState(defaultValue)
  useEffect(() => {
    let cancelled = false
    fn()
      .then(value => {
        if (!cancelled) {
          setResult(value)
        }
        return null
      })
      .catch(e => console.error('An error occured: ', e))
    return () => {
      cancelled = true
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...memoParams, fn])
  return result
}

export function useRepoDetails(baseUrl, detailsUrl) {
  const fetchDescription = async () => {
    try {
      const raw = await fetch(`${baseUrl}${removeStartingSlash(detailsUrl)}`)
      return raw.text()
    } catch (e) {
      log('Error fetching decription: ', e)
    }
    return ''
  }
  return usePromise(fetchDescription, [detailsUrl], null)
}

export function useSelected(initial) {
  const [selected, setSelected] = useState(initial)
  const [allSelected, someSelected] = useMemo(
    () => [
      Array.from(selected.values()).every(Boolean),
      Array.from(selected.values()).some(Boolean),
    ],
    [selected]
  )
  return { selected, setSelected, allSelected, someSelected }
}

/* eslint-disable react-hooks/rules-of-hooks */
export function useClickOutside(cb, ref = useRef()) {
  /* eslint-enable react-hooks/rules-of-hooks */
  const handleClick = useCallback(
    e => {
      if (!ref.current.contains(e.target)) {
        cb()
      }
    },
    [cb, ref]
  )

  useEffect(() => {
    document.addEventListener('click', handleClick, true)
    return () => {
      document.removeEventListener('click', handleClick, true)
    }
  }, [handleClick])

  return { ref }
}

/* eslint-disable react-hooks/rules-of-hooks */
export function useOnBlur(cb, ref = useRef()) {
  /* eslint-enable react-hooks/rules-of-hooks */
  const handleBlur = useCallback(
    e => {
      // when event is triggered by click relatedTarget is null
      // when another element is gaining focus then it holds some value
      if (e.relatedTarget && !ref.current.contains(e.relatedTarget)) {
        cb()
      }
    },
    [cb, ref]
  )

  return { ref, handleBlur }
}

export function useLocalIdentity(entity) {
  const { resolve, identityEvents$ } = useContext(IdentityContext)
  const [name, setName] = useState(null)

  // TODO: stop exporting this function as it is not cancellable from the outside.
  const handleResolve = useCallback(async () => {
    try {
      const { name = null } = (await resolve(entity)) || {}
      setName(name)
    } catch (e) {
      // address does not resolve to identity
    }
  }, [resolve, entity])

  const handleRemove = useCallback(
    addresses => {
      if (addresses.some(address => addressesEqual(entity, address))) {
        setName(null)
      }
    },
    [entity]
  )

  useEffect(() => {
    let cancelled = false

    const updateEntityName = async () => {
      try {
        const resolved = await resolve(entity)
        if (!cancelled) {
          setName((resolved && resolved.name) || null)
        }
      } catch (err) {
        if (!cancelled) {
          setName(null)
        }
      }
    }

    const subscription = identityEvents$.subscribe(event => {
      switch (event.type) {
        case identityEventTypes.MODIFY:
          if (addressesEqual(entity, event.address)) {
            updateEntityName()
          }
          return
        case identityEventTypes.IMPORT:
          return updateEntityName()
        case identityEventTypes.REMOVE:
          return handleRemove(event.addresses)
      }
    })

    updateEntityName()

    return () => {
      cancelled = true
      subscription.unsubscribe()
    }
  }, [identityEvents$, resolve, entity, handleRemove])

  return { name, handleResolve }
}

// TODO: use in the future to detect dark mode
export function useMatchMedia(query) {
  const [matches, setMatches] = useState(false)

  const mq = useMemo(() => window.matchMedia(query), [query])

  useEffect(() => {
    const fn = ({ matches }) => setMatches(matches)
    mq.addListener(fn)
    return () => mq.removeListener(fn)
  }, [mq, query])

  return matches
}

export function usePrefersDarkMode() {
  return useMatchMedia('(prefers-color-scheme: dark)')
}
