import React from 'react'
import { Box, textStyle, GU } from '@aragon/ui'
import Markdown from '../../components/Markdown/Markdown'

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

function AgreementDoc() {
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
            DAO Agreement
          </h1>
        </header>

        <main>
          <Markdown text={exampleDoc} />
        </main>
      </article>
    </Box>
  )
}

export default AgreementDoc
