import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Button, DropDown, Field, Text, TextInput, theme } from '@aragon/ui'
import AppLayout from '../../components/AppLayout/AppLayout'
import { InvalidNetworkType, InvalidURI, NoConnection } from '../../errors'
import { defaultEthNode, ipfsDefaultConf, network } from '../../environment'
import {
  getSelectedCurrency,
  setDefaultEthNode,
  setIpfsGateway,
  setSelectedCurrency,
} from '../../local-settings'
import { sanitizeNetworkType } from '../../network-config'
import { AppType, DaoAddressType, EthereumAddressType } from '../../prop-types'
import { checkValidEthNode } from '../../web3-utils'
import DaoSettings from './DaoSettings'
import Option from './Option'
import Note from './Note'

// Only USD for now
const AVAILABLE_CURRENCIES = ['USD']

// If the currency isn’t available, get the first available instead.
const filterCurrency = currency => {
  currency = currency.toUpperCase()
  return AVAILABLE_CURRENCIES.indexOf(currency) > -1
    ? currency
    : AVAILABLE_CURRENCIES[0]
}

class Settings extends React.Component {
  static propTypes = {
    account: EthereumAddressType,
    apps: PropTypes.arrayOf(AppType).isRequired,
    appsLoading: PropTypes.bool.isRequired,
    daoAddress: DaoAddressType.isRequired,
    onMessage: PropTypes.func.isRequired,
    onOpenApp: PropTypes.func.isRequired,
    walletNetwork: PropTypes.string.isRequired,
    walletWeb3: PropTypes.object.isRequired,
  }
  state = {
    currencies: AVAILABLE_CURRENCIES,
    ethNode: defaultEthNode,
    ipfsGateway: ipfsDefaultConf.gateway,
    selectedCurrency: filterCurrency(getSelectedCurrency()),
    selectedNodeError: null,
  }
  handleSelectedCurrencyChange = (index, currencies) => {
    setSelectedCurrency(currencies[index])
    this.setState({ selectedCurrency: currencies[index] })
  }
  handleDefaultEthNodeChange = event => {
    this.setState({
      ethNode: event.target.value && event.target.value.trim(),
      selectedNodeError: null,
    })
  }
  handleIpfsGatewayChange = event => {
    this.setState({
      ipfsGateway: event.target.value && event.target.value.trim(),
    })
  }
  handleNodeSettingsSave = async () => {
    const { ethNode, ipfsGateway } = this.state

    try {
      await checkValidEthNode(ethNode, network.type)
    } catch (err) {
      this.setState({ selectedNodeError: err })
      return
    }

    setDefaultEthNode(ethNode)
    setIpfsGateway(ipfsGateway)
    // For now, we have to reload the page to propagate the changes
    window.location.reload()
  }
  handleRefreshCache = () => {
    window.localStorage.clear()
    window.location.reload()
  }

  handleMenuPanelOpen = () => {
    this.props.onMessage({
      data: { from: 'app', name: 'menuPanel', value: true },
    })
  }

  render() {
    const {
      account,
      apps,
      appsLoading,
      daoAddress,
      onOpenApp,
      walletNetwork,
      walletWeb3,
    } = this.props
    const {
      currencies,
      ethNode,
      ipfsGateway,
      selectedCurrency,
      selectedNodeError,
    } = this.state
    return (
      <AppLayout
        title="Settings"
        onMenuOpen={this.handleMenuPanelOpen}
        smallViewPadding={20}
      >
        <Content>
          <DaoSettings
            apps={apps}
            appsLoading={appsLoading}
            account={account}
            daoAddress={daoAddress}
            onOpenApp={onOpenApp}
            walletNetwork={walletNetwork}
            walletWeb3={walletWeb3}
          />
          {currencies.length > 1 && selectedCurrency && (
            <Option
              name="Currency"
              text={`
                This will be the default currency for displaying purposes.
                It will be converted to ETH under the hood.
              `}
            >
              <Field label="Select currency">
                <DropDown
                  active={currencies.indexOf(selectedCurrency)}
                  items={currencies}
                  onChange={this.handleSelectedCurrencyChange}
                />
              </Field>
            </Option>
          )}
          <Option
            name="Node settings (advanced)"
            text={`
              Change the Ethereum and IPFS nodes this app is connected to.
            `}
          >
            <Field label="Ethereum node">
              <TextInput
                onChange={this.handleDefaultEthNodeChange}
                wide
                value={ethNode}
              />
              {selectedNodeError && (
                <Text color={theme.negative} size="xsmall">
                  {(() => {
                    if (selectedNodeError instanceof InvalidNetworkType) {
                      return `Node must be connected to ${sanitizeNetworkType(
                        network.type
                      )}`
                    }
                    if (selectedNodeError instanceof InvalidURI) {
                      return 'Must provide WebSocket endpoint to node'
                    }
                    if (selectedNodeError instanceof NoConnection) {
                      return 'Could not connect to node'
                    }
                    return 'URI does not seem to be a ETH node'
                  })()}
                </Text>
              )}
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
            text={`
              Press this button to refresh the cache of the application in your
              browser.
            `}
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

const Content = styled.div`
  max-width: 600px;
`

export default Settings
