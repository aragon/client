import React, { useCallback, useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import {
  Button,
  GU,
  IconCross,
  IconSearch,
  SearchInput,
  useTheme,
  useLayout,
  textStyle,
} from '@aragon/ui'

const SEARCH_CLOSED = Symbol('closed')
const SEARCH_OPEN = Symbol('open')
const EMPTY = ''

function getDefaultSearchState(compact) {
  return compact ? SEARCH_CLOSED : SEARCH_OPEN
}

const Search = React.memo(function Search({ onChange, value }) {
  const { layoutName } = useLayout()
  const compact = layoutName === 'small'
  const theme = useTheme()

  const [mode, setMode] = useState(getDefaultSearchState(compact))
  const open = useCallback(() => setMode(SEARCH_OPEN), [setMode])

  const searchInputRef = useRef()

  const clear = useCallback(() => {
    setMode(getDefaultSearchState(compact))
    onChange(EMPTY)
  }, [onChange, compact])

  useEffect(() => {
    setMode(getDefaultSearchState(compact))
  }, [compact])

  useEffect(() => {
    if (mode === SEARCH_OPEN && searchInputRef.current) {
      searchInputRef.current.focus()
    }
  }, [mode])

  if (mode === SEARCH_CLOSED) {
    return (
      <Button
        display="icon"
        icon={<IconSearch />}
        label="Search"
        onClick={open}
      />
    )
  }

  const searchInputExtraProps = compact
    ? {
        adornment: (
          <Button
            display="icon"
            icon={<IconCross />}
            label="Clear search input"
            onClick={clear}
          />
        ),
        wide: true,
      }
    : {}

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
      <SearchInput
        ref={searchInputRef}
        onChange={onChange}
        placeholder="Search"
        value={value}
        {...searchInputExtraProps}
        css={`
          ${compact ? '' : `width: ${30 * GU}px`};
          ${textStyle('body2')};
          color: ${value ? theme.surfaceContent : theme.hint};
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
