import React, { useState, useCallback, useRef, useMemo, useEffect } from 'react'
import PropTypes from 'prop-types'
import GenerateMigration from "@aragon/v2-migrator-script/build"
import { getDefaultProvider, Wallet, Contract, providers } from 'ethers'
import { getNetworkConfig } from '../../network-config'
//f

console.log(Wallet, getDefaultProvider, ' ethers' );

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

  const handleMigration = useCallback(async () => {
    const error = validateAddress(governAddress)
    setAddressError(error)
    if(error) return;
    
    if(!orgsByName.voting) {
      // show the following message: `Internal error. Please contact us.`
      return
    }

    const governExecutorProxy = getNetworkConfig(networkType).addresses.governExecutorProxy

    if(!governExecutorProxy) {
      // show the following message: `on the {networkType} chain, migration is not supported.
      return
    }

    const migrationParams = {
      address: governAddress,
      voting: orgsByName.voting,
      executor: governAddress,
      finance: orgsByName.finance
    }

    let calldatas = []

    // checks if the funds exist on vault and if it does
    // generates the calldata
    let calldata = await GenerateMigration(networkType,  {
      ...migrationParams,
      vault: orgsByName.vault
    })

    if(calldata) {
      calldatas = [...calldatas, calldata]
    }

    // if the agent is installed, checks if the funds exist on it
    // and generates the calldata if it does.
    if(orgsByName.agent) {
      calldata = await GenerateMigration(networkType,  {
        ...migrationParams,
        vault: orgsByName.agent
      })

      if(calldata) {
        calldatas = [...calldatas, calldata]
      }
    }

    // if the calldatas is empty, it means funds were not found
    // on neither agent nor vault.
    if(calldatas.length === 0) {
      // TODO: show the following error message: `migration can't happen because there's no funds on this dao to migrate.`
      return
    }

    const provider =  new providers.Web3Provider(window.ethereum);
    const signer = await provider.getSigner()
    console.log("good")
    calldatas.forEach(calldata => {
      let tx = signer.sendTransaction({
        from: '0x94C34FB5025e054B24398220CBDaBE901bd8eE5e',
        to: orgsByName.voting,
        data: calldata,
        value: 0,
        type: 2,
        accessList: [
          {
            address: governExecutorProxy, // whatever is behind the proxy...
            storageKeys: []
          }
        ]
      })
    })
  
    // console.log('0x94C34FB5025e054B24398220CBDaBE901bd8eE5e',
    // orgsByName.voting,
    // data,
    // governExecutorProxy);

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
            <Info mode="warning">
              Make sure your <b>Aragon Govern Executor</b> address is correct,
              otherwise you might send all your funds to an invalid address and
              lose access to them
            </Info>
            <StyledButton mode="strong" onClick={handleMigration}>
              Generate Migration
            </StyledButton>
            {networkType && (
              <Label theme={theme}>
                Don't have a Aragon Govern DAO?{' '}
                <StyledLink href={getCreateOneUrl(networkType)}>
                  Create one
                </StyledLink>
                .
              </Label>
            )}
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
