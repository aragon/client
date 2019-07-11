import React, { useMemo, useState, useRef, useCallback } from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import { Button, ButtonBase, RADIUS, springs, useTheme } from '@aragon/ui'
import { Transition, animated } from 'react-spring'
import {
  useClickOutside,
  useOnBlur,
  useEsc,
  useArrowKeysFocusRefs as useArrowKeysFocus,
} from '../../hooks'

function ButtonDropDown({ onClick, items, cover, ...props }) {
  const theme = useTheme()
  const {
    containerRef,
    handleBlur,
    handleItemClick,
    handleToggle,
    highlightedIndex,
    opened,
    refs,
    setHighlightedIndex,
    setOpened,
  } = useButtonDropDown(onClick)

  return (
    <div
      {...props}
      ref={containerRef}
      onBlur={handleBlur}
      css={`
        position: relative;
        background: ${theme.surface};
      `}
    >
      <Button
        css={`
          display: flex;
          align-items: center;
          height: 40px;
        `}
        onClick={handleToggle}
      >
        {cover}
      </Button>
      <Transition
        config={springs.swift}
        items={opened}
        from={{ scale: 0.98, opacity: 0 }}
        enter={{ scale: 1, opacity: 1 }}
        leave={{ scale: 1, opacity: 0 }}
        native
      >
        {show =>
          show &&
          /* eslint-disable react/prop-types */
          (({ scale, opacity }) => (
            <List
              border={theme.border}
              surface={theme.surface}
              role="listbox"
              style={{
                opacity,
                transform: scale.interpolate(t => `scale3d(${t},${t},1)`),
              }}
            >
              {items.map((item, index) => {
                return (
                  <li key={index}>
                    <ButtonBase
                      ref={node => (refs[index] = node)}
                      onFocus={setHighlightedIndex(index)}
                      onMouseOver={setHighlightedIndex(index)}
                      css={`
                       display: flex;
                       align-items: center;
                       height: 40px;
                       width: calc(100% - 1px);
                       border-left: 2px solid transparent;
                       border-radius: 0;
                       &:hover,
                       &:focus {
                         outline: none;
                       }

                       ${index === 0 &&
                         `
                           border-top-left-radius: ${RADIUS}px;
                           border-top-right-radius: ${RADIUS}px;
                         `}
                       ${index === items.length - 1 &&
                         `
                           border-bottom-left-radius: ${RADIUS}px;
                           border-bottom-right-radius: ${RADIUS}px;
                         `}
                       ${index === highlightedIndex &&
                         `
                           background: ${theme.surfaceHighlight};
                           border-left: 2px solid ${theme.accent};
                         `}
                     `}
                      onClick={handleItemClick(index)}
                    >
                      {item}
                    </ButtonBase>
                  </li>
                )
              })}
            </List>
          ))
        /* eslint-enable react/prop-types */
        }
      </Transition>
    </div>
  )
}

ButtonDropDown.propTypes = {
  onClick: PropTypes.func.isRequired,
  items: PropTypes.array,
  cover: PropTypes.node,
}

const List = styled(animated.ul)`
  position: absolute;
  padding: 0;
  margin: 0;
  list-style: none;
  border: ${({ border }) => `1px solid ${border}`};
  border-radius: ${RADIUS}px;
  background: ${({ surface }) => surface};
  width: 100%;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.03);
`

function useButtonDropDown(onClick) {
  const refs = []
  const { highlightedIndex, setHighlightedIndex } = useArrowKeysFocus(refs)
  const reset = useMemo(() => setHighlightedIndex(-1), [setHighlightedIndex])
  const containerRef = useRef()
  const [opened, setOpened] = useState(false)
  const handleToggle = useCallback(() => setOpened(!opened), [
    setOpened,
    opened,
  ])
  const handleClose = useCallback(() => {
    reset()
    setOpened(false)
  }, [reset, setOpened])
  const handleItemClick = useCallback(
    index => e => {
      handleClose()
      onClick(index)
    },
    [handleClose, onClick]
  )
  const { handleBlur } = useOnBlur(handleClose, containerRef)
  useClickOutside(handleClose, containerRef)
  useEsc(handleClose)

  return {
    containerRef,
    handleBlur,
    handleItemClick,
    handleToggle,
    highlightedIndex,
    opened,
    refs,
    setHighlightedIndex,
    setOpened,
  }
}

export default React.memo(ButtonDropDown)
