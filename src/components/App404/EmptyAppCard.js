import React from 'react'
import { styled, EmptyStateCard } from '@aragon/ui'
import notFoundIcon from './assets/not-found.svg'

const EmptyAppCard = ({ onActivate }) => (
  <StyledEmptyStateCard
    actionText="Go back"
    icon={NotFoundIcon}
    onActivate={onActivate}
    text="Are you trying to access an Aragon app that is not installed?"
    title="Error: unknown app."
  />
)

const StyledEmptyStateCard = styled(EmptyStateCard)`
  padding: 40px 20px;
  margin-bottom: 15px;
`

const NotFoundIcon = () => (
  <img width="60" height="60" src={notFoundIcon} alt="" />
)

export default EmptyAppCard
