import React, { useCallback, useState } from 'react'
import PropTypes from 'prop-types'
import {
  Box,
  Button,
  ButtonText,
  Card,
  Header,
  IconCoin,
  Info,
  Layout,
  GU,
  Tabs,
  Text,
  TextInput,
  textStyle,
  unselectable,
  useLayout,
  useTheme,
} from '@aragon/ui'
import LocalIdentityBadge from '../../components/IdentityBadge/LocalIdentityBadge'
import { appIds, network } from '../../environment'
import { sanitizeNetworkType } from '../../network-config'
import { AppType, DaoAddressType, EthereumAddressType } from '../../prop-types'
import providerString from '../../provider-strings'
import airdrop, { testTokensEnabled } from '../../testnet/airdrop'
import { toChecksumAddress } from '../../web3-utils'
import useAppWidth from '../useAppWidth'
import noTokensConnectedPNG from '../../assets/no-tokens-connected.png'
import organizationLogoPlaceholder from '../../assets/organization-logo-placeholder.png'
import organizationBackground from '../../assets/organization-background.png'
import styled from 'styled-components'

const Address = ({
  checksummedDaoAddr,
  shortAddresses,
  depositFundsHelpText,
}) => (
  <Section heading="Organization address">
    <p
      css={`
        ${textStyle('body2')}
      `}
    >
      {checksummedDaoAddr
        ? `This organization is deployed on the Ethereum ${network.name}.`
        : 'Resolving DAO address…'}
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
  </Section>
)

Address.propTypes = {
  checksummedDaoAddr: PropTypes.string.isRequired,
  shortAddresses: PropTypes.bool.isRequired,
  depositFundsHelpText: PropTypes.string.isRequired,
}

const RequestTokens = ({
  handleDepositTestTokens,
  handleOpenFinanceApp,
  enableTransactions,
  walletNetwork,
  walletProviderId,
}) => (
  <Section heading="Request test tokens">
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
          organization. These tokens are named after existing projects, but keep
          in mind{' '}
          <strong css="font-weight: 800">they are not real tokens</strong>.
        </p>
        <p
          css={`
            margin-top: ${1 * GU}px;
          `}
        >
          You can view the received tokens in{' '}
          <OpenAppButton onClick={handleOpenFinanceApp}>Finance</OpenAppButton>.
        </p>
      </Info>
    ) : (
      <Info mode="warning">
        {`Please ${
          walletNetwork !== network.type
            ? `select the ${sanitizeNetworkType(network.type)} network`
            : 'unlock your account'
        } in ${providerString('your Ethereum provider', walletProviderId)}.`}
      </Info>
    )}
  </Section>
)

RequestTokens.propTypes = {
  handleDepositTestTokens: PropTypes.func.isRequired,
  handleOpenFinanceApp: PropTypes.func.isRequired,
  enableTransactions: PropTypes.bool.isRequired,
  walletNetwork: PropTypes.string.isRequired,
  walletProviderId: PropTypes.string.isRequired,
}

const Apps = ({ appsLoading, apps, shortAddresses }) => {
  const theme = useTheme()
  const apmApps = apps.filter(app => !app.isAragonOsInternalApp)

  return appsLoading ? (
    <Section heading="Installed Aragon apps">
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
    </Section>
  ) : (
    <Section heading="Installed Aragon apps">
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
    </Section>
  )
}

Apps.propTypes = {
  apps: PropTypes.arrayOf(AppType).isRequired,
  appsLoading: PropTypes.bool.isRequired,
  shortAddresses: PropTypes.bool.isRequired,
}

