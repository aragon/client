import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Box, Markdown, textStyle, useTheme, GU } from '@aragon/ui'

function AgreementDocument({ content }) {
  const theme = useTheme()

  return (
    <Box>
      <article>
        <Wrapper theme={theme}>
          <Markdown content={content} />
        </Wrapper>
      </article>
    </Box>
  )
}

const Wrapper = styled.main`
  overflow-y: auto;
  max-height: ${100 * GU}px;
  padding-right: ${4 * GU}px;

  h1 {
    text-align: center;
    margin-top: ${2 * GU}px;
    margin-bottom: ${4 * GU}px;

    ${textStyle('title2')};
  }

  h2,
  h3,
  h4 {
    margin-top: ${3 * GU}px;
  }

  h2 {
    ${textStyle('title4')};
  }

  h3 {
    ${textStyle('body1')};
  }

  h4 {
    ${textStyle('body2')};
  }

  p,
  li {
    margin: ${1 * GU}px 0;
  }

  ul,
  ol {
    padding: 0;
    margin: ${2 * GU}px ${3 * GU}px;
  }

  ul {
    list-style: none;

    li::before {
      content: '•';
      color: ${({ theme }) => theme.accent};
      font-weight: bold;
      display: inline-block;
      width: 1em;
      margin-left: -1em;
    }
  }
`

AgreementDocument.propTypes = {
  content: PropTypes.string.isRequired,
}

export default AgreementDocument
