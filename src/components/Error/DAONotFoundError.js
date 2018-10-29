import React from 'react'
import styled from 'styled-components'
import { SafeLink, theme } from '@aragon/ui'
import ErrorCard from './ErrorCard'
import { network } from '../../environment'
import { isAddress } from '../../web3-utils'

const { accent } = theme

const CURRENT_DOMAIN = 'app.aragon.org'
const OLD_DAO_DOMAIN = 'app-v05.aragon.org'
const DEPRECATION_URL =
  'https://blog.aragon.org/deprecation-notice-on-v0-5-rinkeby-daos'

const DAONotFoundError = ({ dao }) => (
  <ErrorCard title="Organization not found">
    {network.type === 'rinkeby' ? (
      <RinkebyDAONotFoundContent dao={dao} />
    ) : (
      <GenericDAONotFoundContent />
    )}
  </ErrorCard>
)

const GenericDAONotFoundContent = ({ dao }) => (
  <React.Fragment>
    <Paragraph>
      It looks like there's no organization associated with that{' '}
      {isAddress(dao) ? 'address' : 'name'} on the current network (
      {network.name}
      ).
    </Paragraph>
    <Paragraph>
      If you got here through a link, please double check that you were given
      the correct link.
    </Paragraph>
    <Paragraph>
      Alternatively, you may create a new organization at{' '}
      <StyledSafeLink href={`https://${CURRENT_DOMAIN}`} target="_blank">
        {CURRENT_DOMAIN}
      </StyledSafeLink>
      .
    </Paragraph>
  </React.Fragment>
)

const RinkebyDAONotFoundContent = ({ dao }) => (
  <React.Fragment>
    <Paragraph>
      Rinkeby organizations created with Aragon Core 0.5 were deprecated on{' '}
      <time dateTime="2018-10-29">Oct. 29, 2018</time> due to{' '}
      <StyledSafeLink href={DEPRECATION_URL} target="_blank">
        underlying smart contract upgrades with aragonOS
      </StyledSafeLink>
      .
    </Paragraph>
    <Paragraph>
      If you were trying to access an organization created before{' '}
      <time dateTime="2018-10-29">Oct. 29, 2018</time>, you can access it at{' '}
      <StyledSafeLink
        href={`https://${OLD_DAO_DOMAIN}/${dao ? `#/${dao}` : ''}`}
        target="_blank"
      >
        {OLD_DAO_DOMAIN}
      </StyledSafeLink>{' '}
      until <time dateTime="2019-03">March, 2019</time>.
    </Paragraph>
    <Paragraph>
      However, we recommend creating a new organization at{' '}
      <StyledSafeLink href={`https://${CURRENT_DOMAIN}`} target="_blank">
        {CURRENT_DOMAIN}
      </StyledSafeLink>
      .
    </Paragraph>
  </React.Fragment>
)

const Paragraph = styled.p`
  & + & {
    margin-top: 10px;
  }
`

const StyledSafeLink = styled(SafeLink)`
  text-decoration-color: ${accent};
  color: ${accent};
`
export default DAONotFoundError
