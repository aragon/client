import { useEffect, useRef, useState, useLayoutEffect } from 'react'
import useMeasure from 'react-use-measure'
import { ResizeObserver } from '@juggle/resize-observer'

function useStepperLayout() {
  const [outerBoundsRef, outerBounds] = useMeasure({ polyfill: ResizeObserver })
  const innerBoundsRef = useRef()
  const [innerBounds, setInnerBounds] = useState(null)

  // First render must always be in "multiple" mode so that our measurement reference point is accurate
  const [layout, setLayout] = useState('multiple')

  // It's important that we only query for the inner offsetWidth once so that our reference width remains constant
  useLayoutEffect(() => {
    if (!innerBounds) {
      setInnerBounds(innerBoundsRef.current.offsetWidth)
    }
  }, [innerBounds])

  useEffect(() => {
    const outerMeasured = outerBounds.width > 0

    if (outerMeasured && outerBounds.width < innerBounds) {
      setLayout('single')
    }

    if (outerMeasured && outerBounds.width >= innerBounds) {
      setLayout('multiple')
    }
  }, [outerBounds, innerBounds])

  return { outerBoundsRef, innerBoundsRef, layout }
}

export default useStepperLayout
