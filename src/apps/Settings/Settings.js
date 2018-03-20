import React from 'react'
import styled from 'styled-components'
import {
  AppBar,
  Button,
  DropDown,
  Field,
  TextInput,
  observe,
  theme,
} from '@aragon/ui'
import Option from './components/Option'
import observeCache from '../../components/HOC/observeCache'
import EtherscanLink from '../../components/Etherscan/EtherscanLink'
import provideNetwork from '../../context/provideNetwork'
import { compose } from '../../utils'

// const AVAILABLE_CURRENCIES = ['USD', 'EUR', 'GBP', 'CAD', 'RMB', 'JPY']
const AVAILABLE_CURRENCIES = ['USD'] // Only use USD for now

const TEST_TOKENS = [
  {
    address: '0x0d5263b7969144a852d58505602f630f9b20239d',
    symbol: '',
  },
  {
    address: '0x6142214d83670226872d51e935fb57bec8832a60',
    symbol: '',
  },
  {
    address: '0x1e1cab55639f67e70973586527ec1dfdaf9bf764',
    symbol: '',
  },
  {
    address: '0x5e381afb0104d374f1f3ccde5ba7fe8f5b8af0e6',
    symbol: '',
  },
  {
    address: '0xa53899a7eb70b309f05f8fdb344cdc8c8f272abe',
    symbol: '',
  },
  {
    address: '0x5b2fdbba47e8ae35b9d6f8e1480703334f48b96c',
    symbol: '',
  },
  {
    address: '0x51e53b52555a4ab7227423a7761cc8e418b147c8',
    symbol: '',
  },
  {
    address: '0xc42da14b1c0ae7d4dd3946633f1046c3d46f3101',
    symbol: '',
  },
  {
    address: '0x4fc6e3b791560f25ed4c1bf5e2db9ab0d0e80747',
    symbol: '',
  },
]

const CACHE_KEY = 'settings'

const Main = styled.div`
  display: flex;
  height: 100%;
  flex-direction: column;
  align-items: stretch;
  justify-content: stretch;
`

const StyledAppBar = styled(AppBar)`
  flex-shrink: 0;
`

const ScrollWrapper = styled.div`
  height: 100%;
  overflow: auto;
`

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
  input {
    margin-right: 10px;
    padding-top: 4px;
    padding-bottom: 4px;
  }
`

class Settings extends React.Component {
  static defaultProps = {
    apps: [],
    currencies: [],
  }
  constructor(props) {
    super(props)

    this.state = {
      selectedTestToken: 0,
      testTokens: TEST_TOKENS,
    }

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
  handleDepositTestTokens = () => {
    const { selectedTestToken, testTokens } = this.state
    const tokenAddress = testTokens[selectedTestToken]
    // TODO: add some web3 magic to 0x39a4d265db942361d92e2b0039cae73ea72a2ff9 depositor
  }
  handleTestTokenChange = index => {
    this.setState({
      selectedTestToken: index,
    })
  }
  propagateSelectedCurrency(cache, selectedCurrency) {
    cache.update(CACHE_KEY, settings => ({ ...settings, selectedCurrency }))
  }
  render() {
    const { currencies, daoAddr, network, selectedCurrency, apps } = this.props
    const { selectedTestToken, testTokens } = this.state
    const testTokenSymbols = testTokens.map(({ symbol }) => symbol)
    return (
      <Main>
        <StyledAppBar title="Settings" />
        <ScrollWrapper>
          <Content>
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
              </Field>
            </Option>
            <Option
              name="Deposit Test Tokens"
              text="Deposit a random amount of testnet tokens into your DAO to play with."
            >
              <Field label="Select token">
                <DropDown
                  active={selectedTestToken}
                  items={testTokenSymbols}
                  onChange={this.handleTestTokenChange}
                />
              </Field>
              <Button
                mode="outline"
                onSubmit={this.handleDepositTestTokens}
                compact
              >
                Send tokens
              </Button>
            </Option>
            {apps.length > 0 && (
              <Option
                name="Aragon Apps"
                text={`This organization provides ${apps.length} apps.`}
              >
                <AppsList>
                  {apps.map(({ name, proxyAddress, description }, i) => (
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
        </ScrollWrapper>
      </Main>
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
