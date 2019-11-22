import React, { useCallback } from 'react'
import PropTypes from 'prop-types'
import {
  Box,
  Button,
  Header,
  IconCoin,
  Info,
  Link,
  GU,
  textStyle,
  unselectable,
  useLayout,
  useTheme,
} from '@aragon/ui'
import LocalIdentityBadge from '../../components/IdentityBadge/LocalIdentityBadge'
import { appIds, network } from '../../environment'
import { sanitizeNetworkType } from '../../network-config'
import { AppType, DaoAddressType } from '../../prop-types'
import { getProviderString } from '../../ethereum-providers'
import airdrop, { testTokensEnabled } from '../../testnet/airdrop'
import { toChecksumAddress } from '../../web3-utils'
import { useWallet } from '../../wallet-utils'

const Organization = React.memo(function Organization({
  apps,
  appsLoading,
  canUpgradeOrg,
  daoAddress,
  onOpenApp,
  onShowOrgVersionDetails,
}) {
  const theme = useTheme()
  const { layoutName } = useLayout()
  const wallet = useWallet()

  const handleDepositTestTokens = useCallback(() => {
    const finance = apps.find(app => app.appId === appIds.Finance)
    if (finance && finance.proxyAddress) {
      airdrop(wallet.web3, finance.proxyAddress, wallet.account)
    }
  }, [apps, wallet])
  const handleOpenAgentApp = useCallback(() => {
    const agent = apps.find(app => app.appId === appIds.Agent)
    if (agent && agent.proxyAddress) {
      onOpenApp(agent.proxyAddress)
    }
  }, [apps, onOpenApp])
  const handleOpenFinanceApp = useCallback(() => {
    const finance = apps.find(app => app.appId === appIds.Finance)
    if (finance && finance.proxyAddress) {
      onOpenApp(finance.proxyAddress)
    }
  }, [apps, onOpenApp])

  const apmApps = apps.filter(app => !app.isAragonOsInternalApp)
  const hasAgentApp = apps.some(app => app.appId === appIds.Agent)
  const hasFinanceApp = apps.some(app => app.appId === appIds.Finance)
  const checksummedDaoAddr =
    daoAddress.address && toChecksumAddress(daoAddress.address)
  const enableTransactions =
    wallet.isConnected && wallet.networkType === network.type
  const shortAddresses = layoutName !== 'large'

  const organizationText = checksummedDaoAddr ? (
    <span>
      This organization is deployed on the Ethereum {network.name}.{' '}
      {canUpgradeOrg ? (
        <span>
          <Link onClick={onShowOrgVersionDetails}>
            A new software update is available
          </Link>
          .
        </span>
      ) : (
        <span>
          The current software version is 0.8 Camino. You can see{' '}
          <Link onClick={onShowOrgVersionDetails}>what's new here</Link>.
        </span>
      )}
    </span>
  ) : (
    'Resolving DAO address…'
  )

  const depositFundsHelpText = appsLoading ? (
    ''
  ) : hasFinanceApp || hasAgentApp ? (
    <span>
      If you’d like to deposit funds into this organization, you can do so from{' '}
      {hasFinanceApp ? (
        <OpenAppButton onClick={handleOpenFinanceApp}>Finance</OpenAppButton>
      ) : (
        <OpenAppButton onClick={handleOpenAgentApp}>Agent</OpenAppButton>
      )}
      .
    </span>
  ) : (
    `This organization does not have a Finance or Agent app installed and may
       not be able to receive funds. Please check with the organization’s
       administrators if any other installed apps are able to receive funds.`
  )

  return (
    <React.Fragment>
      <Header primary="Organization Settings" />
      <Box heading="Organization address">
        <p
          css={`
            ${textStyle('body2')}
          `}
        >
          {organizationText}
        </p>
        {checksummedDaoAddr && (
          <React.Fragment>
            <div
              css={`
                margin-top: ${2 * GU}px;
                margin-bottom: ${3 * GU}px;
              `}
            >
              <LocalIdentityBadge
                entity={checksummedDaoAddr}
                shorten={shortAddresses}
              />
            </div>
            <Info>
              <strong css="font-weight: 800">
                Do not send ETH or ERC20 tokens to this address.
              </strong>{' '}
              {depositFundsHelpText}
            </Info>
          </React.Fragment>
        )}
      </Box>
      {hasFinanceApp && testTokensEnabled(network.type) && (
        <Box heading="Request test tokens">
          <p
            css={`
              margin-bottom: ${2 * GU}px;
              ${textStyle('body2')}
            `}
          >
            Deposit some tokens into your organization for testing purposes.
          </p>
          <Button
            label="Request test tokens"
            icon={<IconCoin />}
            display="all"
            onClick={handleDepositTestTokens}
            disabled={!enableTransactions}
            css={`
              margin-bottom: ${2 * GU}px;
            `}
          />
          {enableTransactions ? (
            <Info>
              <p>
                Requesting tokens will assign random{' '}
                <strong css="font-weight: 800">test tokens</strong> to your
                organization. These tokens are named after existing projects,
                but keep in mind{' '}
                <strong css="font-weight: 800">they are not real tokens</strong>
                .
              </p>
              <p
                css={`
                  margin-top: ${1 * GU}px;
                `}
              >
                You can view the received tokens in{' '}
                <OpenAppButton onClick={handleOpenFinanceApp}>
                  Finance
                </OpenAppButton>
                .
              </p>
            </Info>
          ) : (
            <Info mode="warning">
              {`Please ${
                wallet.networkType !== network.type
                  ? `select the ${sanitizeNetworkType(network.type)} network`
                  : 'unlock your account'
              } in ${getProviderString(
                'your Ethereum provider',
                wallet.providerInfo.id
              )}.`}
            </Info>
          )}
        </Box>
      )}
      {appsLoading ? (
        <Box heading="Installed Aragon apps">
          <div
            css={`
              display: flex;
              align-items: center;
              justify-content: center;
              height: ${22 * GU}px;
              ${textStyle('body2')}
            `}
          >
            Loading apps…
          </div>
        </Box>
      ) : (
        <Box heading="Installed Aragon apps">
          <ul
            css={`
              list-style: none;
              display: grid;
              grid-template-columns: minmax(50%, 1fr) minmax(50%, 1fr);
              grid-column-gap: ${2 * GU}px;
              margin-bottom: -${3 * GU}px;
            `}
          >
            {apmApps.map(({ appId, description, name, proxyAddress, tags }) => (
              <li
                key={proxyAddress}
                css={`
                  margin-bottom: ${3 * GU}px;
                `}
              >
                <label
                  css={`
                    color: ${theme.surfaceContentSecondary};
                    ${unselectable()};
                    ${textStyle('label2')};
                  `}
                >
                  {name}
                  {tags.length > 0 ? ` (${tags.join(', ')})` : ''}
                </label>
                <div
                  css={`
                    margin-top: ${1 * GU}px;
                  `}
                >
                  <LocalIdentityBadge
                    entity={proxyAddress}
                    shorten={shortAddresses}
                  />
                </div>
              </li>
            ))}
          </ul>
        </Box>
      )}
    </React.Fragment>
  )
})

Organization.propTypes = {
  apps: PropTypes.arrayOf(AppType).isRequired,
  appsLoading: PropTypes.bool.isRequired,
  canUpgradeOrg: PropTypes.bool,
  daoAddress: DaoAddressType.isRequired,
  onOpenApp: PropTypes.func.isRequired,
  onShowOrgVersionDetails: PropTypes.func.isRequired,
}

const OpenAppButton = props => <Link css="font-weight: 600" {...props} />

export default Organization
