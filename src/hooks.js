import {
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useState,
  useRef,
} from 'react'
import keycodes from './keycodes'
import { log, removeStartingSlash } from './utils'

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

export function useEsc(cb) {
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

/* eslint-disable react-hooks/rules-of-hooks */
export function useArrowKeysFocus(refs) {
  /* eslint-enable react-hooks/rules-of-hooks */
  const [highlightedIndex, setHighlightedIndex] = useState(-1)

  const cycleFocus = useCallback(
    (e, change) => {
      e.preventDefault()
      let next = highlightedIndex + change
      if (next > refs.length - 1) {
        next = 0
      }
      if (next < 0) {
        next = refs.length - 1
      }
      setHighlightedIndex(next)
    },
    [highlightedIndex, refs.length]
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

  useEffect(() => {
    if (highlightedIndex === -1) {
      return
    }
    if (!refs[highlightedIndex]) {
      return
    }
    refs[highlightedIndex].focus()
  }, [highlightedIndex, refs])
  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  return {
    highlightedIndex,
    setHighlightedIndex: index => () => setHighlightedIndex(index),
  }
}
