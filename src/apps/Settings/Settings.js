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
import { compose } from '../../utils'
import { getWeb3 } from '../../web3-utils'
import { web3Providers, network, appIds } from '../../environment'
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
    apps: [],
    currencies: [],
    account: '',
    network: '',
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
  render() {
    const {
      currencies,
      daoAddr,
      account,
      network: userNetwork,
      selectedCurrency,
      apps,
    } = this.props

    const enableTransactions = !!account && userNetwork === network.type
    return (
      <AppLayout title="Settings">
        <Content>
          <Option
            name="Test Tokens"
            text="Deposit some tokens into your organization for testing purposes."
          >
            <div>
              <Button
                mode="secondary"
                onClick={this.handleDepositTestTokens}
                disabled={!enableTransactions}
              >
                Request Test Tokens
              </Button>
              {!enableTransactions && (
                <Text size="small" style={{ marginLeft: '10px' }}>
                  {(() => {
                    if (userNetwork !== network.type) {
                      return `Please select the ${
                        network.type
                      } network in MetaMask.`
                    }
                    return `Please unlock your account in MetaMask.`
                  })()}
                </Text>
              )}
            </div>
            <Note>
              Requesting tokens will assign random <strong>TEST</strong> tokens
              to your organization. The tokens are named after existing
              projects, but keep in mind <strong>THEY ARE NOT</strong> the real
              ones.{' '}
              <span role="img" aria-label="winking face">
                😉
              </span>{' '}
              You can view the received tokens in the Token Balances on the
              Finance app.
            </Note>
          </Option>
          <Option
            name="Organization Address"
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
                <strong>Do not send Ether to this address!</strong> Use the
                Finance app address below for sending{' '}
                <strong>test Ether</strong> to your organization.
              </Note>
            </Field>
          </Option>
          {apps.length > 0 && (
            <Option
              name="Aragon Apps"
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
