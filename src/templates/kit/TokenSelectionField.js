import React from 'react'
import PropTypes from 'prop-types'
import { DropDown, Field } from '@aragon/ui'

const TokenSelectionField = ({ onChange, selected, tokens }) => {
  const tokenNames = tokens.map(t => `${t.tokenName} (${t.tokenSymbol})`)
  return (
    <Field label="Governance token">
      <DropDown
        placeholder="Select which token will become voting power"
        items={tokenNames}
        selected={selected}
        onChange={onChange}
        wide
      />
    </Field>
  )
}

TokenSelectionField.defaultProps = {
  selected: -1,
}

TokenSelectionField.propTypes = {
  onChange: PropTypes.func.isRequired,
  selected: PropTypes.number,
  tokens: PropTypes.arrayOf(
    PropTypes.shape({
      fixedStake: PropTypes.bool,
      tokenName: PropTypes.string.isRequired,
      tokenSymbol: PropTypes.string.isRequired,
      transferable: PropTypes.bool,
      members: PropTypes.array.isRequired,
    }).isRequired
  ),
}

export default TokenSelectionField
