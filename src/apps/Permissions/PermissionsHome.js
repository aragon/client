import React from 'react'
import List from './List'
import { styled } from '@aragon/ui'

const PermissionsHome = ({ appItems, entities, onInstanceClick }) => (
  <Content>
    <ContentColumn>
      <List title="Apps" items={appItems} onClick={onInstanceClick} />
    </ContentColumn>
    <ContentColumn>
      <List title="Entities" items={entities} />
    </ContentColumn>
  </Content>
)

const Content = styled.div`
  display: flex;
  width: 100%;
  min-width: 600px;
  padding: 40px;
`

const ContentColumn = styled.div`
  width: 50%;
  & + & {
    margin-left: 30px;
  }
`

export default PermissionsHome
