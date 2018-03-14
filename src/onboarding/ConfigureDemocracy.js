import React from 'react'
import styled from 'styled-components'
import { Motion, spring } from 'react-motion'
import { spring as springConf } from '@aragon/ui'
import { Field, TextInput } from '@aragon/ui'
import { lerp } from '../math-utils'
import { noop } from '../utils'
import { isAddress } from 'web3-utils'

class ConfigureDemocracy extends React.PureComponent {
  static defaultProps = {
    onConfigureDone: noop,
    onChange: noop,
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
  isNextEnabled() {
    const {
      step,
      firstAddress,
      minQuorum,
      support,
      tokenName,
      tokenSymbol,
      voteDuration,
    } = this.state
    if (step === 1) {
      return support !== -1 && minQuorum !== -1 && voteDuration !== -1
    }
    if (step === 2) {
      return (
        isAddress(firstAddress) && tokenName.length !== '' && tokenSymbol !== ''
      )
    }
    return true
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
      holders: [{ address: firstAddress, balance: 1 }],
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
    this.props.onChange()
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
    this.props.onChange()
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
    this.props.onChange()
  }

  handleFirstAddressChange = event => {
    this.setState({ firstAddress: event.target.value })
    this.props.onChange()
  }
  handleTokenNameChange = event => {
    this.setState({ tokenName: event.target.value })
    this.props.onChange()
  }
  handleTokenSymbolChange = event => {
    this.setState({ tokenSymbol: event.target.value })
    this.props.onChange()
  }

  render() {
    const { step } = this.state
    return (
      <div>
        <Title>Democracy Project</Title>
        <Motion
          style={{
            step1Progress: spring(Number(step === 1), springConf('slow')),
            step2Progress: spring(Number(step === 2), springConf('slow')),
          }}
        >
          {({ step1Progress, step2Progress }) => (
            <div>
              <StepContainer
                style={{
                  opacity: step1Progress,
                  transform: `translateX(${lerp(step1Progress, -50, 0)}%)`,
                  pointerEvents: step === 1 ? 'inherit' : 'none',
                }}
              >
                {this.renderStep1()}
              </StepContainer>
              <StepContainer
                style={{
                  opacity: step2Progress,
                  transform: `translateX(${lerp(step2Progress, 50, 0)}%)`,
                  pointerEvents: step === 2 ? 'inherit' : 'none',
                }}
              >
                {this.renderStep2()}
              </StepContainer>
            </div>
          )}
        </Motion>
      </div>
    )
  }

  renderStep1() {
    const { support, minQuorum, voteDuration } = this.state
    return (
      <div>
        <p>
          Choose your configuration below. Hover on the info icons for help on
          what each input means.
        </p>
        <Fields>
          <Fields.PercentageField label="Support">
            <SymbolInput
              placeholder="e.g. 50"
              value={support === -1 ? '' : support}
              onChange={this.handleSupportChange}
              type="number"
            />
          </Fields.PercentageField>
          <Fields.PercentageField label="Min. Quorum">
            <SymbolInput
              placeholder="e.g. 15"
              value={minQuorum === -1 ? '' : minQuorum}
              onChange={this.handleMinQuorumChange}
              type="number"
            />
          </Fields.PercentageField>
          <Fields.HoursField label="Vote Duration">
            <SymbolInput
              placeholder="e.g. 24"
              onChange={this.handleVoteDurationChange}
              value={voteDuration === -1 ? '' : voteDuration}
              type="number"
            />
          </Fields.HoursField>
        </Fields>
      </div>
    )
  }

  renderStep2() {
    const { firstAddress, tokenName, tokenSymbol } = this.state
    return (
      <div>
        <p>
          Choose the address for the first token received, and the token name
          and symbol.
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
    )
  }
}

const Title = styled.h1`
  text-align: center;
  font-size: 37px;
  margin-bottom: 40px;
`

const StepContainer = styled.div`
  position: absolute;
  top: 0;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  width: 100%;
  height: 100%;
  padding-top: 140px;
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
  margin-top: 40px;
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
