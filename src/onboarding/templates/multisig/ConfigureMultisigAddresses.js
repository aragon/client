import React from 'react'
import styled, { css } from 'styled-components'
import { Button, TextInput, Text, DropDown, theme } from '@aragon/ui'
import { animated } from 'react-spring'
import { noop } from '../../../utils'

class ConfigureMultisigAddresses extends React.Component {
  static defaultProps = {
    onFieldUpdate: noop,
    onSubmit: noop,
    fields: {},
  }
  componentWillReceiveProps({ forceFocus }) {
    if (forceFocus && forceFocus !== this.props.forceFocus) {
      this.formEl.elements[0].focus()
    }
  }
  updateField(name, value) {
    this.props.onFieldUpdate(this.props.screen, name, value)
  }
  handleAddSigner = () => {
    const { addresses } = this.props.fields.signers
    this.updateField('signers', {
      addresses: addresses.concat(['']),
    })
  }
  handleRemoveSigner = () => {
    const { addresses } = this.props.fields.signers
    this.updateField('signers', {
      addresses: addresses.slice(0, -1),
    })
  }
  handleSignerChange = (index, newValue) => {
    const { addresses } = this.props.fields.signers
    this.updateField('signers', {
      addresses: addresses.map((signer, i) =>
        i === index ? newValue : signer
      ),
    })
  }
  handleNeededSignaturesChange = index => {
    this.updateField('neededSignatures', index + 1)
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
    const neededSignaturesItems = fields.signers.addresses.map((signer, i) =>
      String(i + 1)
    )
    return (
      <Content>
        <Title>Token project with multisig</Title>
        <StepContainer>
          <SubmitForm onSubmit={onSubmit} ref={formRef}>
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
                    {fields.signers.addresses.map((signer, i) => (
                      <InputRow key={i}>
                        <SignerInput
                          index={i}
                          value={signer}
                          onChange={onSignerChange}
                          error={fields.signers.errors.find(
                            error => error.index === i
                          )}
                        />
                      </InputRow>
                    ))}
                  </div>
                </InputsView>

                <Button mode="secondary" compact onClick={onAddSigner}>
                  + Add signer
                </Button>
                {fields.signers.addresses.length > 1 && (
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
    const { value, error } = this.props
    return (
      <React.Fragment>
        <StyledTextInput
          error={Boolean(error)}
          onChange={this.handleChange}
          value={value}
          wide
        />
        {error && <InputError>{error.message}</InputError>}
      </React.Fragment>
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
  height: 55px;
`

const InputsView = styled.div`
  overflow-y: auto;
  width: 410px;
  max-height: 160px;
  margin-top: -10px;
  margin-bottom: 10px;
  padding: 10px 30px 10px 0;
`

const StyledTextInput = styled(TextInput)`
  ${p =>
    p.error
      ? css`
          border-color: ${theme.negative};
          &:focus {
            border-color: ${theme.negative};
          }
        `
      : ''};
`

const InputError = styled(Text.Paragraph).attrs({
  size: 'xsmall',
  color: theme.negative,
})`
  margin-top: 2px;
`

export default ConfigureMultisigAddresses
