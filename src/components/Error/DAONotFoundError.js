import React from 'react'
import styled from 'styled-components'
import { theme, Button } from '@aragon/ui'
import ErrorCard from './ErrorCard'
import { network } from '../../environment'
import { isAddress } from '../../web3-utils'

const DAONotFoundError = ({ dao }) => (
  <ErrorCard title="Organization not found">
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
      Alternatively, you may{' '}
      <StyledLink href="/">create a new organization</StyledLink>.
    </Paragraph>
    <ButtonBox>
      <IssueLink mode="text" href="/" style={{ color: theme.textSecondary }}>
        Back
      </IssueLink>
      <ButtonsSpacer />
      <Button
        mode="strong"
        onClick={() => {
          window.location.reload(true)
        }}
        compact
      >
        Try again
      </Button>
    </ButtonBox>
  </ErrorCard>
)

const Paragraph = styled.p`
  & + & {
    margin-top: 10px;
  }
`

const StyledLink = styled.a`
  text-decoration-color: ${theme.accent};
  color: ${theme.accent};
`

const ButtonsSpacer = styled.span`
  width: 10px;
`

const ButtonBox = styled.div`
  margin: 20px 0 0 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
`

const IssueLink = styled(Button.Anchor)`
  margin-left: -10px;
  color: ${theme.textSecondary};
  text-decoration: none;
  &:hover {
    color: ${theme.textPrimary};
  }
`

export default DAONotFoundError
