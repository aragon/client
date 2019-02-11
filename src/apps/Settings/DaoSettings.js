import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Button, Text, BreakPoint, theme } from '@aragon/ui'
import IdentityBadge from '../../components/IdentityBadge'
import { appIds, network } from '../../environment'
import { sanitizeNetworkType } from '../../network-config'
import { noop } from '../../utils'
import { DaoAddressType } from '../../prop-types'
import { toChecksumAddress } from '../../web3-utils'
import airdrop, { testTokensEnabled } from '../../testnet/airdrop'
import Option from './Option'
import Note from './Note'

const AppsList = styled.ul`
  list-style: none;
`

class DaoSettings extends React.Component {
  static propTypes = {
    account: PropTypes.string.isRequired,
    apps: PropTypes.array.isRequired,
    appsLoading: PropTypes.bool.isRequired,
    daoAddress: DaoAddressType.isRequired,
    onOpenApp: PropTypes.func.isRequired,
    shortAddresses: PropTypes.bool.isRequired,
    walletNetwork: PropTypes.string.isRequired,
    walletWeb3: PropTypes.object,
  }
  static defaultProps = {
    account: '',
    apps: [],
    onOpenApp: noop,
    shortAddresses: false,
  }
  handleDepositTestTokens = () => {
    const { account, apps, walletWeb3 } = this.props
    const finance = apps.find(app => app.appId === appIds.Finance)
    if (finance && finance.proxyAddress) {
      airdrop(walletWeb3, finance.proxyAddress, account)
    }
  }
  handleOpenFinance = () => {
    const { apps, onOpenApp } = this.props
    const finance = apps.find(app => app.appId === appIds.Finance)
    if (finance && finance.proxyAddress) {
      onOpenApp(finance.proxyAddress)
    }
  }
  render() {
    const {
      account,
      apps,
      appsLoading,
      daoAddress,
      shortAddresses,
      walletNetwork,
    } = this.props
    const enableTransactions = !!account && walletNetwork === network.type
    const financeApp = apps.find(({ name }) => name === 'Finance')
    const checksummedDaoAddr =
      daoAddress.address && toChecksumAddress(daoAddress.address)
    const apmApps = apps.filter(app => app.isOnAPM)
    return (
      <div>
        <Option
          name="Organization address"
          text={`This organization is deployed on the ${network.name}.`}
        >
          {checksummedDaoAddr ? (
            <div css={'display:flex; flex-direction: column'}>
              <Label> Address</Label>
              <IdentityBadge
                entity={checksummedDaoAddr}
                shorten={shortAddresses}
              />
            </div>
          ) : (
            <p>Resolving DAO address…</p>
          )}
          <Note>
            <strong>Do not send ether or tokens to this address!</strong>
            <br />
            Go to the{' '}
            {financeApp ? (
              <ButtonLink onClick={this.handleOpenFinance}>
                Finance app
              </ButtonLink>
            ) : (
              'Finance app'
            )}{' '}
            to deposit funds into your organization instead.
          </Note>
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
                        )} network in your Ethereum provider.`
                      : `Please unlock your account in your Ethereum provider.`)()}
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
        {appsLoading && (
          <Option name="Aragon apps" text={'Loading apps…'}>
            <div css={'height:20px'} />
          </Option>
        )}
        {!appsLoading && apmApps.length > 0 && (
          <Option
            name="Aragon apps"
            text={`This organization has ${apmApps.length}
            ${apmApps.length > 1 ? 'apps' : 'app'}
            installed.`}
          >
            <AppsList>
              {apmApps.map(
                ({ appId, description, name, proxyAddress, status }) => {
                  const checksummedProxyAddress = toChecksumAddress(
                    proxyAddress
                  )

                  return (
                    <li title={description} key={checksummedProxyAddress}>
                      <Label>
                        {name}
                        {status ? ` (${status})` : ''}
                      </Label>
                      <IdentityBadge
                        entity={checksummedProxyAddress}
                        shorten={shortAddresses}
                      />
                    </li>
                  )
                }
              )}
            </AppsList>
          </Option>
        )}
      </div>
    )
  }
}

const ButtonLink = styled(Button).attrs({ mode: 'text' })`
  padding: 0;
  color: inherit;
  font-size: inherit;
  text-decoration: underline;
`

const Label = styled.label`
  display: block;
  color: ${theme.textSecondary};
  font-size: 11px;
  text-transform: uppercase;
`

export default props => (
  <React.Fragment>
    <BreakPoint to="medium">
      <DaoSettings {...props} shortAddresses />
    </BreakPoint>
    <BreakPoint from="medium">
      <DaoSettings {...props} />
    </BreakPoint>
  </React.Fragment>
)
