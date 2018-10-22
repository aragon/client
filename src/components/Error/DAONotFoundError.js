import React from 'react'
import { SafeLink, theme } from '@aragon/ui'
import styled from 'styled-components'
import ErrorCard from './ErrorCard'

const { accent } = theme

const CURRENT_DOMAIN = 'app.aragon.org'
const OLD_DAO_DOMAIN = 'app-v05.aragon.org'
const DEPRECATION_URL =
  'https://blog.aragon.org/deprecation-notice-on-v0-5-rinkeby-daos'

const DAONotFoundError = ({ dao }) => (
  <ErrorCard title="DAO not found">
    Rinkeby DAOs created with Aragon Core 0.5 were deprecated on{' '}
    <time dateTime="2018-10-29">Oct. 29, 2018</time> due to{' '}
    <StyledSafeLink href={DEPRECATION_URL} target="_blank">
      underlying smart contract upgrades with aragonOS
    </StyledSafeLink>
    . If you were trying to access a DAO created before{' '}
    <time dateTime="2018-10-29">Oct. 29, 2018</time>, you can access it at{' '}
    <StyledSafeLink
      href={`https://${OLD_DAO_DOMAIN}/${dao ? `#/${dao}` : ''}`}
      target="_blank"
    >
      {OLD_DAO_DOMAIN}
    </StyledSafeLink>{' '}
    until <time dateTime="2019-03">March, 2019</time>
    .
    <br />
    <br />
    However, we recommend creating a new DAO at{' '}
    <StyledSafeLink href={`https://${CURRENT_DOMAIN}`} target="_blank">
      {CURRENT_DOMAIN}
    </StyledSafeLink>
    .
  </ErrorCard>
)

const StyledSafeLink = styled(SafeLink)`
  text-decoration-color: ${accent};
  color: ${accent};
`
export default DAONotFoundError
