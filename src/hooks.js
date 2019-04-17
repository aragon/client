import { useCallback, useEffect, useState } from 'react'
import keycodes from './keycodes'

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
  const [step, setStep] = useState(0)

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

  return { step, next, prev, setStep }
}
