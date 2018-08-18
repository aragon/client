import React from 'react'
import styled from 'styled-components'
import { Button, Field, TextInput, Text, theme } from '@aragon/ui'
import EtherscanLink from '../../components/Etherscan/EtherscanLink'
import { sanitizeNetworkType } from '../../network-config'
import { getWeb3, toChecksumAddress } from '../../web3-utils'
import { appIds, network, web3Providers } from '../../environment'
import airdrop, { testTokensEnabled } from '../../testnet/airdrop'
import Option from './Option'
import Note from './Note'

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

class DaoSettings extends React.Component {
  static defaultProps = {
    account: '',
    apps: [],
    daoAddr: '',
  }
  handleDepositTestTokens = () => {
    const { account, apps } = this.props
    const finance = apps.find(app => app.appId === appIds.Finance)
    if (finance && finance.proxyAddress) {
      airdrop(getWeb3(web3Providers.wallet), finance.proxyAddress, account)
    }
  }
  render() {
    const { account, apps, daoAddr, walletNetwork } = this.props
    const enableTransactions = !!account && walletNetwork === network.type
    const financeApp = apps.find(({ name }) => name === 'Finance')
    const checksummedDaoAddr = daoAddr && toChecksumAddress(daoAddr)
    const checksummedAppProxies = apps.reduce((addrMap, app) => {
      addrMap[app.appId] = toChecksumAddress(app.proxyAddress)
      return addrMap
    }, {})
    const webApps = apps.filter(app => app.hasWebApp)
    return (
      <div>
        <Option
          name="Organization address"
          text={`This organization is deployed on the ${network.name}.`}
        >
          <Field label="Address">
            <FieldTwoParts>
              <TextInput readOnly wide value={checksummedDaoAddr} />
              <EtherscanLink address={checksummedDaoAddr}>
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
        {testTokensEnabled(network.type) && (
          <Option
            name="Request test tokens"
            text={`
                Deposit some tokens into your organization for testing
                purposes.
              `}
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
                    walletNetwork !== network.type
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
        )}
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
                <TextInput
                  readOnly
                  wide
                  value={checksummedAppProxies[financeApp.appId]}
                />
                <EtherscanLink
                  address={checksummedAppProxies[financeApp.appId]}
                >
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
        {webApps.length > 0 && (
          <Option
            name="Aragon apps"
            text={`This organization has ${webApps.length} apps installed.`}
          >
            <AppsList>
              {webApps.map(({ appId, description, name, proxyAddress }) => {
                const checksummedProxyAddress = checksummedAppProxies[appId]
                return (
                  <li title={description} key={checksummedProxyAddress}>
                    <Field label={name}>
                      <FieldTwoParts>
                        <TextInput
                          readOnly
                          wide
                          value={checksummedProxyAddress}
                        />
                        <EtherscanLink address={checksummedProxyAddress}>
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
                )
              })}
            </AppsList>
          </Option>
        )}
      </div>
    )
  }
}

export default DaoSettings
