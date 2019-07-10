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
import keycodes from './keycodes'
import { log, removeStartingSlash } from './utils'
import { atou } from './string-utils'

const KEYCODE_UP = 38
const KEYCODE_DOWN = 40

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

// Handle arrow keys.
export function useArrows({ onUp, onLeft, onDown, onRight } = {}) {
  useEffect(() => {
    const actions = [
      [keycodes.up, onUp],
      [keycodes.left, onLeft],
      [keycodes.down, onDown],
      [keycodes.right, onRight],
    ]
    const onKeyDown = e => {
      for (const [keyCode, cb] of actions) {
        if (cb && e.keyCode === keyCode) {
          e.preventDefault()
          cb()
          break
        }
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [onUp, onLeft, onDown, onRight])
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

export function useEsc(cb, deps) {
  const handlekeyDown = useCallback(
    e => {
      if (e.keyCode === keycodes.esc) {
        cb()
      }
    },
    [cb]
  )
  useEffect(() => {
    window.addEventListener('keydown', handlekeyDown)
    return () => window.removeEventListener('keydown', handlekeyDown)
  }, [handlekeyDown])
}

const QUERY_VAR = '?labels='
// checks if query string var exists
// parses data and validates data consistency (will throw if prop don't exist)
export function useSharedLabels(dao) {
  const [isSharedLink, setIsSharedLink] = useState(false)
  const [sharedLabels, setSharedLabels] = useState([])

  const removeSharedLink = useCallback(
    () => (window.location.hash = `#/${dao}`),
    [dao]
  )

  useEffect(() => {
    const index = window.location.hash.indexOf(QUERY_VAR)
    if (index > -1) {
      const raw = window.location.hash.substr(index + QUERY_VAR.length)
      try {
        const data = JSON.parse(atou(raw))
        setSharedLabels(data.map(({ address, name }) => ({ address, name })))
        setIsSharedLink(true)
      } catch (e) {
        console.warn(
          'There was an error parsing/validating the shared data: ',
          e
        )
      }
    }
  }, [])

  return { isSharedLink, setIsSharedLink, sharedLabels, removeSharedLink }
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
      if (!ref.current.contains(e.relatedTarget)) {
        cb()
      }
    },
    [cb, ref]
  )

  return { ref, handleBlur }
}

/* eslint-disable react-hooks/rules-of-hooks */
export function useArrowKeysFocus(query, containerRef = useRef()) {
  /* eslint-enable react-hooks/rules-of-hooks */
  const [highlightedIndex, setHighlightedIndex] = useState(-1)

  const reset = () => setHighlightedIndex(-1)
  const cycleFocus = useCallback(
    (e, change) => {
      e.preventDefault()
      const elements = document.querySelectorAll(query)
      let next = highlightedIndex + change
      if (next > elements.length - 1) {
        next = 0
      }
      if (next < 0) {
        next = elements.length - 1
      }
      if (!elements[next]) {
        next = -1
      }
      setHighlightedIndex(next)
    },
    [highlightedIndex, query]
  )
  const handleKeyDown = useCallback(
    e => {
      const { keyCode } = e
      if (keyCode === KEYCODE_UP || keyCode === KEYCODE_DOWN) {
        cycleFocus(e, keyCode === KEYCODE_UP ? -1 : 1)
      }
    },
    [cycleFocus]
  )

  const { handleBlur: handleContainerBlur } = useOnBlur(reset, containerRef)
  useEffect(() => {
    if (highlightedIndex === -1) {
      return
    }
    const elements = document.querySelectorAll(query)
    if (!elements[highlightedIndex]) {
      return
    }
    elements[highlightedIndex].focus()
  }, [highlightedIndex, query])
  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  return { containerRef, handleContainerBlur }
}

export function useLocalIdentity(entity) {
  const { resolve, identityEvents$ } = useContext(IdentityContext)
  const [name, setName] = useState(null)

  const handleResolve = useCallback(async () => {
    try {
      const { name = null } = (await resolve(entity)) || {}
      setName(name)
    } catch (e) {
      // address does not resolve to identity
    }
  }, [resolve, entity])

  useEffect(() => {
    handleResolve()
    const subscription = identityEvents$.subscribe(({ address, type }) => {
      switch (type) {
        case identityEventTypes.MODIFY:
          if (entity.toLowerCase() === address.toLowerCase()) {
            handleResolve()
          }
          return
        case identityEventTypes.CLEAR:
          setName(null)
          return
        case identityEventTypes.IMPORT:
          handleResolve()
      }
    })
    return () => {
      subscription.unsubscribe()
    }
  }, [identityEvents$, handleResolve, entity])

  return { name }
}
