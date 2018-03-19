import React from 'react'
import styled from 'styled-components'
import { theme, Text, TextInput, IconCheck, IconCross } from '@aragon/ui'
import { lerp } from '../math-utils'
import { noop } from '../utils'

import {
  DomainCheckNone,
  DomainCheckPending,
  DomainCheckAccepted,
  DomainCheckRejected,
} from './domain-states'

class Domain extends React.Component {
  static defaultProps = {
    warm: false,
    positionProgress: 0,
    domain: '',
    domainCheckStatus: DomainCheckNone,
    onDomainChange: noop,
    onSubmit: noop,
  }
  componentWillReceiveProps({ positionProgress }) {
    if (positionProgress === 0 && positionProgress !== this.props.positionProgress) {
      this.focusEl.focus()
    }
  }
  handleDomainChange = event => {
    this.props.onDomainChange(event.target.value)
  }
  handleSubmit = event => {
    event.preventDefault()
    this.focusEl.blur()
    this.props.onSubmit()
  }
  handleFocusElRef = el => {
    this.focusEl = el
  }
  render() {
    const { positionProgress, warm, domain, domainCheckStatus } = this.props
    return (
      <Main>
        <Content
          style={{
            transform: `translateX(${lerp(positionProgress, 0, 50)}%)`,
            opacity: 1 - Math.abs(positionProgress),
            willChange: warm? 'opacity, transform' : 'auto',
          }}
        >
          <DomainContent
            domain={domain}
            domainCheckStatus={domainCheckStatus}
            onDomainChange={this.handleDomainChange}
            onSubmit={this.handleSubmit}
            focusElRef={this.handleFocusElRef}
          />
        </Content>
      </Main>
    )
  }
}

class DomainContent extends React.PureComponent {
  render() {
    return (
      <React.Fragment>
        <Title>
          <Text size="great" weight="bold" color={theme.textDimmed}>
            Claim a domain name
          </Text>
        </Title>
        <p>
          <Text size="large" color={theme.textSecondary}>
            Check if your organization name is available
          </Text>
        </p>
        <form onSubmit={this.props.onSubmit}>
          <Field>
            <TextInput
              id="domain-field"
              innerRef={this.props.focusElRef}
              placeholder="myorganization"
              onChange={this.props.onDomainChange}
              style={{ textAlign: 'right' }}
              value={this.props.domain}
            />
            <label htmlFor="domain-field">
              <Text weight="bold"> .aragonid.eth</Text>
            </label>
            <Status>
              <CheckContainer
                active={this.props.domainCheckStatus === DomainCheckAccepted}
              >
                <IconCheck />
              </CheckContainer>
              <CheckContainer
                active={this.props.domainCheckStatus === DomainCheckRejected}
              >
                <IconCross />
              </CheckContainer>
              <CheckContainer
                active={this.props.domainCheckStatus === DomainCheckPending}
              >
                …
              </CheckContainer>
            </Status>
          </Field>
        </form>
      </React.Fragment>
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
  font-size: 37px;
  margin-bottom: 100px;
`

const Field = styled.p`
  display: flex;
  align-items: center;
  margin-top: 40px;
  label {
    margin: 0 10px;
  }
`

const Status = styled.span`
  position: relative;
  width: 20px;
  height: 20px;
`

const CheckContainer = styled.span`
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  transform: scale(${({ active }) => (active ? '1, 1' : '0, 0')});
  transform-origin: 50% 50%;
  transition: transform 100ms ease-in-out;
`

export default Domain
