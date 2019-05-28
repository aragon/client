import React from 'react'
import styled from 'styled-components'
import { Text } from '@aragon/ui'
import CardWrapper from '../wrappers/styleWrappers/CardWrapper'

const addMore = () => console.log('add more orgs')

const OrganizationPanel = () => {
  return (
    <CardWrapper title="Organisations" addMore={addMore}>
      <Center>
        <Text color="grey">Coming Soon</Text>
      </Center>
    </CardWrapper>
  )
}

const Center = styled.div`
  display: flex;
  justify-content: center;
  line-height: 7;
`

export default OrganizationPanel
