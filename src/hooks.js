import { useCallback, useEffect, useState, useMemo } from 'react'
import keycodes from './keycodes'
import { log, removeStartingSlash } from './utils'

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

// Simple hook to manage a given number of steps.
export function useSteps(steps) {
  const [step, _setStep] = useState(0)
  const [direction, setDirection] = useState(0)

  const setStep = useCallback(
    newStep => {
      if (step !== newStep) {
        setDirection(newStep > step ? 1 : -1)
        _setStep(newStep)
      }
    },
    [setDirection, _setStep, step]
  )

  const next = useCallback(() => {
    if (step < steps - 1) {
      setStep(step + 1)
    }
  }, [step, steps])

  const prev = useCallback(() => {
    if (step > 0) {
      setStep(step - 1)
    }
  }, [step, steps])

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
  }, [...deps])
}

const QUERY_VAR = '?labels='
// checks if query string var exists
// parses data and validates data consistency (will throw if prop don't exist)
export function useSharedLabels(dao) {
  const [isSharedLink, setIsSharedLink] = useState(false)
  const [sharedLabels, setSharedLabels] = useState([])

  const removeSharedLink = useCallback(
    () => (window.location.hash = `#/${dao}`),
    [window.location.hash]
  )

  useEffect(() => {
    const index = window.location.hash.indexOf(QUERY_VAR)
    if (index > -1) {
      const raw = window.location.hash.substr(index + QUERY_VAR.length)
      try {
        const data = JSON.parse(window.decodeURI(atob(raw)))
        setSharedLabels(data.map(({ address, name }) => ({ address, name })))
        setIsSharedLink(true)
      } catch (e) {
        console.warn(
          'There was an error parsing/validating the shared data: ',
          e
        )
      }
    }
  }, [window.location.hash])

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
