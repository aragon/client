import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Box, Markdown, textStyle, useTheme, GU } from '@aragon/ui'

const exampleDoc = `
## Section 1. Background
The Ethical DAO is an internet-based jurisdiction that provides reliable dispute resolution services and other critical infrastructure to internet-based individuals and organizations.

The Ethical DAO is governed by Ethical Network Token (ENT) holders, who supported the initial creation of the jurisdiction and now continue to guide its evolution through established governance processes.

This Agreement exists to enumerate the shared mission, values, and constraints that bind ENT holders in their collaborative effort to create value for each other and for Aragon Network subscribers.
Section 1. RFC 2119 compliance
The key words "MUST", "MUST NOT", "REQUIRED", "SHALL", "SHALL NOT", "SHOULD", "SHOULD NOT", "RECOMMENDED",  "MAY", and "OPTIONAL" in this document are to be interpreted as described in RFC 2119.

## Section 2. Immutable guidelines
The following guidelines cannot be changed. If any other guidelines conflict with these immutable guidelines, the immutable guidelines shall take priority for enforcement purposes.

### 1. ANT holder guidelines
These guidelines apply to all holders of ENT.

ANT holders SHALL NOT hold any other ENT holder liable in any jurisdiction other than the Aragon Network and Aragon Court for any action taken in the Aragon Network.


In case of any dispute between one or more ENT holders and one or more other ENT holders pertaining to action taken in the Aragon Network, such dispute SHALL be settled in Aragon Court according to this Agreement. ANT holders SHALL NOT attempt to settle such dispute in any venue other than Aragon Court, and any venue that hears such dispute SHOULD dismiss the dispute on the basis of this Agreement.

### 2. Proposal guidelines
These guidelines apply to all proposals put forth to the Ethical Network organization`

function AgreementDocument({ title }) {
  const theme = useTheme()

  return (
    <Box>
      <article>
        <header>
          <h1
            css={`
              ${textStyle('title2')};
              text-align: center;
              margin-bottom: ${3 * GU}px;
            `}
          >
            {title}
          </h1>
        </header>

        <Wrapper theme={theme}>
          <Markdown content={exampleDoc} />
        </Wrapper>
      </article>
    </Box>
  )
}

const Wrapper = styled.main`
  overflow-y: auto;
  max-height: ${100 * GU}px;

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

AgreementDocument.propTypes = {
  title: PropTypes.string,
}

export default AgreementDocument
