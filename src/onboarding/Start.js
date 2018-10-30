import React from 'react'
import styled from 'styled-components'
import BN from 'bn.js'
import {
  theme,
  Text,
  SafeLink,
  Button,
  TextInput,
  IconCheck,
  IconCross,
  DropDown,
  IconAttention,
} from '@aragon/ui'
import { network, web3Providers, getDemoDao } from '../environment'
import { sanitizeNetworkType } from '../network-config'
import { noop } from '../utils'
import { fromWei, toWei } from '../web3-utils'
import { formatNumber, lerp } from '../math-utils'
import LoadingRing from '../components/LoadingRing'
import logo from './assets/logo-welcome.svg'

import {
  DomainCheckNone,
  DomainCheckPending,
  DomainCheckAccepted,
  DomainCheckRejected,
} from './domain-states'

const MINIMUM_BALANCE = new BN(toWei('0.1'))
const BALANCE_DECIMALS = 3
const formatBalance = (balance, decimals = BALANCE_DECIMALS) =>
  // Don't show decimals if the user has no ETH
  formatNumber(balance, balance ? decimals : 0)

const demoDao = getDemoDao()

class Start extends React.Component {
  static defaultProps = {
    positionProgress: 0,
    hasAccount: false,
    walletNetwork: '',
    balance: null,
    onCreate: noop,
    onDomainChange: noop,
    domain: '',
    domainCheckStatus: DomainCheckNone,
    onOpenOrganization: noop,
    onOpenOrganizationAddress: noop,
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
      hasAccount,
      walletNetwork,
      balance,
      onCreate,
      domain,
      domainCheckStatus,
      onOpenOrganizationAddress,
      selectorNetworks,
    } = this.props

    return (
      <Main
        style={{
          opacity: 1 - Math.abs(positionProgress),
        }}
      >
        <Content
          style={{
            transform: `translateX(${lerp(positionProgress, 0, 50)}%)`,
          }}
        >
          <StartContent
            onCreate={onCreate}
            hasWallet={!!web3Providers.wallet}
            hasAccount={hasAccount}
            walletNetwork={walletNetwork}
            balance={balance}
            onDomainChange={this.handleDomainChange}
            domain={domain}
            domainCheckStatus={domainCheckStatus}
            onOpenOrganization={this.handleOpenOrganization}
            onOpenOrganizationAddress={onOpenOrganizationAddress}
            selectorNetworks={selectorNetworks}
          />
        </Content>
      </Main>
    )
  }
}

class StartContent extends React.PureComponent {
  handleOpenDemoOrganization = () => {
    if (demoDao) {
      this.props.onOpenOrganizationAddress(demoDao)
    }
  }
  enoughBalance() {
    const { balance } = this.props
    const enough = balance && balance.lt && !balance.lt(MINIMUM_BALANCE)
    return !!enough
  }

  getNetworkChooserItems() {
    const { selectorNetworks } = this.props
    return [...selectorNetworks].sort(([id]) => (id === network.type ? -1 : 1))
  }

  handleNetworkChange = index => {
    const networkChooserItems = this.getNetworkChooserItems()
    const url = networkChooserItems[index][2]
    window.location = url
  }

  render() {
    const {
      hasWallet,
      hasAccount,
      walletNetwork,
      domain,
      domainCheckStatus,
      onDomainChange,
      onOpenOrganization,
      onOpenOrganizationAddress,
      selectorNetworks,
    } = this.props

    const canCreate =
      this.enoughBalance() &&
      hasWallet &&
      hasAccount &&
      walletNetwork === network.type

    const networkChooserItems = this.getNetworkChooserItems()

    return (
      <React.Fragment>
        <Title>
          <Text size="great" weight="bold" color={theme.textDimmed}>
            Welcome to Aragon
          </Text>
        </Title>

        <NetworkChooser>
          <p>
            <Text size="large" color={theme.textSecondary}>
              Start by choosing the network for your organization
            </Text>
          </p>

          <NetworkChooserContainer>
            <div>
              <DropDown
                items={networkChooserItems.map(([id, label]) => label)}
                onChange={this.handleNetworkChange}
              />
            </div>

            <Disclosure>
              <span>
                <IconAttention />
              </span>
              <p>
                Mainnet uses real funds. Find out more about the risks and
                what’s been done to mitigate them.
              </p>
            </Disclosure>
          </NetworkChooserContainer>
        </NetworkChooser>

        <TwoActions>
          <Action>
            <p>
              <Text size="large" color={theme.textSecondary}>
                Then create a new organization
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
            <Action>
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
                        spin={
                          this.props.domainCheckStatus === DomainCheckPending
                        }
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
        </TwoActions>
        {demoDao && (
          <Action>
            <p>
              <Text size="normal" color={theme.textSecondary}>
                Not ready to create an organization? Try browsing this{' '}
                <ButtonLink onClick={this.handleOpenDemoOrganization}>
                  demo organization
                </ButtonLink>{' '}
                instead.
              </Text>
            </p>
          </Action>
        )}
      </React.Fragment>
    )
  }
  renderWarning() {
    const { hasWallet, hasAccount, walletNetwork, balance } = this.props
    if (!hasWallet) {
      return (
        <ActionInfo>
          Please install and unlock{' '}
          <SafeLink href="https://metamask.io/" target="_blank">
            MetaMask
          </SafeLink>
          .
        </ActionInfo>
      )
    }
    if (!hasAccount) {
      return <ActionInfo>Please unlock MetaMask.</ActionInfo>
    }
    if (network.type === 'unknown') {
      return (
        <ActionInfo>
          This app was configured to connect to an unsupported network. Please
          change the network environment settings.
        </ActionInfo>
      )
    }
    if (walletNetwork !== network.type) {
      return (
        <ActionInfo>
          Please select the {sanitizeNetworkType(network.type)} network in your
          Ethereum provider.
        </ActionInfo>
      )
    }
    if (!this.enoughBalance()) {
      return (
        <ActionInfo>
          You need at least {fromWei(MINIMUM_BALANCE)} ETH (you have{' '}
          {formatBalance(parseFloat(fromWei(balance || '0')))} ETH).
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
  justify-content: flex-start;
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
  align-items: flex-start;
`

const TwoActions = styled.div`
  display: flex;
  align-items: flex-start;
  > *:first-child {
    width: 400px;
  }
`

const NetworkChooser = styled.div`
  margin-bottom: 60px;
  > p:first-child {
    margin-bottom: 40px;
  }
`

const NetworkChooserContainer = styled.div`
  display: flex;
`

const Disclosure = styled.div`
  position: relative;
  max-width: 400px;
  margin-left: 50px;
  & > span:first-child {
    position: absolute;
    top: -2px;
    left: -25px;
  }
`

const Action = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  width: 100%;
  padding-bottom: 30px;
  padding-top: ${({ spaced }) => (spaced ? '50px' : '0')};
  p {
    margin-bottom: 20px;
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

const ButtonLink = styled.button.attrs({ type: 'button' })`
  padding: 0;
  font-size: inherit;
  color: inherit;
  text-decoration: underline;
  color: ${theme.accent};
  cursor: pointer;
  background: none;
  border: 0;
`

export default Start
