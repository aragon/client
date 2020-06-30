import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Markdown, textStyle, useTheme, GU } from '@aragon/ui'

const ContentMarkdown = React.memo(({ content }) => {
  const theme = useTheme()

  return (
    <Wrapper theme={theme}>
      <Markdown content={content} />
    </Wrapper>
  )
})

ContentMarkdown.propTypes = {
  content: PropTypes.string,
}

ContentMarkdown.defaultProps = {
  content: '',
}

const Wrapper = styled.section`
  margin-top: ${1 * GU}px;
  padding-right: ${1 * GU}px;
  h2,
  h3,
  h4 {
    font-weight: bold;
    margin-top: ${3 * GU}px;
    ${textStyle('label2')};
    color: ${({ theme }) => theme.contentSecondary};
  }

  p,
  li {
    margin: ${1 * GU}px 0;
  }

  ul {
    margin: ${1 * GU}px ${2 * GU}px;
    list-style: none;
  }

  ul li::before {
    content: '•';
    color: ${({ theme }) => theme.accent};
    font-weight: bold;
    display: inline-block;
    width: 1em;
    margin-left: -1em;
  }
`

export default ContentMarkdown
