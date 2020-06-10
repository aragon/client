import React, { useCallback, useMemo, useState } from 'react'
import { DropDown, Field, TextInput, GU } from '@aragon/ui'

import TokenSelectorInstance from './TokenSelectorInstance'

/* eslint-disable react/prop-types */
function TokenSelector({
  componentIndex,
  onChange,
  selectedIndex,
  showCustomMode,
  tokens,
  value,
}) {
  const [customToken, setCustomToken] = useState({
    address: selectedIndex === 0 ? value : '',
  })

  const showCustomToken = selectedIndex === 0
  const showCustomHorizontal = showCustomMode === 'horizontal'
  const dropdownWidth = showCustomToken && showCustomHorizontal ? '30%' : '100%'

  const getTokenByIndex = useCallback(
    index => {
      if (index === 0) {
        return customToken
      }

      // Adjust for custom address
      return tokens[index - 1]
    },
    [customToken, tokens]
  )

  const handleChange = useCallback(
    index => {
      const token = getTokenByIndex(index)
      onChange({
        token,
        selectedIndex: index,
        componentIndex,
      })
    },
    [componentIndex, getTokenByIndex, onChange]
  )

  const handleCustomTokenChange = useCallback(
    event => {
      const { value } = event.target

      setCustomToken(value)
      onChange({
        token: { address: value },
        selectedIndex: 0,
        componentIndex,
      })
    },
    [componentIndex, onChange]
  )

  const items = useMemo(
    () => [
      'Other',
      ...tokens.map(({ address, name, symbol, verified }) => (
        <TokenSelectorInstance
          address={address}
          name={name}
          showIcon={verified}
          symbol={symbol}
        />
      )),
    ],
    [tokens]
  )

  return (
    <div
      css={`
        display: ${showCustomHorizontal ? 'flex' : 'block'};
        align-items: flex-end;
        width 100%;
      `}
    >
      <DropDown
        header="Token"
        placeholder="Select a token"
        items={items}
        selected={selectedIndex}
        onChange={handleChange}
        width={dropdownWidth}
        required
        css={`
          margin-bottom: ${showCustomHorizontal ? '0' : `${1.5 * GU}px`};
          margin-right: ${showCustomToken || componentIndex !== 0
            ? `${1 * GU}px`
            : '0'};
          min-width: 150px;
        `}
      />

      {showCustomToken && (
        <Field
          label={'Select custom token'}
          css={`
            margin: 0;
            width: 100%;
            margin-right: ${componentIndex !== 0 ? `${1 * GU}px` : '0'};
          `}
        >
          <TextInput
            placeholder="SYM…"
            value={customToken.address}
            onChange={handleCustomTokenChange}
            required
            wide
          />
        </Field>
      )}
    </div>
  )
}

TokenSelector.defaultProps = {
  onChange: () => {},
  tokens: [],
  label: 'Token',
  labelCustomToken: 'Token address or symbol',
  selectedIndex: -1,
  showCustomMode: 'vertical',
}

export default TokenSelector
