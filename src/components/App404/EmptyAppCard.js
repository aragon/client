import React from 'react'
import styled from 'styled-components'
import { EmptyStateCard } from '@aragon/ui'
import notFoundIcon from './assets/not-found.svg'
import NotFound from '../NotFound/NotFoundCard'

// <StyledEmptyStateCard
//   actionText="Go back"
//   icon={NotFoundIcon}
//   onActivate={onActivate}
//   text="Are you trying to access an Aragon app that is not installed?"
//   title="Error: unknown app."
// />

const EmptyAppCard = ({ onActivate }) => (
  <NotFound detailsContent="fdkdh"></NotFound>
)

const StyledEmptyStateCard = styled(EmptyStateCard)`
  padding: 40px 20px;
  margin-bottom: 15px;
`

const NotFoundIcon = () => (
  <img width="60" height="60" src={notFoundIcon} alt="" />
)

export default EmptyAppCard
