import React from 'react'
import styled from 'styled-components'
import { Text } from '@aragon/ui'

const Container = styled.div`
  padding: 30px 0;
  border-top: 1px solid #e8e8e8;

  &:first-child {
    padding-top: 0;
    border: none;
  }
  &:last-child {
    padding-bottom: 0;
  }
`

const Header = styled.h2`
  margin-bottom: 15px;
`

const SubText = styled(Text.Paragraph)`
  margin-bottom: 15px;
`

const Option = ({ children, name, text, ...props }) => (
  <Container {...props}>
    <Header>
      <Text size="large" weight="bold">
        {name}
      </Text>
    </Header>
    <SubText>{text}</SubText>
    {children}
  </Container>
)

export default Option
