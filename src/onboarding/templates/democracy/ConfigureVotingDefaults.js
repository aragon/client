import React from 'react'
import styled from 'styled-components'
import { Field, TextInput, Text, theme } from '@aragon/ui'
import { animated } from 'react-spring'
import { noop } from '../../../utils'

class ConfigureVotingDefaults extends React.Component {
  static defaultProps = {
    onFieldUpdate: noop,
    onSubmit: noop,
    fields: {},
  }
  constructor(props) {
    super(props)
    this.handleSupportChange = this.createChangeHandler('support')
    this.handleMinQuorumChange = this.createChangeHandler('minQuorum')
    this.handleVoteDurationChange = this.createChangeHandler('voteDuration')
  }
  componentWillReceiveProps({ forceFocus }) {
    if (forceFocus && forceFocus !== this.props.forceFocus) {
      this.formEl.elements[0].focus()
    }
  }
  createChangeHandler(name) {
    return event => {
      const { onFieldUpdate, screen } = this.props
      onFieldUpdate(screen, name, event.target.value)
    }
  }
  handleSubmit = event => {
    event.preventDefault()
    this.props.onSubmit()
  }
  handleFormRef = el => {
    this.formEl = el
  }
  render() {
    const { fields, screenTransitionStyles } = this.props
    return (
      <Main style={screenTransitionStyles}>
        <ConfigureVotingDefaultsContent
          fields={fields}
          handleSupportChange={this.handleSupportChange}
          handleMinQuorumChange={this.handleMinQuorumChange}
          handleVoteDurationChange={this.handleVoteDurationChange}
          onSubmit={this.handleSubmit}
          formRef={this.handleFormRef}
        />
      </Main>
    )
  }
}

class ConfigureVotingDefaultsContent extends React.PureComponent {
  render() {
    const {
      fields,
      handleSupportChange,
      handleMinQuorumChange,
      handleVoteDurationChange,
      onSubmit,
      formRef,
    } = this.props
    return (
      <Content>
        <Title>Democracy Project</Title>
        <StepContainer>
          <SubmitForm onSubmit={onSubmit} innerRef={formRef}>
            <TextContainer>
              <Text size="large" color={theme.textSecondary} align="center">
                Choose your voting settings below. You can’t change these later
                so pick carefully.
              </Text>
            </TextContainer>
            <PercentageField label="Support">
              <SymbolInput
                placeholder="e.g. 50"
                value={fields.support === -1 ? '' : fields.support}
                onChange={handleSupportChange}
              />
            </PercentageField>
            <Text size="small" color={theme.textSecondary} align="left">
              Percentage of "Yes" votes required to approve a vote
            </Text>
            <PercentageField label="Min. Quorum">
              <SymbolInput
                placeholder="e.g. 15"
                value={fields.minQuorum === -1 ? '' : fields.minQuorum}
                onChange={handleMinQuorumChange}
              />
            </PercentageField>
            <Text size="small" color={theme.textSecondary} align="left">
              Percentage of all tokens that must vote "yes" for the vote to be
              valid.
            </Text>
            <HoursField label="Vote Duration">
              <SymbolInput
                placeholder="e.g. 24"
                onChange={handleVoteDurationChange}
                value={fields.voteDuration === -1 ? '' : fields.voteDuration}
              />
            </HoursField>
            <Text size="small" color={theme.textSecondary} align="left">
              Duration each vote is active for
            </Text>
          </SubmitForm>
        </StepContainer>
      </Content>
    )
  }
}

const SubmitForm = ({ children, innerRef = noop, ...props }) => (
  <form {...props} ref={innerRef}>
    {children}
    <input type="submit" style={{ display: 'none' }} />
  </form>
)

const Main = styled(animated.div)`
  display: flex;
  align-items: flex-start;
  justify-content: center;
  width: 100%;
  height: 100%;
  padding: 100px;
  padding-top: 140px;
`

const Content = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`

const Title = styled.h1`
  text-align: center;
  font-size: 37px;
  margin-bottom: 40px;
`

const TextContainer = styled.p`
  text-align: center;
  max-width: 700px;
`

const StepContainer = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: center;
  width: 100%;
  height: 100%;
`

const SymbolInput = styled(TextInput)`
  text-align: right;
  width: 120px;
  padding-right: 25px;
`

const BaseField = styled(Field)`
  position: relative;
  margin: 1em 0 0.25em 0;

  &:after {
    position: absolute;
    bottom: 6px;
    left: 100px;
    font-size: 14px;
  }
`
const PercentageField = styled(BaseField)`
  &:after {
    content: '%';
  }
`
const HoursField = styled(BaseField)`
  &:after {
    content: 'H';
  }
`

export default ConfigureVotingDefaults
