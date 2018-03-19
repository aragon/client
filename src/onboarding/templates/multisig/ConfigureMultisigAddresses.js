import React from 'react'
import styled from 'styled-components'
import { Field, Button, TextInput, Text, DropDown, theme } from '@aragon/ui'
import { lerp } from '../../../math-utils'
import { noop } from '../../../utils'

class ConfigureMultisigAddresses extends React.Component {
  static defaultProps = {
    warm: false,
    positionProgress: 0,
    onFieldUpdate: noop,
    onSubmit: noop,
    fields: {},
  }
  componentWillReceiveProps({ positionProgress }) {
    if (
      positionProgress === 0 &&
      positionProgress !== this.props.positionProgress
    ) {
      this.formEl.elements[0].focus()
    }
  }
  updateField(name, value) {
    this.props.onFieldUpdate(this.props.screen, name, value)
  }
  handleAddSigner = () => {
    const { fields } = this.props
    this.updateField('signers', fields.signers.concat(['']))
  }
  handleRemoveSigner = () => {
    const { fields } = this.props
    this.updateField('signers', fields.signers.slice(0, -1))
  }
  handleSignerChange = (index, newValue) => {
    const { fields } = this.props
    this.updateField(
      'signers',
      fields.signers.map((signer, i) => (i === index ? newValue : signer))
    )
  }
  handleNeededSignaturesChange = index => {
    this.updateField('neededSignatures', index + 1)
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
          willChange: warm ? 'opacity, transform' : 'auto',
        }}
      >
        <ConfigureMultisigAddressesContent
          fields={fields}
          onSubmit={this.handleSubmit}
          formRef={this.handleFormRef}
          onNeededSignaturesChange={this.handleNeededSignaturesChange}
          onAddSigner={this.handleAddSigner}
          onRemoveSigner={this.handleRemoveSigner}
          onSignerChange={this.handleSignerChange}
        />
      </Main>
    )
  }
}

class ConfigureMultisigAddressesContent extends React.PureComponent {
  render() {
    const {
      fields,
      onSubmit,
      formRef,
      onAddSigner,
      onRemoveSigner,
      onSignerChange,
      onNeededSignaturesChange,
    } = this.props
    const neededSignaturesItems = fields.signers.map((signer, i) => i + 1)
    return (
      <Content>
        <Title>Token project with multisig</Title>
        <StepContainer>
          <SubmitForm onSubmit={onSubmit} innerRef={formRef}>
            <Intro>
              <Text size="large" color={theme.textSecondary} align="center">
                Add the wallet addresses of the multisig signers, and choose the
                number of signatures needed for signing a transaction
              </Text>
            </Intro>
            <FieldGroups>
              <div>
                <GroupTitle>
                  <Text color={theme.textSecondary} weight="bold" smallcaps>
                    Multisig signer
                  </Text>
                </GroupTitle>

                <InputsView>
                  <div>
                    {fields.signers.map((signer, i) => (
                      <InputRow key={i}>
                        <SignerInput
                          index={i}
                          value={signer}
                          onChange={onSignerChange}
                        />
                      </InputRow>
                    ))}
                  </div>
                </InputsView>

                <Button mode="secondary" compact onClick={onAddSigner}>
                  + Add signer
                </Button>
                {fields.signers.length > 1 && (
                  <Button
                    mode="text"
                    emphasis="negative"
                    onClick={onRemoveSigner}
                    style={{ marginLeft: '10px' }}
                    compact
                  >
                    Remove last
                  </Button>
                )}
              </div>
              <div>
                <GroupTitle>
                  <Text color={theme.textSecondary} weight="bold" smallcaps>
                    Signatures required
                  </Text>
                </GroupTitle>
                <DropDown
                  items={neededSignaturesItems}
                  active={fields.neededSignatures - 1}
                  onChange={onNeededSignaturesChange}
                  wide
                />
              </div>
            </FieldGroups>
          </SubmitForm>
        </StepContainer>
      </Content>
    )
  }
}

class SignerInput extends React.PureComponent {
  handleChange = event => {
    this.props.onChange(this.props.index, event.target.value)
  }
  render() {
    const { value } = this.props
    return <TextInput onChange={this.handleChange} value={value} wide />
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
  margin-bottom: 25px;
`

const StepContainer = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: center;
  width: 100%;
  height: 100%;
`

const Intro = styled.p`
  margin-bottom: 40px;
  text-align: center;
`

const FieldGroups = styled.div`
  display: flex;
  justify-content: center;
  > div:first-child {
    margin-right: 50px;
  }
`

const GroupTitle = styled.h2`
  margin-bottom: 10px;
`

const InputRow = styled.div`
  margin-top: 25px;
  &:first-child {
    margin-top: 0;
  }
`

const InputsView = styled.div`
  overflow-y: auto;
  width: 410px;
  max-height: 160px;
  margin-top: -10px;
  margin-bottom: 10px;
  padding: 10px 30px 10px 0;
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

export default ConfigureMultisigAddresses
