import React from 'react'
import styled from 'styled-components'

const Section = ({ title, children }) => (
  <Main>
    <h1>{title}</h1>
    {children}
  </Main>
)

const Main = styled.section`
  > h1 {
    margin-bottom: 30px;
    font-weight: 600;
  }
  & + & {
    margin-top: 50px;
  }
`
export default Section
