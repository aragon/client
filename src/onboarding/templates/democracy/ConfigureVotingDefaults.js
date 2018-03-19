import React from 'react'
import styled from 'styled-components'
import { Field, TextInput, Text, theme } from '@aragon/ui'
import { lerp } from '../../../math-utils'
import { noop } from '../../../utils'

class ConfigureVotingDefaults extends React.Component {
  static defaultProps = {
    warm: false,
    positionProgress: 0,
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
  componentWillReceiveProps({ positionProgress }) {
    if (positionProgress === 0 && positionProgress !== this.props.positionProgress) {
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
    this.formEl.elements[0].blur()
    this.props.onSubmit()
  }
  handleFormRef = el => {
    this.formEl = el
  }
  render() {
    const { positionProgress, warm, fields } = this.props
    return (
      <Main
        style={{
          opacity: 1 - Math.abs(positionProgress),
          transform: `translateX(${lerp(positionProgress, 0, 50)}%)`,
          willChange: warm? 'opacity, transform' : 'auto',
        }}
      >
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
            <p style={{ textAlign: 'center' }}>
              <Text size="large" color={theme.textSecondary} align="center">
                Choose your voting settings below. You can’t change these later,
                so pick carefully.
              </Text>
            </p>
            <Fields>
              <Fields.PercentageField label="Support">
                <SymbolInput
                  placeholder="e.g. 50"
                  value={fields.support === -1 ? '' : fields.support}
                  onChange={handleSupportChange}
                />
              </Fields.PercentageField>
              <Fields.PercentageField label="Min. Quorum">
                <SymbolInput
                  placeholder="e.g. 15"
                  value={fields.minQuorum === -1 ? '' : fields.minQuorum}
                  onChange={handleMinQuorumChange}
                />
              </Fields.PercentageField>
              <Fields.HoursField label="Vote Duration">
                <SymbolInput
                  placeholder="e.g. 24"
                  onChange={handleVoteDurationChange}
                  value={fields.voteDuration === -1 ? '' : fields.voteDuration}
                />
              </Fields.HoursField>
            </Fields>
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

const Main = styled.div`
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
  margin-bottom: 100px;
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

export default ConfigureVotingDefaults
