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
import { network, web3Providers } from '../environment'
import { sanitizeNetworkType } from '../network-config'
import { noop } from '../utils'
import { weiToEther, etherToWei } from '../web3-utils'
import { lerp } from '../math-utils'
import LoadingRing from '../components/LoadingRing'
import logo from './assets/logo-welcome.svg'

import {
  DomainCheckNone,
  DomainCheckPending,
  DomainCheckAccepted,
  DomainCheckRejected,
} from './domain-states'

const MINIMUM_BALANCE = etherToWei(0.1)

class Start extends React.Component {
  static defaultProps = {
    warm: false,
    positionProgress: 0,
    hasAccount: false,
    network: 'private',
    balance: null,
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
      positionProgress,
      warm,
      hasAccount,
      network: userNetwork,
      balance,
      onCreate,
      domain,
      domainCheckStatus,
    } = this.props
    return (
      <Main
        style={{
          opacity: 1 - Math.abs(positionProgress),
          willChange: warm ? 'opacity' : 'auto',
        }}
      >
        <Content
          style={{
            transform: `translateX(${lerp(positionProgress, 0, 50)}%)`,
            willChange: warm ? 'transform' : 'auto',
          }}
        >
          <StartContent
            onCreate={onCreate}
            hasWallet={!!web3Providers.wallet}
            hasAccount={hasAccount}
            userNetwork={userNetwork}
            balance={balance}
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
  enoughBalance() {
    const { balance } = this.props
    const enough =
      balance && balance.isLessThan && !balance.isLessThan(MINIMUM_BALANCE)
    return enough || false
  }
  render() {
    const {
      hasWallet,
      hasAccount,
      userNetwork,
      domain,
      domainCheckStatus,
      onDomainChange,
      onOpenOrganization,
    } = this.props
    const canCreate =
      this.enoughBalance() &&
      hasWallet &&
      hasAccount &&
      userNetwork === network.type

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
            disabled={!canCreate}
          >
            Create a new organization
          </Button>
          {this.renderWarning()}
        </Action>
        <form onSubmit={onOpenOrganization}>
          <Action spaced>
            <p>
              <Text size="large" color={theme.textSecondary}>
                Or open an existing organization
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
                    <LoadingRing
                      spin={this.props.domainCheckStatus === DomainCheckPending}
                    />
                  </CheckContainer>
                </Status>
              </Field>

              <span style={{ height: '40px' }}>
                {domainCheckStatus === DomainCheckAccepted && (
                  <Button mode="outline" compact onClick={onOpenOrganization}>
                    Open organization
                  </Button>
                )}
                {domainCheckStatus === DomainCheckRejected && (
                  <Text
                    size="xsmall"
                    style={{ display: 'block', marginTop: '-10px' }}
                  >
                    No organization with that name exists.
                  </Text>
                )}
              </span>
            </OpenOrganization>
          </Action>
        </form>
      </React.Fragment>
    )
  }
  renderWarning() {
    const { hasWallet, hasAccount, userNetwork, balance } = this.props
    if (!hasWallet) {
      return (
        <ActionInfo>
          Please install and unlock{' '}
          <SafeLink href="https://metamask.io/" target="_blank">
            MetaMask
          </SafeLink>.
        </ActionInfo>
      )
    }
    if (!hasAccount) {
      return <ActionInfo>Please unlock MetaMask.</ActionInfo>
    }
    if (network.type === 'unknown') {
      return (
        <ActionInfo>
          This app was built to connect to an unsupported network. Please change
          the network environment settings.
        </ActionInfo>
      )
    }
    if (userNetwork !== network.type) {
      return (
        <ActionInfo>
          Please select the {sanitizeNetworkType(network.type)} network in
          MetaMask.
        </ActionInfo>
      )
    }
    if (!this.enoughBalance()) {
      return (
        <ActionInfo>
          You need at least {weiToEther(MINIMUM_BALANCE)} ETH (you have{' '}
          {Math.round(weiToEther((balance || 0).toFixed()) * 1000) / 1000} ETH).
          <br />
          {network.type === 'rinkeby' && (
            <SafeLink target="_blank" href="https://faucet.rinkeby.io/">
              Request Ether on the Rinkeby Network
            </SafeLink>
          )}
          {network.type === 'private' &&
            'Please import an account with enough ETH.'}
        </ActionInfo>
      )
    }
    return null
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
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  padding-bottom: 30px;
  padding-top: ${({ spaced }) => (spaced ? '50px' : '0')};
  p {
    margin-bottom: 35px;
  }
`

const ActionInfo = styled.span`
  position: relative;
  z-index: 2;
  height: 0;
  margin-top: 8px;
  font-size: 12px;
  white-space: nowrap;
  text-align: center;
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
