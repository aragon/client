import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { breakpoint } from '@aragon/ui'

const Section = ({ title, children }) => (
  <Main>
    <h1>{title}</h1>
    {children}
  </Main>
)

Section.propTypes = {
  children: PropTypes.node.isRequired,
  title: PropTypes.string.isRequired,
}

const Main = styled.section`
  margin-bottom: 30px;

  > h1 {
    margin: 30px;
  }

  ${breakpoint(
    'medium',
    `
      margin-bottom: 0;

      > h1 {
        margin: 0;
        margin-bottom: 30px;
        font-weight: 600;
      }

      & + & {
        margin-top: 50px;
      }
    `
  )}
`
export default Section
