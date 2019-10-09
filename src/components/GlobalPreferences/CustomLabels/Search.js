import React, { useMemo, useEffect, useState, useCallback } from 'react'
import PropTypes from 'prop-types'
import {
  Button,
  ButtonIcon,
  GU,
  IconCross,
  IconSearch,
  TextInput,
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
  const clear = useCallback(() => {
    setMode(getDefaultSearchState(compact))
    onChange(EMPTY)
  }, [onChange, compact])
  const handleChange = useCallback(
    ({ currentTarget: { value } }) => {
      onChange(value)
    },
    [onChange]
  )

  useEffect(() => {
    setMode(getDefaultSearchState(compact))
  }, [compact])

  const searchStyles = useMemo(
    () =>
      `
        ${textStyle('body2')};
        color: ${value.trim() ? theme.surfaceContent : theme.hint};
      `,
    [value, theme]
  )

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
      {compact ? (
        <TextInput
          adornment={
            <ButtonIcon label="Clear search" onClick={clear}>
              <IconCross
                css={`
                  color: ${theme.surfaceOpened};
                `}
              />
            </ButtonIcon>
          }
          adornmentPosition="end"
          placeholder="Search"
          onChange={handleChange}
          value={value}
          wide
          css={`
            max-width: unset;
            ${searchStyles};
          `}
        />
      ) : (
        <SearchInput
          onChange={onChange}
          value={value}
          placeholder="Search"
          css={`
            width: ${30 * GU}px;
            ${searchStyles};
          `}
        />
      )}
    </div>
  )
})

Search.propTypes = {
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired,
}

export default Search
