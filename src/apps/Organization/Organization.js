import React, { useCallback, useState } from 'react'
import PropTypes from 'prop-types'
import { Box, Header, Layout, Link, GU, Tabs, useLayout } from '@aragon/ui'
import { appIds, network } from '../../environment'
import { AppType, DaoAddressType, EthereumAddressType } from '../../prop-types'
import airdrop, { testTokensEnabled } from '../../testnet/airdrop'
import { toChecksumAddress } from '../../web3-utils'
import useAppWidth from '../useAppWidth'
import BasicInfo from './BasicInfo'
import Address from './Address'
import RequestTokens from './RequestTokens'
import Apps from './Apps'
import Brand from './Brand'
import Tokens from './Tokens'

const Organization = React.memo(function Organization({
  account,
  apps,
  appsLoading,
  canUpgradeOrg,
  daoAddress,
  onOpenApp,
  onShowOrgVersionDetails,
  walletNetwork,
  walletWeb3,
  walletProviderId,
}) {
  const { layoutName } = useLayout()
  const [selectedTab, setSelectedTab] = useState(0)
  const [tabsVisible, setTabsVisible] = useState(true)
  const toggleTabsVisible = () => setTabsVisible(!tabsVisible)

  const handleDepositTestTokens = useCallback(() => {
    const finance = apps.find(app => app.appId === appIds.Finance)
    if (finance && finance.proxyAddress) {
      airdrop(walletWeb3, finance.proxyAddress, account)
    }
  }, [account, apps, walletWeb3])
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

  const hasAgentApp = apps.some(app => app.appId === appIds.Agent)
  const hasFinanceApp = apps.some(app => app.appId === appIds.Finance)
  const checksummedDaoAddr =
    daoAddress.address && toChecksumAddress(daoAddress.address)
  const enableTransactions = !!account && walletNetwork === network.type
  const shortAddresses = layoutName !== 'large'

  const connectedTokens = [
    {
      tokenName: 'Ethical Token',
      tokenSymbol: 'ETC',
      tokenDescription:
        'This is a token. It will do what tokens do, unless told otherwise. Then it will do something else.',
      tokenAddress: '0x5Fef2867d4BbF1E7423Bb7FB9031402D4F99d2b0',
    },
    {
      tokenName: 'Unethical Token',
      tokenSymbol: 'ETZ',
      tokenDescription: 'This is a very unethical token.',
      tokenAddress: '0x5Fef2867d4BbF1E7423Bb7FB9031402D4F99d2b0',
    },
  ]

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

      {tabsVisible && (
        <Tabs
          items={['General', 'Profile', 'Storage', 'Tokens']}
          selected={selectedTab}
          onChange={setSelectedTab}
        />
      )}

      {selectedTab === 0 && (
        <React.Fragment>
          <Address
            checksummedDaoAddr={checksummedDaoAddr}
            shortAddresses={shortAddresses}
            depositFundsHelpText={depositFundsHelpText}
          />

          {hasFinanceApp && testTokensEnabled(network.type) && (
            <RequestTokens
              handleDepositTestTokens={handleDepositTestTokens}
              handleOpenFinanceApp={handleOpenFinanceApp}
              enableTransactions={enableTransactions}
              walletNetwork={walletNetwork}
              walletProviderId={walletProviderId}
            />
          )}

          <Apps
            appsLoading={appsLoading}
            apps={apps}
            shortAddresses={shortAddresses}
          />
        </React.Fragment>
      )}

      {selectedTab === 1 && (
        <React.Fragment>
          <BasicInfo />
          <Brand />
        </React.Fragment>
      )}

      {selectedTab === 2 && (
        <React.Fragment>
          <Section heading="Configuration" />
          <Section heading="Manual Upload" />
        </React.Fragment>
      )}

      {selectedTab === 3 && (
        <Tokens
          connectedTokens={connectedTokens}
          toggleTabsVisible={toggleTabsVisible}
        />
      )}
    </React.Fragment>
  )
})

Organization.propTypes = {
  account: EthereumAddressType,
  apps: PropTypes.arrayOf(AppType).isRequired,
  appsLoading: PropTypes.bool.isRequired,
  canUpgradeOrg: PropTypes.bool.isRequired,
  daoAddress: DaoAddressType.isRequired,
  onOpenApp: PropTypes.func.isRequired,
  onShowOrgVersionDetails: PropTypes.func.isRequired,
  walletNetwork: PropTypes.string.isRequired,
  walletWeb3: PropTypes.object.isRequired,
  walletProviderId: PropTypes.string.isRequired,
}

const Section = ({ ...props }) => {
  return <Box padding={3 * GU} {...props} />
}

const OpenAppButton = props => <Link css="font-weight: 600" {...props} />

export default props => {
  const appWidth = useAppWidth()
  return (
    <Layout parentWidth={appWidth}>
      <Organization {...props} />
    </Layout>
  )
}
