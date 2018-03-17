import React from 'react'
import styled from 'styled-components'
import {
  theme,
  Text,
  SafeLink,
  Button,
  TextInput,
  IconCheck,
  IconCross,
} from '@aragon/ui'
import { noop } from '../utils'
import { lerp } from '../math-utils'
import logo from './assets/logo-welcome.svg'

import {
  DomainCheckNone,
  DomainCheckPending,
  DomainCheckAccepted,
  DomainCheckRejected,
} from './domain-states'

class Start extends React.Component {
  static defaultProps = {
    enableCreate: true,
    hideProgress: 0,
    onCreate: noop,
    onDomainChange: noop,
    domain: '',
    domainCheckStatus: DomainCheckNone,
    onOpenOrganization: noop,
  }
  handleDomainChange = event => {
    this.props.onDomainChange(event.target.value)
  }
  handleOpenOrganization = event => {
    event.preventDefault()
    this.props.onOpenOrganization()
  }
  render() {
    const {
      hideProgress,
      enableCreate,
      onCreate,
      domain,
      domainCheckStatus,
      onDomainChange,
      onOpenOrganization,
    } = this.props
    return (
      <Main
        style={{
          opacity: 1 - Math.abs(hideProgress),
          willChange: 'opacity',
        }}
      >
        <Content
          style={{
            transform: `translateX(${lerp(hideProgress, 0, 50)}%)`,
            willChange: 'transform',
          }}
        >
          <StartContent
            onCreate={onCreate}
            enableCreate={enableCreate}
            onDomainChange={this.handleDomainChange}
            domain={domain}
            domainCheckStatus={domainCheckStatus}
            onOpenOrganization={this.handleOpenOrganization}
          />
        </Content>
      </Main>
    )
  }
}

class StartContent extends React.PureComponent {
  render() {
    const {
      enableCreate,
      domain,
      domainCheckStatus,
      onDomainChange,
      onOpenOrganization,
    } = this.props
    return (
      <React.Fragment>
        <Title>
          <Text size="great" weight="bold" color={theme.textDimmed}>
            Welcome to Aragon
          </Text>
        </Title>
        <Action>
          <p>
            <Text size="large" color={theme.textSecondary}>
              Get started by creating your new decentralized organization
            </Text>
          </p>
          <Button
            mode="strong"
            onClick={this.props.onCreate}
            disabled={!enableCreate}
          >
            Create a new organization
          </Button>
          {!enableCreate && (
            <ActionInfo>
              Please install and unlock{' '}
              <SafeLink href="https://metamask.io/" target="_blank">
                MetaMask
              </SafeLink>.
            </ActionInfo>
          )}
        </Action>
        <form onSubmit={onOpenOrganization}>
          <Action spaced>
            <p>
              <Text size="large" color={theme.textSecondary}>
                Or open an existing organisation
              </Text>
            </p>

            <OpenOrganization>
              <Field>
                <TextInput
                  id="onboard-start-domain"
                  style={{ textAlign: 'right' }}
                  onChange={onDomainChange}
                  value={domain}
                />
                <label htmlFor="onboard-start-domain">
                  <Text weight="bold"> .aragonid.eth</Text>
                </label>
                <Status>
                  <CheckContainer
                    active={domainCheckStatus === DomainCheckAccepted}
                  >
                    <IconCheck />
                  </CheckContainer>
                  <CheckContainer
                    active={domainCheckStatus === DomainCheckRejected}
                  >
                    <IconCross />
                  </CheckContainer>
                  <CheckContainer
                    active={domainCheckStatus === DomainCheckPending}
                  >
                    …
                  </CheckContainer>
                </Status>
              </Field>

              <span style={{ height: '40px' }}>
                {domainCheckStatus === DomainCheckAccepted && (
                  <Button mode="outline" compact onClick={onOpenOrganization}>
                    Open organization
                  </Button>
                )}
              </span>
            </OpenOrganization>
          </Action>
        </form>
      </React.Fragment>
    )
  }
}

const Main = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  padding: 100px;
  @media (min-width: 1180px) {
    justify-content: flex-start;
    background: url(${logo}) no-repeat calc(100% - 70px) 60%;
  }
`

const Content = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`

const Action = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  padding-bottom: 30px;
  padding-top: ${({ spaced }) => spaced ? '50px' : '0' }
  p {
    margin-bottom: 35px;
  }
`

const ActionInfo = styled.span`
  position: absolute;
  bottom: 0;
  font-size: 12px;
`

const Title = styled.h1`
  font-size: 37px;
  margin-bottom: 40px;
`

const OpenOrganization = styled.div`
  display: flex;
  flex-direction: column;
  padding-left: 30px;
`

const Field = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
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

export default Start
