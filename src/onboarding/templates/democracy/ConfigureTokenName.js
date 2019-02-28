/* eslint react/prop-types: 0 */
import React from 'react'
import styled from 'styled-components'
import { Field, TextInput, Text, theme } from '@aragon/ui'
import { animated } from 'react-spring'
import { noop } from '../../../utils'

class ConfigureTokenName extends React.Component {
  static defaultProps = {
    onFieldUpdate: noop,
    onSubmit: noop,
    fields: {},
  }
  constructor(props) {
    super(props)
    this.handleTokenNameChange = this.createChangeHandler('tokenName')
    this.handleTokenSymbolChange = this.createChangeHandler('tokenSymbol')
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
        <Title>Democracy Project</Title>
        <StepContainer>
          <SubmitForm onSubmit={onSubmit} ref={formRef}>
            <p style={{ textAlign: 'center' }}>
              <Text size="large" color={theme.textSecondary}>
                Choose the token name and symbol. You can’t change these later,
                so pick carefully.
              </Text>
            </p>
            <Fields>
              <Rows>
                <Row>
                  <SuffixField label="Token Name">
                    <InputSized
                      width={200}
                      value={fields.tokenName}
                      onChange={handleTokenNameChange}
                      placeholder="My Organization Token"
                    />
                  </SuffixField>
                  <SuffixField label="Token Symbol">
                    <InputSized
                      width={80}
                      value={fields.tokenSymbol}
                      onChange={handleTokenSymbolChange}
                      placeholder="MOT"
                    />
                  </SuffixField>
                </Row>
              </Rows>
            </Fields>
          </SubmitForm>
        </StepContainer>
      </Content>
    )
  }
}

const SubmitForm = React.forwardRef(({ children, ...props }, ref) => (
  <form {...props} ref={ref}>
    {children}
    <input type="submit" style={{ display: 'none' }} />
  </form>
))

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
const SuffixField = styled(Field)`
  position: relative;
  & + & {
    margin-left: 55px;
  }
  :after {
    position: absolute;
    bottom: 6px;
    left: 100px;
    font-size: 14px;
    content: "${p => p.suffix || ''}";
    display: ${p => (p.suffix ? 'block' : 'none')};
  }
`

export default ConfigureTokenName
