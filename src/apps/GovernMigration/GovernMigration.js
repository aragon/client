import React, { useState, useCallback, useRef, useMemo, useEffect } from 'react'
import PropTypes from 'prop-types'
import GenerateMigration from '@aragon/v2-migrator-script/build'
import { getNetworkConfig } from '../../network-config'
import { usePermissionsByRole } from '../../contexts/PermissionsContext'
import { getOrganizationByAddress } from '../../services/gql'
import { MIGRATION_LAST_DATE_ELIGIBLE_TIMESTAMP } from '../../App'

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
  Button,
} from '@aragon/ui'
import LocalIdentityBadge from '../../components/IdentityBadge/LocalIdentityBadge'
import { AppType, AragonType, DaoAddressType } from '../../prop-types'
import {
  getEmptyAddress,
  toChecksumAddress,
  isAddress,
  isEmptyAddress,
} from '../../web3-utils'
import styled from 'styled-components'
import { useWallet } from '../../wallet'
import AddressField from '../../components/AddressField/AddressField'
import { InvalidAddress, RequiredField } from '../../errors'
import { performTransactionPaths } from '../../aragonjs-wrapper'
import { useRouting } from '../../routing'

const GOVERN_REWARD_URL = 'https://upgrade.aragon.org/governReward'
const MIGRATE_REWARD_URL =
  'https://help.aragon.org/article/99-aragon-govern-migration-reward-program'

function getCreateOneUrl(networkType) {
  return `https://govern${
    networkType === 'main' ? '' : '-' + networkType
  }.aragon.org/#/create-dao`
}

function validateAddress(address) {
  if (!address) {
    return new RequiredField().message
  } else if (isEmptyAddress(address)) {
    return new InvalidAddress().message
  } else if (!isAddress(address)) {
    return new InvalidAddress().message
  } else {
    return null
  }
}

