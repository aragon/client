import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

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
  > h1 {
    margin-bottom: 30px;
    font-weight: 600;
  }
  & + & {
    margin-top: 50px;
  }
`
export default Section
