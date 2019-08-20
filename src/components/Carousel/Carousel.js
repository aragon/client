import React, { useCallback, useEffect, useState, useMemo, useRef } from 'react'
import PropTypes from 'prop-types'
import { GU, useViewport } from '@aragon/ui'
import { Spring, animated } from 'react-spring'
import PrevNext from './PrevNext'

// TODO:
//  - Center the items when the total is smaller than the viewport.
//  - Touch drag

const AnimatedDiv = animated.div

function Carousel({ items, itemWidth, itemHeight, itemSpacing }) {
  const [selected, setSelected] = useState(0)
  const [containerWidth, setContainerWidth] = useState(0)
  const [visibleItems, setVisibleItems] = useState(0)
  const container = useRef(null)
  const { width: vw } = useViewport()

  // Set the number of visible items,
  // and adjust the selected item if needed.
  useEffect(() => {
    const visibleItems = Math.floor(
      (containerWidth - itemSpacing * 2) / (itemWidth + itemSpacing)
    )
    setVisibleItems(visibleItems)
    setSelected(selected =>
      selected > items.length - visibleItems
        ? items.length - visibleItems
        : selected
    )
  }, [containerWidth, itemSpacing, itemWidth, items])

  const updateContainerWidth = useCallback(element => {
    setContainerWidth(element ? element.clientWidth : 0)
  }, [])

  useEffect(() => {
    if (container.current) {
      updateContainerWidth(container.current)
    }
  }, [vw, updateContainerWidth])

  const handleContainerRef = useCallback(
    element => {
      container.current = element
      updateContainerWidth(element)
    },
    [updateContainerWidth]
  )

  const prev = useCallback(() => {
    setSelected(selected => Math.max(0, selected - 1))
  }, [])

  const next = useCallback(() => {
    setSelected(selected => Math.min(items.length - visibleItems, selected + 1))
  }, [items.length, visibleItems])

  const sliderX = useMemo(() => {
    const visibleItemsWidth =
      visibleItems * itemWidth + (visibleItems - 1) * itemSpacing
    return (
      (containerWidth - visibleItemsWidth) / 2 -
      (itemWidth + itemSpacing) * selected
    )
  }, [containerWidth, itemSpacing, itemWidth, selected, visibleItems])

  return (
    <Spring to={{ sliderX }} native>
      {({ sliderX }) => (
        <div
          ref={handleContainerRef}
          css={`
            position: relative;
            overflow: hidden;
            width: 100%;
            height: ${itemHeight}px;
          `}
        >
          {selected > 0 && <PrevNext type="prev" onClick={prev} />}
          {selected < items.length - visibleItems && (
            <PrevNext type="next" onClick={next} />
          )}
          <AnimatedDiv
            style={{
              transform: sliderX.interpolate(v => `translate3d(${v}px, 0, 0)`),
            }}
            css={`
              display: flex;
              height: 100%;
              position: absolute;
            `}
          >
            {items.map((item, i) => (
              <div
                key={i}
                style={{
                  opacity:
                    i >= selected && i < selected + visibleItems ? 1 : 0.25,
                }}
                css={`
                  flex-grow: 0;
                  flex-shrink: 0;
                  width: ${itemWidth}px;
                  height: ${itemHeight}px;
                  transition: opacity 150ms ease-in-out;
                  & + & {
                    margin-left: ${3 * GU}px;
                  }
                `}
              >
                {item}
              </div>
            ))}
          </AnimatedDiv>
        </div>
      )}
    </Spring>
  )
}

Carousel.propTypes = {
  items: PropTypes.arrayOf(PropTypes.node).isRequired,
  itemWidth: PropTypes.number.isRequired,
  itemHeight: PropTypes.number.isRequired,
  itemSpacing: PropTypes.number.isRequired,
}

export default Carousel
