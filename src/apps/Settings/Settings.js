import React from 'react'
import styled from 'styled-components'
import {
  Button,
  DropDown,
  Field,
  TextInput,
  Text,
  observe,
  theme,
} from '@aragon/ui'
import AppLayout from '../../components/AppLayout/AppLayout'
import Option from './components/Option'
import observeCache from '../../components/HOC/observeCache'
import EtherscanLink from '../../components/Etherscan/EtherscanLink'
import provideNetwork from '../../context/provideNetwork'
import { sanitizeNetworkType } from '../../network-config'
import { compose } from '../../utils'
import { getWeb3 } from '../../web3-utils'
import { web3Providers, network, appIds } from '../../environment'
import {
  getDefaultEthNode,
  getIpfsGateway,
  setDefaultEthNode,
  setIpfsGateway,
} from '../../local-settings'
import airdrop from '../../testnet/airdrop'

// const AVAILABLE_CURRENCIES = ['USD', 'EUR', 'GBP', 'CAD', 'RMB', 'JPY']
const AVAILABLE_CURRENCIES = ['USD'] // Only use USD for now

const CACHE_KEY = 'settings'

const Content = styled.div`
  max-width: 600px;
  padding: 30px;
`

const LinkButton = styled(Button.Anchor).attrs({
  compact: true,
  mode: 'outline',
})`
  background: ${theme.contentBackground};
`

const AppsList = styled.ul`
  list-style: none;
`

const FieldTwoParts = styled.div`
  display: flex;
  align-items: center;
  input {
    margin-right: 10px;
    padding-top: 4px;
    padding-bottom: 4px;
  }
`

const Note = styled.p`
  margin-top: 10px;
  font-size: 13px;
  strong {
    font-weight: 600;
  }
`

