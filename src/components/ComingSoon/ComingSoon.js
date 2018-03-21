import React from 'react'
import styled from 'styled-components'
import { Text, theme } from '@aragon/ui'
import AppLayout from '../../components/AppLayout/AppLayout'

class ComingSoon extends React.Component {
  render() {
    const { title, subtitle } = this.props
    return (
      <AppLayout title={title}>
        <Main>
          <Title>
            <h1>
              <Text size="great" weight='bold'>Coming Soon</Text>
            </h1>
          </Title>
          <p>
            <Text color={theme.textSecondary}>{subtitle}</Text>
          </p>
        </Main>
      </AppLayout>
    )
  }
}

const Main = styled.div`
  margin-top: 60px;
  text-align: center;
`

const Title = styled.div`
  margin-bottom: 30px;
`

export default ComingSoon
