import { useEffect, useRef, useState } from 'react'
import useMeasure from 'react-use-measure'

function useStepperLayout() {
  const [outerBoundsRef, outerBounds] = useMeasure()
  const innerBoundsRef = useRef()
  const [innerBounds, setInnerBounds] = useState(null)
  const [measuring, setMeasuring] = useState(true)

  // First render must always be in "multiple" mode so that our measurement reference point is accurate
  const [layout, setLayout] = useState('multiple')

  useEffect(() => {
    const outerMeasured = outerBounds.width && outerBounds.width > 0

    if (!innerBounds) {
      setInnerBounds(innerBoundsRef.current.offsetWidth)
      setMeasuring(false)
    }

    if (outerMeasured && outerBounds.width < innerBounds) {
      setLayout('single')
    }

    if (outerMeasured && outerBounds.width >= innerBounds) {
      setLayout('multiple')
    }
  }, [outerBounds, innerBounds])

  return { outerBoundsRef, innerBoundsRef, layout, measuring }
}

export default useStepperLayout
