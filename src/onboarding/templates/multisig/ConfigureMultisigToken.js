import React from 'react'
import styled from 'styled-components'
import { Field, TextInput, Text, theme } from '@aragon/ui'
import { lerp } from '../../../math-utils'
import { noop } from '../../../utils'

class ConfigureTokenName extends React.Component {
  static defaultProps = {
    warm: false,
    positionProgress: 0,
    onFieldUpdate: noop,
    onSubmit: noop,
    fields: {},
  }
  constructor(props) {
    super(props)
    this.handleTokenNameChange = this.createChangeHandler('tokenName')
    this.handleTokenSymbolChange = this.createChangeHandler('tokenSymbol')
  }
  componentWillReceiveProps({ positionProgress }) {
    if (
      positionProgress === 0 &&
      positionProgress !== this.props.positionProgress
    ) {
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
        }}
      >
        <ConfigureTokenNameContent
          fields={fields}
          handleTokenNameChange={this.handleTokenNameChange}
          handleTokenSymbolChange={this.handleTokenSymbolChange}
          onSubmit={this.handleSubmit}
          formRef={this.handleFormRef}
        />
      </Main>
    )
  }
}

class ConfigureTokenNameContent extends React.PureComponent {
  render() {
    const {
      fields,
      handleTokenNameChange,
      handleTokenSymbolChange,
      onSubmit,
      formRef,
    } = this.props
    return (
      <Content>
        <Title>Token project with multisig</Title>
        <StepContainer>
          <SubmitForm onSubmit={onSubmit} innerRef={formRef}>
            <p style={{ textAlign: 'center' }}>
              <Text size="large" color={theme.textSecondary}>
                Choose the token name and symbol. You can’t change these later,
                so pick carefully.
              </Text>
            </p>
            <Fields>
              <Rows>
                <Row>
                  <Fields.Field label="Token Name">
                    <InputSized
                      width={200}
                      value={fields.tokenName}
                      onChange={handleTokenNameChange}
                      placeholder="My Organization Token"
                    />
                  </Fields.Field>
                  <Fields.Field label="Token Symbol">
                    <InputSized
                      width={80}
                      value={fields.tokenSymbol}
                      onChange={handleTokenSymbolChange}
                      placeholder="MOT"
                    />
                  </Fields.Field>
                </Row>
              </Rows>
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

const InputSized = styled(TextInput)`
  width: ${({ width }) => width}px;
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

export default ConfigureTokenName
