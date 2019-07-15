import React, { useMemo, useState, useRef, useCallback } from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import { Button, ButtonBase, RADIUS, springs, useTheme } from '@aragon/ui'
import { Transition, animated } from 'react-spring'
import { useClickOutside, useOnBlur, useEsc } from '../../hooks'

function ButtonDropDown({ compact, onClick, items, cover, ...props }) {
  const theme = useTheme()
  const {
    containerRef,
    handleBlur,
    handleItemClick,
    handleToggle,
    opened,
    refs,
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
          ${compact &&
            `
              width: 50px;
              min-width: unset;
            `}
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
              css={`
                width: ${compact ? '165px' : '100%'};
                right: ${compact ? 0 : 'initial'};
              `}
            >
              {items.map((item, index) => {
                const handleItemClickWithIndex = handleItemClick(index)
                return (
                  <li key={index}>
                    <ButtonBase
                      ref={node => (refs[index] = node)}
                      css={`
                        display: flex;
                        align-items: center;
                        height: 40px;
                        width: calc(100% - 1px);
                        border-radius: 0;

                        ${index === items.length - 1 &&
                          `
                            border-bottom-left-radius: ${RADIUS}px;
                            border-bottom-right-radius: ${RADIUS}px;
                          `}

                        &:active, {
                          background: ${theme.surfaceHighlight};
                        }
                      `}
                      onClick={handleItemClickWithIndex}
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
  items: PropTypes.array.isRequired,
  cover: PropTypes.node.isRequired,
  compact: PropTypes.bool,
}

const List = styled(animated.ul)`
  position: absolute;
  padding: 0;
  margin: 0;
  list-style: none;
  border: ${({ border }) => `1px solid ${border}`};
  border-radius: ${RADIUS}px;
  background: ${({ surface }) => surface};
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.03);
`

function useButtonDropDown(onClick) {
  const refs = []
  const containerRef = useRef()
  const [opened, setOpened] = useState(false)
  const handleToggle = useCallback(() => setOpened(!opened), [
    setOpened,
    opened,
  ])
  const handleClose = useCallback(() => {
    setOpened(false)
  }, [setOpened])
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
    opened,
    refs,
  }
}

export default React.memo(ButtonDropDown)
