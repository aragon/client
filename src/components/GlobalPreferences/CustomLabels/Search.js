import React, { useEffect, useState, useCallback } from 'react'
import PropTypes from 'prop-types'
import {
  Button,
  ButtonIcon,
  GU,
  IconCross,
  IconSearch,
  TextInput,
  useTheme,
  useLayout,
  textStyle,
} from '@aragon/ui'

const SEARCH_CLOSED = Symbol('closed')
const SEARCH_OPEN = Symbol('open')
const EMPTY = ''

const Search = React.memo(function Search({ onChange, value }) {
  const { layoutName } = useLayout()
  const compact = layoutName === 'small'
  const theme = useTheme()

  const [mode, setMode] = useState(compact ? SEARCH_CLOSED : SEARCH_OPEN)
  const open = useCallback(() => setMode(SEARCH_OPEN), [setMode])
  const clear = useCallback(() => {
    setMode(compact ? SEARCH_CLOSED : SEARCH_OPEN)
    onChange({ currentTarget: { value: EMPTY } })
  }, [onChange, compact])

  useEffect(() => {
    setMode(compact ? SEARCH_CLOSED : SEARCH_OPEN)
  }, [compact])

  if (mode === SEARCH_CLOSED) {
    return (
      <Button
        onClick={open}
        css={`
          padding: 0;
          min-width: unset;
          width: ${5 * GU}px;
        `}
      >
        <IconSearch
          css={`
            color: ${theme.surfaceOpened};
          `}
        />
      </Button>
    )
  }

  return (
    <div
      css={`
        position: relative;

        ${compact
          ? `
            position: absolute;
            top: 0;
            left: 0;
            padding: ${2 * GU}px;
            right: 0;
            background: ${theme.surface};
            z-index: 1;
          `
          : ''}
      `}
    >
      <TextInput
        adornment={
          compact || value.trim() !== EMPTY ? (
            <ButtonIcon label="Clear search" onClick={clear}>
              <IconCross
                css={`
                  color: ${theme.surfaceOpened};
                `}
              />
            </ButtonIcon>
          ) : (
            <IconSearch
              css={`
                color: ${theme.surfaceOpened};
              `}
            />
          )
        }
        adornmentPosition="end"
        placeholder="Search"
        onChange={onChange}
        value={value}
        wide
        css={`
          max-width: ${compact ? 'unset' : 30 * GU}px;
          ${textStyle('body2')};
          color: ${value.trim() ? theme.surfaceContent : theme.hint};
        `}
      />
    </div>
  )
})

Search.propTypes = {
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired,
}

export default Search