const Organization = React.memo(function Organization({
  account,
  apps,
  appsLoading,
  daoAddress,
  onOpenApp,
  walletNetwork,
  walletWeb3,
  walletProviderId,
}) {
  const theme = useTheme()
  const { layoutName } = useLayout()
  const [selectedTab, setSelectedTab] = useState(0)

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

      <Tabs
        items={['General', 'Profile', 'Storage', 'Tokens']}
        selected={selectedTab}
        onChange={setSelectedTab}
      />

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
          <Section heading="Basic">
            <div css="display: flex; width: 100%; margin-bottom: 12px">
              <div css="width: 50%; padding-right: 12px">
                <label
                  css={`
                    ${textStyle('label2')};
                    color: ${theme.surfaceContentSecondary};
                  `}
                >
                  Name
                  <TextInput wide />
                </label>
              </div>

              <div css="width: 50%; padding-left: 12px">
                <label
                  css={`
                    ${textStyle('label2')};
                    color: ${theme.surfaceContentSecondary};
                  `}
                >
                  Website
                  <TextInput wide />
                </label>
              </div>
            </div>

            <div css="width: 100%; margin-bottom: 24px">
              <label
                css={`
                  ${textStyle('label2')};
                  color: ${theme.surfaceContentSecondary};
                `}
              >
                Description
                <TextInput wide />
              </label>
            </div>

            <Button mode="strong">Save changes</Button>
          </Section>

          <Section heading="Brand">
            <div css="display: flex; width: 100%; margin-bottom: 12px;">
              <div css="display: flex; flex-direction: column; width: 50%; padding-right: 12px">
                <label
                  css={`
                    ${textStyle('label2')};
                    color: ${theme.surfaceContentSecondary};
                  `}
                >
                  Logo
                </label>
                <div
                  css={`
                    background: ${theme.surfaceUnder};
                    width: 217px;
                    height: 217px;
                    padding: 30px;
                  `}
                >
                  <img
                    css={`
                      width: 157px;
                      height: 157px;
                      border: 0;
                      border-radius: 50%;
                    `}
                    src={organizationLogoPlaceholder}
                    alt=""
                  />
                </div>
                <label
                  css={`
                    ${textStyle('label2')};
                    display: block;
                    color: ${theme.surfaceContentSecondary};
                  `}
                >
                  Accent color hex
                  <TextInput css="display: block" />
                </label>
                <Button>Upload new</Button>Please keep 1:1 ratio
              </div>

              <div css="display: flex; flex-direction: column; width: 50%; padding-left: 12px">
                <label
                  css={`
                    ${textStyle('label2')};
                    color: ${theme.surfaceContentSecondary};
                  `}
                >
                  Placeholder image
                </label>

                <img
                  css="margin: 10px; width: 321px; height: 217px"
                  src={organizationBackground}
                  alt=""
                />

                <Button mode="">Upload new</Button>
              </div>
            </div>
          </Section>
        </React.Fragment>
      )}
      {selectedTab === 2 && (
        <React.Fragment>
          <Section heading="Configuration"></Section>
          <Section heading="Manual Upload"></Section>
        </React.Fragment>
      )}
      {selectedTab === 3 && (
        <React.Fragment>
          <NoTokensCard>
            <div
              css={`
                width: 100%;
                height: 100%;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: space-evenly;
              `}
            >
              <img
                css="margin: 10px"
                src={noTokensConnectedPNG}
                alt=""
                height="160"
              />
              <Text size="xlarge">No tokens connected</Text>
              <Text size="large">Connect a token to your organization.</Text>
              <Button css="margin: 10px 0 20px 0" mode="strong">
                Connect token
              </Button>
            </div>
          </NoTokensCard>
        </React.Fragment>
      )}
    </React.Fragment>
  )
})

Organization.propTypes = {
  account: EthereumAddressType,
  apps: PropTypes.arrayOf(AppType).isRequired,
  appsLoading: PropTypes.bool.isRequired,
  daoAddress: DaoAddressType.isRequired,
  onOpenApp: PropTypes.func.isRequired,
  walletNetwork: PropTypes.string.isRequired,
  walletWeb3: PropTypes.object.isRequired,
  walletProviderId: PropTypes.string.isRequired,
}

const Section = ({ ...props }) => {
  return <Box padding={3 * GU} {...props} />
}

const OpenAppButton = props => (
  <ButtonText
    css={`
      padding: 0;
      font-weight: 600;
    `}
    {...props}
  />
)

const NoTokensCard = styled(Card)`
  width: 100%;
  height: 364px;
`

export default props => {
  const appWidth = useAppWidth()
  return (
    <Layout parentWidth={appWidth}>
      <Organization {...props} />
    </Layout>
  )
}
