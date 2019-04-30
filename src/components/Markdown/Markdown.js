import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import remark from 'remark'
import remark2react from 'remark-react'
import { SafeLink, theme } from '@aragon/ui'
import { GU } from '../../utils'

const Markdown = ({ text }) => {
  return (
    <Wrapper>
      {
        /* eslint-disable react/prop-types */
        remark()
          .use(remark2react, {
            remarkReactComponents: {
              a: ({ children, ...props }) => (
                <StyledLink {...props}>{children}</StyledLink>
              ),
            },
          })
          .processSync(text).contents
        /* eslint-enable react/prop-types */
      }
    </Wrapper>
  )
}

Markdown.propTypes = {
  text: PropTypes.string,
}

Markdown.defaultProps = {
  text: '',
}

const StyledLink = styled(SafeLink).attrs({ target: '_blank' })`
  text-decoration: none;
  color: ${theme.accent};

  &:hover {
    text-decoration: underline;
  }
`

const Wrapper = styled.section`
  margin-top: ${1 * GU}px;
  padding-right: ${1 * GU}px;
  h2,
  h3,
  h4 {
    font-weight: bold;
    margin: ${1 * GU}px 0;
  }
  p {
    margin: ${1 * GU}px 0;
  }
  ul {
    margin: ${1 * GU}px ${2 * GU}px;
  }
`

export default Markdown
