import React, { useState, useRef } from 'react'
import { Button, ButtonBase, useTheme } from '@aragon/ui'
import {
  useClickOutside,
  useOnBlur,
  useEsc,
  useArrowKeysFocus,
} from '../../hooks'

function ButtonDropDown({
  items,
  cover,
  opened,
  onCoverClick,
  onItemClick,
  onBlur,
  containerRef,
  refs,
  highlightedIndex,
  setHighlightedIndex,
  ...props
}) {
  const theme = useTheme()

  return (
    <div
      {...props}
      ref={containerRef}
      onBlur={onBlur}
      css={`
        position: relative;
        background: ${theme.contentBackground};
      `}
    >
      <Button
        css={`
          display: flex;
          align-items: center;
          height: 40px;
        `}
        onClick={onCoverClick}
      >
        {cover}
      </Button>
      {opened && (
        <ul
          css={`
            position: absolute;
            padding: 0;
            margin: 0;
            list-style: none;
            border: 1px solid ${theme.border};
            border-radius: 4px;
            background: ${theme.surface};
            width: 100%;
          `}
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
                    width: 100%;
                    border-left: 3px solid transparent;
                    border-radius: 0;
                    &:hover,
                    &:focus {
                      outline: none;
                    }

                    ${index === 0 &&
                      `
                        border-top-left-radius: 3px;
                        border-top-right-radius: 3px;
                      `}
                    ${index === items.length - 1 &&
                      `
                        border-bottom-left-radius: 3px;
                        border-bottom-right-radius: 3px;
                      `}
                    ${index === highlightedIndex &&
                      `
                        background: ${theme.surfaceHighlight};
                        border-left: 3px solid ${theme.accent};
                      `}
                  `}
                  onClick={onItemClick(index)}
                >
                  {item}
                </ButtonBase>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}

function useButtonDropDown(onClick) {
  const refs = []
  const containerRef = useRef()
  const [opened, setOpened] = useState(false)
  const handleItemClick = index => e => {
    handleClose()
    onClick(index)
  }
  const handleClose = () => {
    reset()
    setOpened(false)
  }

  const { handleBlur } = useOnBlur(handleClose, containerRef)
  const { highlightedIndex, setHighlightedIndex } = useArrowKeysFocus(refs)
  const reset = setHighlightedIndex(-1)
  useClickOutside(handleClose, containerRef)
  useEsc(handleClose)

  return {
    opened,
    setOpened,
    handleItemClick,
    handleBlur,
    containerRef,
    refs,
    highlightedIndex,
    setHighlightedIndex,
  }
}

export default React.memo(({ onClick, ...props }) => {
  const {
    opened,
    setOpened,
    handleItemClick,
    containerRef,
    handleBlur,
    refs,
    highlightedIndex,
    setHighlightedIndex,
  } = useButtonDropDown(onClick)
  const handleToggle = () => setOpened(!opened)

  return (
    <ButtonDropDown
      {...props}
      refs={refs}
      highlightedIndex={highlightedIndex}
      opened={opened}
      onCoverClick={handleToggle}
      onItemClick={handleItemClick}
      containerRef={containerRef}
      onBlur={handleBlur}
      setHighlightedIndex={setHighlightedIndex}
    />
  )
})
