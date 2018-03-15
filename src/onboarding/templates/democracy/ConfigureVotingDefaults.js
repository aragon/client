import React from 'react'
import styled from 'styled-components'
import { Field, TextInput } from '@aragon/ui'
import { lerp } from '../../../math-utils'
import { noop } from '../../../utils'

class ConfigureDemocracy extends React.PureComponent {
  static defaultProps = {
    onFieldUpdate: noop,
    onConfigureDone: noop,
    onChange: noop,
    onUpdateValue: noop,
    fields: {},
  }
  constructor(props) {
    super(props)
    this.handleSupportChange = this.createChangeHandler('support')
    this.handleMinQuorumChange = this.createChangeHandler('minQuorum')
    this.handleVoteDurationChange = this.createChangeHandler('voteDuration')
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
                Choose your configuration below. Hover on the info icons for
                help on what each input means.
              </p>
              <Fields>
                <Fields.PercentageField label="Support">
                  <SymbolInput
                    placeholder="e.g. 50"
                    value={fields.support === -1 ? '' : fields.support}
                    onChange={this.handleSupportChange}
                  />
                </Fields.PercentageField>
                <Fields.PercentageField label="Min. Quorum">
                  <SymbolInput
                    placeholder="e.g. 15"
                    value={fields.minQuorum === -1 ? '' : fields.minQuorum}
                    onChange={this.handleMinQuorumChange}
                  />
                </Fields.PercentageField>
                <Fields.HoursField label="Vote Duration">
                  <SymbolInput
                    placeholder="e.g. 24"
                    onChange={this.handleVoteDurationChange}
                    value={
                      fields.voteDuration === -1 ? '' : fields.voteDuration
                    }
                  />
                </Fields.HoursField>
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

export default ConfigureDemocracy
