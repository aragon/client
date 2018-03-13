import React from 'react'
import styled from 'styled-components'
import { Field, TextInput } from '@aragon/ui'
import { noop } from '../utils'

class ConfigureDemocracy extends React.Component {
  static defaultProps = {
    onConfigureDone: noop,
  }
  state = {
    step: 1,
    support: -1,
    minQuorum: -1,
    voteDuration: -1,
    firstAddress: '',
    tokenName: '',
    tokenSymbol: '',
  }
  reset = () => {
    this.setState({ step: 1 })
  }
  nextStep = () => {
    const newStep = this.state.step + 1
    if (newStep > 2) {
      this.props.onConfigureDone(this.getData())
      return
    }
    this.setState({ step: newStep })
  }

  getData = () => {
    const {
      firstAddress,
      minQuorum,
      support,
      tokenName,
      tokenSymbol,
      voteDuration,
    } = this.state

    return {
      holders: [firstAddress],
      minAcceptanceQuorum: minQuorum / 100,
      supportNeeded: support / 100,
      tokenName,
      tokenSymbol,
      voteDuration: voteDuration * 60 * 60,
    }
  }

  handleSupportChange = event => {
    if (event.target.value === '') {
      this.setState({ support: -1 })
      return
    }

    const value = parseInt(event.target.value, 10)
    if (isNaN(value)) {
      return
    }
    this.setState({ support: Math.min(100, Math.max(0, value)) })
  }

  handleMinQuorumChange = event => {
    if (event.target.value === '') {
      this.setState({ minQuorum: -1 })
      return
    }

    const value = parseInt(event.target.value, 10)
    if (isNaN(value)) {
      return
    }
    this.setState({ minQuorum: Math.min(100, Math.max(0, value)) })
  }

  handleVoteDurationChange = event => {
    if (event.target.value === '') {
      this.setState({ voteDuration: -1 })
      return
    }

    const value = parseInt(event.target.value, 10)
    if (isNaN(value)) {
      return
    }
    this.setState({ voteDuration: Math.max(0, value) })
  }

  handleFirstAddressChange = event => {
    this.setState({ firstAddress: event.target.value })
  }
  handleTokenNameChange = event => {
    this.setState({ tokenName: event.target.value })
  }
  handleTokenSymbolChange = event => {
    this.setState({ tokenSymbol: event.target.value })
  }

  render() {
    const {
      step,
      support,
      minQuorum,
      voteDuration,
      firstAddress,
      tokenName,
      tokenSymbol,
    } = this.state
    return (
      <div>
        <Title>Democracy Project</Title>
        {step === 1 && (
          <div>
            <p>
              Choose your configuration below. Hover on the info icons for help
              on what each input means.
            </p>
            <Fields>
              <Fields.PercentageField label="Support">
                <SymbolInput
                  placeholder="e.g. 50"
                  value={support === -1 ? '' : support}
                  onChange={this.handleSupportChange}
                />
              </Fields.PercentageField>
              <Fields.PercentageField label="Min. Quorum">
                <SymbolInput
                  placeholder="e.g. 15"
                  value={minQuorum === -1 ? '' : minQuorum}
                  onChange={this.handleMinQuorumChange}
                />
              </Fields.PercentageField>
              <Fields.HoursField label="Vote Duration">
                <SymbolInput
                  placeholder="e.g. 24"
                  onChange={this.handleVoteDurationChange}
                  value={voteDuration === -1 ? '' : voteDuration}
                />
              </Fields.HoursField>
            </Fields>
          </div>
        )}
        {step === 2 && (
          <div>
            <p>
              Choose the address for the first token received, and the token
              name and symbol.
            </p>
            <Fields>
              <Rows>
                <Row>
                  <Fields.Field label="First Token Address">
                    <InputSized
                      width={380}
                      value={firstAddress}
                      onChange={this.handleFirstAddressChange}
                    />
                  </Fields.Field>
                </Row>
                <Row>
                  <Fields.Field label="Token Name">
                    <InputSized
                      width={200}
                      value={tokenName}
                      onChange={this.handleTokenNameChange}
                    />
                  </Fields.Field>
                  <Fields.Field label="Token Symbol">
                    <InputSized
                      width={80}
                      value={tokenSymbol}
                      onChange={this.handleTokenSymbolChange}
                    />
                  </Fields.Field>
                </Row>
              </Rows>
            </Fields>
          </div>
        )}
      </div>
    )
  }
}

const Title = styled.h1`
  text-align: center;
  font-size: 37px;
  margin-bottom: 40px;
`

const InputSized = styled(TextInput)`
  width: ${({ width }) => width}px;
`

const SymbolInput = styled(TextInput)`
  text-align: right;
  width: 120px;
  padding-right: 25px;
`

const Rows = styled.div`
  display: flex;
  flex-direction: column;
`

const Row = styled.div`
  display: flex;
`

const Fields = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 100px;
`
Fields.Field = styled(Field)`
  position: relative;
  & + & {
    margin-left: 55px;
  }
  &:after {
    position: absolute;
    bottom: 6px;
    left: 100px;
    font-size: 14px;
  }
`
Fields.PercentageField = styled(Fields.Field)`
  &:after {
    content: '%';
  }
`
Fields.HoursField = styled(Fields.Field)`
  &:after {
    content: 'H';
  }
`

export default ConfigureDemocracy