class Settings extends React.Component {
  static defaultProps = {
    account: '',
    apps: [],
    currencies: [],
    network: '',
  }
  state = {
    defaultEthNode: getDefaultEthNode(),
    ipfsGateway: getIpfsGateway(),
  }
  constructor(props) {
    super(props)

    this.correctCurrencyIfNecessary(props)
  }
  componentWillReceiveProps(nextProps) {
    this.correctCurrencyIfNecessary(nextProps)
  }
  correctCurrencyIfNecessary({ cache, currencies, selectedCurrency }) {
    if (
      Array.isArray(currencies) &&
      currencies.indexOf(selectedCurrency) === -1
    ) {
      // Oops, somehow the selected currency isn't in the available currencies
      // Let's reset it to the first available currency
      this.propagateSelectedCurrency(cache, currencies[0])
    }
  }
  handleCurrencyChange = index => {
    const { cache, currencies } = this.props
    this.propagateSelectedCurrency(cache, currencies[index])
  }
  propagateSelectedCurrency(cache, selectedCurrency) {
    cache.update(CACHE_KEY, settings => ({ ...settings, selectedCurrency }))
  }
  handleDepositTestTokens = () => {
    const { account, apps } = this.props
    const finance = apps.find(app => app.appId === appIds.Finance)
    if (finance && finance.proxyAddress) {
      airdrop(getWeb3(web3Providers.wallet), finance.proxyAddress, account)
    }
  }
  handleDefaultEthNodeChange = event => {
    this.setState({ defaultEthNode: event.target.value })
  }
  handleIpfsGatewayChange = event => {
    this.setState({ ipfsGateway: event.target.value })
  }
  handleNodeSettingsSave = () => {
    const { defaultEthNode, ipfsGateway } = this.state
    setDefaultEthNode(defaultEthNode)
    setIpfsGateway(ipfsGateway)
    // For now, we have to reload the page to propagate the changes
    window.location.reload()
  }
  handleRefreshCache = () => {
    window.localStorage.clear()
    window.location.reload()
  }
  render() {
    const {
      currencies,
      daoAddr,
      account,
      network: userNetwork,
      selectedCurrency,
      apps,
    } = this.props
    const { defaultEthNode, ipfsGateway } = this.state

    const enableTransactions = !!account && userNetwork === network.type
    const financeApp = apps.find(({ name }) => name === 'Finance')
    return (
      <AppLayout title="Settings">
        <Content>
          <Option
            name="Organization address"
            text={`This organization is deployed on the ${network.name}.`}
          >
            <Field label="Address">
              <FieldTwoParts>
                <TextInput readOnly wide value={daoAddr} />
                <EtherscanLink address={daoAddr}>
                  {url =>
                    url ? (
                      <LinkButton href={url} target="_blank">
                        See on Etherscan
                      </LinkButton>
                    ) : null
                  }
                </EtherscanLink>
              </FieldTwoParts>
              <Note>
                <strong>Do not send ether or tokens to this address!</strong>{' '}
                Follow the instructions in the “Send ether to this organization”
                section below.
              </Note>
            </Field>
          </Option>
          <Option
            name="Request test tokens"
            text="Deposit some tokens into your organization for testing purposes."
          >
            <div>
              <Button
                mode="secondary"
                onClick={this.handleDepositTestTokens}
                disabled={!enableTransactions}
                style={{ opacity: enableTransactions ? 1 : 0.6 }}
              >
                Request test tokens
              </Button>
              {!enableTransactions && (
                <Text size="small" style={{ marginLeft: '10px' }}>
                  {(() =>
                    network.type === 'unknown'
                      ? 'This app was built to connect to an unsupported network. Please change the network environment settings.'
                      : userNetwork !== network.type
                        ? `Please select the ${sanitizeNetworkType(
                            network.type
                          )} network in MetaMask.`
                        : `Please unlock your account in MetaMask.`)()}
                </Text>
              )}
            </div>
            <Note>
              Requesting tokens will assign random <strong>TEST</strong> tokens
              to your organization. The tokens are named after existing
              projects, but keep in mind <strong>THEY ARE NOT</strong> the real
              ones. You can view the received tokens in the Token Balances on
              the Finance app.
            </Note>
          </Option>
          {financeApp && (
            <Option
              name="Send ether to this organization"
              text={
                <span>
                  To send <strong>test ether</strong> to this organization, use
                  the address of the Finance app indicated below.
                </span>
              }
            >
              <Field label="Funding Address (Finance App)">
                <FieldTwoParts>
                  <TextInput readOnly wide value={financeApp.proxyAddress} />
                  <EtherscanLink address={financeApp.proxyAddress}>
                    {url =>
                      url ? (
                        <LinkButton href={url} target="_blank">
                          See on Etherscan
                        </LinkButton>
                      ) : null
                    }
                  </EtherscanLink>
                </FieldTwoParts>
                <Note>
                  Remember to use the {network.name} network.{' '}
                  <strong>DO NOT send real ether from the main network!</strong>
                </Note>
              </Field>
            </Option>
          )}
          {apps.length > 0 && (
            <Option
              name="Aragon apps"
              text={`This organization has ${apps.length} apps installed.`}
            >
              <AppsList>
                {apps.map(({ name, proxyAddress, description }) => (
                  <li title={description} key={proxyAddress}>
                    <Field label={name}>
                      <FieldTwoParts>
                        <TextInput readOnly wide value={proxyAddress} />
                        <EtherscanLink address={proxyAddress}>
                          {url =>
                            url ? (
                              <LinkButton href={url} target="_blank">
                                See on Etherscan
                              </LinkButton>
                            ) : null
                          }
                        </EtherscanLink>
                      </FieldTwoParts>
                    </Field>
                  </li>
                ))}
              </AppsList>
            </Option>
          )}
          {currencies.length > 1 &&
            selectedCurrency && (
              <Option
                name="Currency"
                text="This will be the default currency for displaying purposes. It will be converted to ETH under the hood."
              >
                <Field label="Select currency">
                  <DropDown
                    active={currencies.indexOf(selectedCurrency)}
                    items={currencies}
                    onChange={this.handleCurrencyChange}
                  />
                </Field>
              </Option>
            )}
          <Option
            name="Node settings (advanced)"
            text="Change which Ethereum and IPFS clients this app is connected to"
          >
            <Field label="Ethereum node">
              <TextInput
                onChange={this.handleDefaultEthNodeChange}
                wide
                value={defaultEthNode}
              />
            </Field>
            <Field label="IPFS gateway">
              <TextInput
                onChange={this.handleIpfsGatewayChange}
                wide
                value={ipfsGateway}
              />
            </Field>
            <Button mode="secondary" onClick={this.handleNodeSettingsSave}>
              Save settings
            </Button>
          </Option>
          <Option
            name="Troubleshooting"
            text="Press this button to refresh the cache of the application in your browser."
          >
            <div>
              <Button mode="secondary" onClick={this.handleRefreshCache}>
                Clear application cache
              </Button>
            </div>
            <Note>
              This will only delete the data stored in your browser to make the
              app load faster. No data related to the organization itself will
              be altered.
            </Note>
          </Option>
        </Content>
      </AppLayout>
    )
  }
}
const enhance = compose(
  observeCache(CACHE_KEY, {
    defaultValue: {
      selectedCurrency: AVAILABLE_CURRENCIES[0],
    },
    forcedValue: {
      currencies: AVAILABLE_CURRENCIES,
    },
  }),
  observe(observable => observable.map(settings => ({ ...settings })), {}),
  provideNetwork
)
export default enhance(Settings)
