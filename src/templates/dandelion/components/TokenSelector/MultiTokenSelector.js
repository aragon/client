import React, { useCallback } from 'react'
import PropTypes from 'prop-types'

import { Button, IconPlus, IconTrash, GU, useTheme } from '@aragon/ui'
import TokenSelector from './TokenSelector'

function MultiTokenSelector({
  onAddToken,
  onRemoveToken,
  onUpdateToken,
  tokens,
  items,
}) {
  const theme = useTheme()

  return (
    <div>
      <div>
        {tokens.map(({ token, selectedIndex }, index) => (
          <TokenSelectorItem
            key={index}
            index={index}
            selectedIndex={selectedIndex}
            token={token}
            onUpdateToken={onUpdateToken}
            onRemoveToken={onRemoveToken}
            items={items}
          />
        ))}
      </div>
      <Button
        icon={
          <IconPlus
            css={`
              color: ${theme.accent};
            `}
          />
        }
        label="Add more"
        onClick={onAddToken}
      />
    </div>
  )
}

const TokenSelectorItem = ({
  index,
  selectedIndex,
  token,
  onUpdateToken,
  onRemoveToken,
  items,
}) => {
  const theme = useTheme()

  const handleRemove = useCallback(() => {
    onRemoveToken(index)
  }, [index, onRemoveToken])

  return (
    <div
      css={`
        display: flex;
        align-items: ${selectedIndex === 0 ? 'baseline' : 'center'};
        margin-bottom: ${1.5 * GU}px;
        width: 100%;
      `}
    >
      <TokenSelector
        componentIndex={index}
        selectedIndex={selectedIndex}
        onChange={onUpdateToken}
        tokens={items}
        value={token.address}
        showCustomMode="horizontal"
      />
      {index !== 0 && (
        <Button
          display="icon"
          icon={
            <IconTrash
              css={`
                color: ${theme.negative};
              `}
            />
          }
          label="Remove"
          onClick={handleRemove}
          size="mini"
        />
      )}
    </div>
  )
}

TokenSelectorItem.propTypes = {
  index: PropTypes.number.isRequired,
  selectedIndex: PropTypes.number.isRequired,
  token: PropTypes.object.isRequired,
  onUpdateToken: PropTypes.func,
  onRemoveToken: PropTypes.func,
  items: PropTypes.array,
}

MultiTokenSelector.propTypes = {
  onAddToken: PropTypes.func.isRequired,
  onRemoveToken: PropTypes.func,
  onUpdateToken: PropTypes.func.isRequired,
  tokens: PropTypes.array.isRequired,
  items: PropTypes.array.isRequired,
}

export default MultiTokenSelector
