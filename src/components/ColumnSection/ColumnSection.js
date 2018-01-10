import React from 'react'
import { styled, theme, Text, unselectable } from '@aragon/ui'

const ColumnSection = ({ title, shiftTitle, children }) => (
  <Main shiftTitle={shiftTitle}>
    <h1>
      <Text color={theme.textSecondary} weight="bold" smallcaps>
        {title}
      </Text>
    </h1>
    <div>{children}</div>
  </Main>
)

const Main = styled.section`
  ${unselectable};
  h1 {
    padding-left: ${({ shiftTitle }) => (shiftTitle ? '20px' : '0')};
    padding-bottom: 5px;
  }
`

export default ColumnSection