const GovernMigration = React.memo(function GovernMigration({
  appsLoading,
  apps,
  daoAddress,
  wrapper,
}) {
  const theme = useTheme()
  const { layoutName } = useLayout()
  const { networkType, account } = useWallet()
  const routing = useRouting()

  const [governAddress, setGovernAddress] = useState('')
  const [addressError, setAddressError] = useState(null)
  const addressRef = useRef(null)

  const [orgsByName, setOrgsByName] = useState([])

  const permissions = usePermissionsByRole()

  const shortAddresses = layoutName !== 'large'

  const checksummedDaoAddr =
    daoAddress.address && toChecksumAddress(daoAddress.address)

  const apmApps = useMemo(() => {
    const org = checksummedDaoAddr
      ? [
          {
            name: 'organization',
            proxyAddress: checksummedDaoAddr,
            tags: [],
          },
        ]
      : []
    const orgs = org.concat(apps.filter(app => !app.isAragonOsInternalApp))

    const orgsbyKey = []
    orgs.forEach(
      item => (orgsbyKey[item.name.toLowerCase()] = item.proxyAddress)
    )
    setOrgsByName(orgsbyKey)

    return orgs
  }, [apps, checksummedDaoAddr])

  const goToVote = useCallback(() => {
    routing.update(({ mode }) => ({
      mode: {
        name: 'org',
        orgAddress: mode.orgAddress,
        instanceId: orgsByName.voting,
      },
    }))
  }, [routing, orgsByName])

  const handleAddressChange = useCallback(e => {
    const address = e.target.value
    setGovernAddress(address)
    setAddressError(validateAddress(address))
  }, [])

  const handleMigration = useCallback(async () => {
    // check once more if dao is eligible to be migrated due to createdAt restriction
    const data = await getOrganizationByAddress(networkType, daoAddress.address)
    if (data?.createdAt) {
      // transform into ml seconds
      data.createdAt = parseInt(data.createdAt) * 1000
    }

    if (
      !data ||
      !data.createdAt ||
      data.createdAt > MIGRATION_LAST_DATE_ELIGIBLE_TIMESTAMP
    ) {
      setAddressError(
        `This DAO can't participate in this migration reward program`
      )
      return
    }

    const error = validateAddress(governAddress)
    setAddressError(error)
    if (error) return

    if (!orgsByName.voting) {
      setAddressError('Internal error. Please contact us.')
      return
    }

    const governExecutorProxy = getNetworkConfig(networkType).addresses
      .governExecutorProxy

    if (!governExecutorProxy) {
      setAddressError(
        `on the ${networkType} chain, migration is not supported.`
      )
      return
    }

    // figure out if token manager and any address can create a vote
    let votePermissions = permissions.filter(
      permission => permission.role.id === 'CREATE_VOTES_ROLE'
    )
    let anyoneNewVote = false
    let tokenManagerNewVote = false

    if (votePermissions.length > 0) {
      const entities = votePermissions[0].entities || []
      anyoneNewVote =
        entities.filter(entity => entity.type === 'any').length > 0
      tokenManagerNewVote =
        entities.filter(entity => entity.app?.name === 'Tokens').length > 0
    }

    const migrationParams = {
      address: governAddress,
      voting: orgsByName.voting,
      executor: governAddress,
      finance: orgsByName.finance,
    }

    let toAddress = ''

    if (anyoneNewVote) {
      toAddress = orgsByName.voting
    } else if (tokenManagerNewVote) {
      toAddress = orgsByName.tokens
      migrationParams.tokenManager = orgsByName.tokens
    } else {
      setAddressError(
        `There's no correct CREATE_NEW_VOTE permission on the Voting app`
      )
      return
    }

    let calldatas = []
    let calldata = ''

    // NOTE: Below code assumes that it's possible to have both Vault and Agent
    // which store their own balances separately.. Below makes sure to create
    // 2 transactions for the migration. Currently, Templates don't have this option
    // meaning that balance can be on one of them only, hence we only will have 1 transaction.

    // checks if the funds exist on vault and if it does
    // generates the calldata
    if (orgsByName.vault) {
      calldata = await GenerateMigration(networkType, {
        ...migrationParams,
        vault: orgsByName.vault,
      })

      if (calldata) {
        calldatas.push(calldata)
      }
    }

    // if the agent is installed, checks if the funds exist on it
    // and generates the calldata if it does.
    if (orgsByName.agent) {
      calldata = await GenerateMigration(networkType, {
        ...migrationParams,
        vault: orgsByName.agent,
      })

      if (calldata) {
        calldatas.push(calldata)
      }
    }

    // if the calldatas is empty, it means funds were not found
    // on neither agent nor vault.
    if (calldatas.length === 0) {
      setAddressError(
        `Migration is not possible because there's no funds on this dao`
      )
      return
    }

    const paths = calldatas.map(data => {
      return {
        from: account,
        to: toAddress,
        value: 0,
        description:
          'Create a new proposal to migrate your DAO funds to Aragon Govern',
        data: data,
      }
    })

    try {
      await performTransactionPaths(wrapper, [paths])
      goToVote()
    } catch (err) {
      console.log('Migration failed: ', err)
    }
  }, [
    daoAddress,
    wrapper,
    governAddress,
    orgsByName,
    permissions,
    networkType,
    account,
    goToVote,
  ])

  // focus address field on mount
  useEffect(() => {
    if (addressRef.current) {
      addressRef.current.focus()
    }
  }, [])

  return (
    <React.Fragment>
      <Header.Title>Aragon Govern Reward Program</Header.Title>
      <SubTitle>
        Migrate your DAO to an Aragon Govern DAO and receive options that are
        convertible to ANT.{' '}
        <StyledLink href={MIGRATE_REWARD_URL}>Learn more</StyledLink>.
      </SubTitle>

      <React.Fragment>
        <Box heading="Generate migration">
          <Label theme={theme}>Your DAO addresses</Label>
          <List>
            {appsLoading ? (
              <div>Loading apps…</div>
            ) : (
              apmApps.map(({ name, proxyAddress, tags }) => (
                <li key={proxyAddress}>
                  <ListItemLabel theme={theme}>
                    {name}
                    {tags.length > 0 ? ` (${tags.join(', ')})` : ''}
                  </ListItemLabel>
                  <IdentityBadgeContainter>
                    <LocalIdentityBadge
                      entity={proxyAddress}
                      shorten={shortAddresses}
                    />
                  </IdentityBadgeContainter>
                </li>
              ))
            )}
          </List>
          <div>
            <AddressField
              wide
              label="Your new Aragon Govern DAO"
              subtitle="The address of the DAO Executor (available in the settings tab of
                your new Aragon Govern DAO)"
              placeholder={getEmptyAddress()}
              ref={addressRef}
              onChange={handleAddressChange}
              value={governAddress}
              error={addressError}
              noFieldMargin
            />
            <Info mode="warning">
              Make sure your{' '}
              <b
                css={`
                  font-weight: 700;
                `}
              >
                Aragon Govern Executor
              </b>{' '}
              address is correct, otherwise you might send all your funds to an
              invalid address and lose access to them
            </Info>
            <StyledButton mode="strong" onClick={handleMigration}>
              Create Proposal
            </StyledButton>

            <Info>
              By following the instructions and executing the script you will be
              creating a proposal that will be available to be voted in your
              DAO. Once it is approved and executed,{' '}
              <b
                css={`
                  font-weight: 700;
                `}
              >
                all your DAO funds
              </b>{' '}
              will be transferred to the new DAO Govern Executor address, and
              the new DAO will be entitled to receive the KPI options. The
              options will be sent to the same Aragon Govern Executor address
              within 10 days from the migration. You can consult the amount of
              the option in{' '}
              <StyledLink href={GOVERN_REWARD_URL}>
                upgrade.aragon.org/governReward
              </StyledLink>
            </Info>
            {networkType && (
              <Label
                theme={theme}
                css={`
                  margin-top: ${2 * GU}px;
                `}
              >
                Don't have a Aragon Govern DAO?{' '}
                <StyledLink href={getCreateOneUrl(networkType)}>
                  Create one
                </StyledLink>
                .
              </Label>
            )}
          </div>
        </Box>
      </React.Fragment>
    </React.Fragment>
  )
})

const Label = styled.label`
  color: ${props => props.theme.content};
  display: block;
  margin-bottom: ${2 * GU}px;
  ${textStyle('body2')}
`

const StyledLink = styled(Link)`
  text-decoration: none;
`

const SubTitle = styled.div`
  ${textStyle('body2')};
  margin-bottom: ${3 * GU}px;
`

const List = styled.ul`
  list-style: none;
  display: grid;
  grid-template-columns: minmax(50%, 1fr) minmax(50%, 1fr);
  grid-column-gap: ${2 * GU}px;
  margin-bottom: ${2 * GU}px;
  & > li {
    margin-bottom: ${3 * GU}px;
  }
`

const StyledButton = styled(Button)`
  margin: ${3 * GU}px 0;
`

const ListItemLabel = styled.label`
  color: ${props => props.theme.surfaceContentSecondary};
  ${unselectable()};
  ${textStyle('label2')};
`

const IdentityBadgeContainter = styled.div`
  margin-top: ${1 * GU}px;
`

GovernMigration.propTypes = {
  apps: PropTypes.arrayOf(AppType).isRequired,
  appsLoading: PropTypes.bool.isRequired,
  daoAddress: DaoAddressType.isRequired,
  wrapper: AragonType,
}

export default GovernMigration
