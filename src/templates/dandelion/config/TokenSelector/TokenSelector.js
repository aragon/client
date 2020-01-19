import React from 'react'
import { DropDown, Field, TextInput, GU } from '@aragon/ui'

import { network } from '../../../../environment'
import { isAddress } from '../../../../web3-utils'
import TokenSelectorInstance from './TokenSelectorInstance'

const INITIAL_STATE = {
  customToken: {
    address: '',
    value: '',
  },
}
/* eslint-disable react/prop-types */
class TokenSelector extends React.Component {
  static defaultProps = {
    onChange: () => {},
    tokens: [],
    label: 'Token',
    labelCustomToken: 'Token address or symbol',
    selectedIndex: -1,
  }
  state = {
    ...INITIAL_STATE,
  }
  handleChange = index => {
    this.setState({ ...INITIAL_STATE }, () => {
      const address = this.getAddressFromTokens(index)
      this.props.onChange({
        address,
        index,
        value: address,
      })
    })
  }
  handleCustomTokenChange = event => {
    const { value } = event.target

    // Use the verified token address if provided a symbol and it matches
    // The symbols in the verified map are all capitalized
    const resolvedAddress =
      !isAddress(value) && network && network.type === 'main'
        ? this.props.tokens.get(value.toUpperCase()) || ''
        : value

    this.setState(
      {
        customToken: {
          value,
          address: resolvedAddress,
        },
      },
      () => {
        this.props.onChange({
          value,
          index: 0,
          address: resolvedAddress,
        })
      }
    )
  }
  getAddressFromTokens(index) {
    if (index === 0) {
      return this.state.customToken.address
    }

    // Adjust for custom address
    const token = this.props.tokens[index - 1]
    return token.address
  }
  getItems() {
    return ['Other…', ...this.getTokenItems()]
  }
  getTokenItems() {
    return this.props.tokens.map(({ address, name, symbol, verified }) => (
      <TokenSelectorInstance
        address={address}
        name={name}
        showIcon={verified}
        symbol={symbol}
      />
    ))
  }
  render() {
    const { customToken } = this.state
    const { selectedIndex } = this.props
    const items = this.getItems()
    const showCustomToken = selectedIndex === 0
    return (
      <React.Fragment>
        <DropDown
          header="Token"
          placeholder="Select a token"
          items={items}
          selected={selectedIndex}
          onChange={this.handleChange}
          required
          wide
          css={`
            margin-bottom: ${1.5 * GU}px;
          `}
        />

        {showCustomToken && (
          <Field
            label={'Select custom token'}
            css={`
              margin: 0;
            `}
          >
            <TextInput
              placeholder="SYM…"
              value={customToken.value}
              onChange={this.handleCustomTokenChange}
              required
              wide
            />
          </Field>
        )}
      </React.Fragment>
    )
  }
}

export default TokenSelector
