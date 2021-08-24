import React, { useState, useCallback, useRef, useMemo, useEffect } from 'react'
import PropTypes from 'prop-types'
import GenerateMigration from "@aragon/v2-migrator-script/build"
import { getDefaultProvider, Wallet, Contract, providers } from 'ethers'
import { getNetworkConfig } from '../../network-config'
import { usePermissionsByRole } from '../../contexts/PermissionsContext'
import { Modal } from '@aragon/ui'

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
import { AppType, DaoAddressType } from '../../prop-types'
import {
  getEmptyAddress,
  toChecksumAddress,
  isAddress,
  isEmptyAddress,
} from '../../web3-utils'
import styled from 'styled-components'
import { NETWORK_TYPE } from '../../NetworkType'
import { useWallet } from '../../wallet'
import AddressField from '../../components/AddressField/AddressField'
import { InvalidAddress, RequiredField } from '../../errors'

const GOVERN_REWARD_URL = 'https://upgrade.aragon.org/governreward'
const MIGRATE_REWARD_URL =
  'https://help.aragon.org/article/99-aragon-govern-migration-reward-program'

function getCreateOneUrl(networkType) {
  return `https://govern${
    networkType === NETWORK_TYPE.main ? '' : '-' + networkType
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
}) {
  const theme = useTheme()
  const { layoutName } = useLayout()
  const { networkType } = useWallet()

  const [governAddress, setGovernAddress] = useState('')
  const [addressError, setAddressError] = useState(null)
  const addressRef = useRef(null)

  const [orgsByName, setOrgsByName] = useState([]);

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
    orgs.forEach(item => orgsbyKey[item.name.toLowerCase()] = item.proxyAddress)
    setOrgsByName(orgsbyKey)

    return orgs
  }, [apps, checksummedDaoAddr])

  const handleAddressChange = useCallback(e => {
    const address = e.target.value
    setGovernAddress(address)
    setAddressError(validateAddress(address))
  }, [])
  
  const [opened, setOpened] = useState(false)
  const [calldata, setCalldata] = useState('')
  const close = () => setOpened(false)

  const handleMigration = useCallback(async () => {
    const error = validateAddress(governAddress)
    setAddressError(error)
    if(error) return;
    
    if(!orgsByName.voting) {
      setAddressError("Internal error. Please contact us.")
      return
    }

    const governExecutorProxy = getNetworkConfig(networkType).addresses.governExecutorProxy

    if(!governExecutorProxy) {
      setAddressError(`on the ${networkType} chain, migration is not supported.`)
      return
    }

    // figure out if token manager and any address can create a vote
    let votePermissions = permissions.filter(permission => permission.role.id === 'CREATE_VOTES_ROLE')
    let anyoneNewVote = false
    let tokenManagerNewVote = false

    if(votePermissions.length > 0) {
      const entities = votePermissions[0].entities || []
      anyoneNewVote = entities.filter(entity => entity.type === 'any').length > 0
      tokenManagerNewVote = entities.filter(entity => entity.app?.name === 'Tokens').length > 0
    }

    const migrationParams = {
      address: governAddress,
      voting: orgsByName.voting,
      executor: governAddress,
      finance: orgsByName.finance,
    }

    let toAddress = ''
    const separator = '__'

    if(anyoneNewVote) {
      toAddress = orgsByName.voting
    } else if(tokenManagerNewVote) {
      toAddress = orgsByName.tokens
      migrationParams.tokenManager = orgsByName.tokens
    } else {
      setAddressError(`There's no correct CREATE_NEW_VOTE permission on the Voting app`)
      return
    }
    
    let calldatas = ''
    let calldata = ''

    // NOTE: Below code assumes that it's possible to have both Vault and Agent
    // which store their own balances separately.. Below makes sure to create
    // 2 transactions for the migration. Currently, Templates don't have this option
    // meaning that balance can be on one of them only, hence we only will have 1 transaction.

    // checks if the funds exist on vault and if it does
    // generates the calldata
    if(orgsByName.vault) {
      calldata = await GenerateMigration(networkType,  {
        ...migrationParams,
        vault: orgsByName.vault
      })

      if(calldata) {
        calldatas += calldata
      }
    }
    
    // if the agent is installed, checks if the funds exist on it
    // and generates the calldata if it does.
    if(orgsByName.agent) {
      calldata = await GenerateMigration(networkType,  {
        ...migrationParams,
        vault: orgsByName.agent
      })

      if(calldata) {
        calldatas = calldatas === '' ? calldata : `${calldatas}${separator}${calldata}`
      }
    }

    // if the calldatas is empty, it means funds were not found
    // on neither agent nor vault.
    if(calldatas === '') {
      setAddressError(`Migration is not possible because there's no funds on this dao`)
      return
    }
    
    setCalldata(`${toAddress}${separator}${calldatas}`)
    setOpened(true)

  }, [governAddress])

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
              placeholder={getEmptyAddress()}
              ref={addressRef}
              onChange={handleAddressChange}
              value={governAddress}
              error={addressError}
            />
            The address of the DAO Executor (available in the settings tab of your new Aragon Govern DAO)
            <Info mode="warning">
              Make sure your <b>Aragon Govern Executor</b> address is correct,
              otherwise you might send all your funds to an invalid address and
              lose access to them
            </Info>
            <StyledButton mode="strong" onClick={handleMigration}>
              Generate Migration
            </StyledButton>
            <Label theme={theme}>
              Once migration script is generated, follow{' '}
                <StyledLink href="https://github.com/aragon/kpi-migration">
                  these instructions
                </StyledLink>{' '}
                to create a proposal to execute it.
            </Label>
            {networkType && (
              <Label theme={theme}>
                Don't have a Aragon Govern DAO?{' '}
                <StyledLink href={getCreateOneUrl(networkType)}>
                  Create one
                </StyledLink>
                .
              </Label>
            )}
            <Modal visible={opened} onClose={close}>
              <div
                css={`
                  overflow: scroll;
                  padding: 0 24px;
                  h1,
                  p {
                    margin: 24px 0;
                  }
                  h1 {
                    font-size: 24px;
                  }
                `}
              >
              <h1
                css={`
                  display: flex;
                  align-items: center;
                  gap: 10px;
                `}
              >
                <span>Copy this and follow the below instructions </span>
              </h1>
              <p>
                { calldata }
              </p>
        </div>
            </Modal>
            <Info>
              By executing this you will be creating a proposal that will be
              voted in your DAO. Once it is approved and executed,{' '}
              <b>all your DAO funds</b> will be transfered to the new DAO Govern
              Executor address, and the new DAO will be entitled to receive the
              KPI options. The options will be sent to the same Aragon Govern
              Executor address within 10 days from the migration. You can
              consult the options amount in{' '}
              <StyledLink href={GOVERN_REWARD_URL}>
                governreward.aragon.org
              </StyledLink>
            </Info>
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
}

export default GovernMigration
