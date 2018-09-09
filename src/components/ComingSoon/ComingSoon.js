import React from 'react'
import styled from 'styled-components'
import { Text, theme } from '@aragon/ui'
import AppLayout from '../../components/AppLayout/AppLayout'
import logo from '../Home/assets/logo-background.svg'

class ComingSoon extends React.Component {
  render() {
    const { title, subtitle, endContent, children } = this.props
    return (
      <AppLayout title={title} endContent={endContent}>
        <Main>
          <Title>
            <h1>
              <Text size="great" weight="bold">
                Coming Soon
              </Text>
            </h1>
          </Title>
          <p>
            <Text color={theme.textSecondary}>{subtitle}</Text>
          </p>
          {children}
        </Main>
      </AppLayout>
    )
  }
}

const Main = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding-bottom: 54px;
  background-color: ${theme.mainBackground};
  background-image: url(${logo});
  background-position: 50% 50%;
  background-repeat: no-repeat;
`

const Title = styled.div`
  margin-bottom: 30px;
`

export default ComingSoon
