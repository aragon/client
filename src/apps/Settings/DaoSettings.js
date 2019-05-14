import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Button, Text, useViewport, theme } from '@aragon/ui'
import LocalIdentityBadge from '../../components/IdentityBadge/LocalIdentityBadge'
import { appIds, network } from '../../environment'
import { sanitizeNetworkType } from '../../network-config'
import { AppType, DaoAddressType, EthereumAddressType } from '../../prop-types'
import { toChecksumAddress } from '../../web3-utils'
import airdrop, { testTokensEnabled } from '../../testnet/airdrop'
import Option from './Option'
import Note from './Note'

const AppsList = styled.ul`
  list-style: none;
`

const DaoSettings = React.memo(
  ({
    account,
    apps,
    appsLoading,
    daoAddress,
    onOpenApp,
    walletNetwork,
    walletWeb3,
  }) => {
    const handleDepositTestTokens = () => {
      const finance = apps.find(app => app.appId === appIds.Finance)
      if (finance && finance.proxyAddress) {
        airdrop(walletWeb3, finance.proxyAddress, account)
      }
    }
    const handleOpenFinance = () => {
      const finance = apps.find(app => app.appId === appIds.Finance)
      if (finance && finance.proxyAddress) {
        onOpenApp(finance.proxyAddress)
      }
    }
    const enableTransactions = !!account && walletNetwork === network.type
    const financeApp = apps.find(({ name }) => name === 'Finance')
    const checksummedDaoAddr =
      daoAddress.address && toChecksumAddress(daoAddress.address)
    const apmApps = apps.filter(app => !app.isAragonOsInternalApp)
    const { below } = useViewport()
    const shortAddresses = below('medium')

    return (
      <div>
        <Option
          name="Organization address"
          text={`This organization is deployed on the ${network.name}.`}
        >
          {checksummedDaoAddr ? (
            <div>
              <Label>Address</Label>
              <LocalIdentityBadge
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
              <ButtonLink onClick={handleOpenFinance}>Finance app</ButtonLink>
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
                onClick={handleDepositTestTokens}
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
        {apmApps.length > 0 && (
          <Option
            name="Aragon apps"
            text={
              appsLoading
                ? 'Loading apps…'
                : `This organization has ${apmApps.length} ${
                    apmApps.length === 1 ? 'app' : 'apps'
                  } installed.`
            }
          >
            {!appsLoading && (
              <AppsList>
                {apmApps.map(
                  ({ appId, description, name, proxyAddress, tags }) => {
                    const checksummedProxyAddress = toChecksumAddress(
                      proxyAddress
                    )

                    return (
                      <AppItem
                        title={description}
                        key={checksummedProxyAddress}
                      >
                        <Label>
                          {name}
                          {tags.length > 0 ? ` (${tags.join(', ')})` : ''}
                        </Label>
                        <LocalIdentityBadge
                          entity={checksummedProxyAddress}
                          shorten={shortAddresses}
                        />
                      </AppItem>
                    )
                  }
                )}
              </AppsList>
            )}
          </Option>
        )}
      </div>
    )
  }
)

DaoSettings.propTypes = {
  account: EthereumAddressType,
  apps: PropTypes.arrayOf(AppType).isRequired,
  appsLoading: PropTypes.bool.isRequired,
  daoAddress: DaoAddressType.isRequired,
  onOpenApp: PropTypes.func.isRequired,
  walletNetwork: PropTypes.string.isRequired,
  walletWeb3: PropTypes.object.isRequired,
}

DaoSettings.defaultProps = {
  shortAddresses: false,
}

const ButtonLink = styled(Button).attrs({ mode: 'text' })`
  padding: 0;
  color: inherit;
  font-size: inherit;
  text-decoration: underline;
  transition: none;
  &:focus {
    outline: 2px solid ${theme.accent};
  }
  &:active {
    outline: 0;
  }
`

const Label = styled.label`
  display: block;
  color: ${theme.textSecondary};
  font-size: 11px;
  text-transform: uppercase;
`

const AppItem = styled.li`
  margin-bottom: 24px;
`

export default DaoSettings
