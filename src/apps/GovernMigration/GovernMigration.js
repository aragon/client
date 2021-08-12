import React from 'react'
import PropTypes from 'prop-types'
import {
  Box,
  Header,
  Info,
  Link,
  GU,
  textStyle,
  unselectable,
  useLayout,
  useTheme,
  TextInput,
  Button,
} from '@aragon/ui'
import LocalIdentityBadge from '../../components/IdentityBadge/LocalIdentityBadge'
import appIds from '../../known-app-ids'
import { AppType, DaoAddressType } from '../../prop-types'
import { getEmptyAddress, toChecksumAddress } from '../../web3-utils'
import styled from 'styled-components'
import { NETWORK_TYPE } from '../../NetworkType'
import { useWallet } from '../../wallet'

const GOVERN_REWARD_URL = 'https://governreward.aragon.org'
const MIGRATE_REWARD_URL =
  'https://help.aragon.org/article/99-aragon-govern-migration-reward-program'

function getCreateOneUrl(networkType) {
  return `https://govern${
    networkType === NETWORK_TYPE.main ? '' : '-' + networkType
  }.aragon.org/#/create-dao`
}

const GovernMigration = React.memo(function GovernMigration({
  apps,
  appsLoading,
  daoAddress,
}) {
  const theme = useTheme()
  const { layoutName } = useLayout()
  const { networkType } = useWallet()

  const apmApps = apps.filter(app => !app.isAragonOsInternalApp)
  const hasAgentApp = apps.some(app => app.appId === appIds.Agent)
  const hasFinanceApp = apps.some(app => app.appId === appIds.Finance)
  const checksummedDaoAddr =
    daoAddress.address && toChecksumAddress(daoAddress.address)
  const shortAddresses = layoutName !== 'large'

  const organizationText = checksummedDaoAddr ? (
    <span>Your DAO addresses</span>
  ) : (
    'Resolving organization address…'
  )

  const depositFundsHelpText = appsLoading ? (
    ''
  ) : hasFinanceApp || hasAgentApp ? (
    <span>If you’d like to deposit funds into this organization</span>
  ) : (
    `This organization does not have a Finance or Agent app installed and may
     not be able to receive funds. Please check with the organization’s
     administrators if any other installed apps are able to receive funds.`
  )

  return (
    <React.Fragment>
      <Header.Title>Aragon Govern Reward Program</Header.Title>
      <div
        css={`
          ${textStyle('body2')};
          margin-bottom: ${3 * GU}px;
        `}
      >
        Migrate your DAO to an Aragon Govern DAO and receive options that are
        convertible to ANT.{' '}
        <StyledLink href={MIGRATE_REWARD_URL}>Learn more</StyledLink>.
      </div>
      <Box heading="Generate Migration">
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
        <React.Fragment>
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
              {apmApps.map(
                ({ appId, description, name, proxyAddress, tags }) => (
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
                )
              )}
            </ul>
          </Box>
        </React.Fragment>
      )}
      <div
        css={`
          margin-top: ${GU * 3}px;
          display: grid;
          row-gap: ${GU * 2}px;
        `}
      >
        <Label>Your new Aragon Govern DAO</Label>
        <TextInput wide placeholder={getEmptyAddress()} />
        <Info mode="warning">
          Make sure your <b>Aragon Govern Executor</b> address is correct,
          otherwise you might send all your funds to an invalid address and lose
          access to them
        </Info>
        <Button mode="strong">Generate Migration</Button>
        {networkType && (
          <Label>
            Don't have a Aragon Govern DAO?{' '}
            <StyledLink href={getCreateOneUrl(networkType)}>
              Create one
            </StyledLink>
            .
          </Label>
        )}
        <Info>
          By executing this you will be creating a proposal that will be voted
          in your DAO. Once it is approved and executed,{' '}
          <b>all your DAO funds</b> will be transfered to the new DAO Govern
          Executor address, and the new DAO will be entitled to receive the KPI
          options. The options will be sent to the same Aragon Govern Executor
          address within 10 days from the migration. You can consult the options
          amount in{' '}
          <StyledLink href={GOVERN_REWARD_URL}>
            governreward.aragon.org
          </StyledLink>
        </Info>
      </div>
    </React.Fragment>
  )
})

GovernMigration.propTypes = {
  apps: PropTypes.arrayOf(AppType).isRequired,
  appsLoading: PropTypes.bool.isRequired,
  daoAddress: DaoAddressType.isRequired,
}

const Label = styled.label`
  color: ${({ theme }) => theme.content};
  display: block;
  margin-bottom: ${2 * GU}px;
  ${textStyle('body2')}
`
const StyledLink = styled(Link)`
  text-decoration: none;
`

export default GovernMigration
