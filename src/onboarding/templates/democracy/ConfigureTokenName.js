import React from 'react'
import styled from 'styled-components'
import { Field, TextInput } from '@aragon/ui'
import { lerp } from '../../../math-utils'
import { noop } from '../../../utils'

class ConfigureDemocracy extends React.PureComponent {
  static defaultProps = {
    onConfigureDone: noop,
    onChange: noop,
  }
  constructor(props) {
    super(props)
    this.handleTokenNameChange = this.createChangeHandler('tokenName')
    this.handleTokenSymbolChange = this.createChangeHandler('tokenSymbol')
  }
  createChangeHandler(name) {
    return event => {
      const { onFieldUpdate, screen } = this.props
      onFieldUpdate(screen, name, event.target.value)
    }
  }
  render() {
    const { hideProgress, fields } = this.props
    return (
      <Main
        style={{
          opacity: 1 - Math.abs(hideProgress),
          willChange: 'transform',
          transform: `translateX(${lerp(hideProgress, 0, 50)}%)`,
        }}
      >
        <Content>
          <Title>Democracy Project</Title>
          <StepContainer>
            <div>
              <p>
                Choose the address for the first token received, and the token
                name and symbol.
              </p>
              <Fields>
                <Rows>
                  <Row>
                    <Fields.Field label="Token Name">
                      <InputSized
                        width={200}
                        value={fields.tokenName}
                        onChange={this.handleTokenNameChange}
                      />
                    </Fields.Field>
                    <Fields.Field label="Token Symbol">
                      <InputSized
                        width={80}
                        value={fields.tokenSymbol}
                        onChange={this.handleTokenSymbolChange}
                      />
                    </Fields.Field>
                  </Row>
                </Rows>
              </Fields>
            </div>
          </StepContainer>
        </Content>
      </Main>
    )
  }
}

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

export default ConfigureDemocracy
