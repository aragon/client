import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import remark from 'remark'
import remark2react from 'remark-react'
import { Link, GU, textStyle, useTheme } from '@aragon/ui'

const Markdown = React.memo(({ text }) => {
  const theme = useTheme()

  return (
    <Wrapper theme={theme}>
      {
        /* eslint-disable react/prop-types */
        remark()
          .use(remark2react, {
            remarkReactComponents: {
              a: ({ children, ...props }) => (
                <Link external {...props}>
                  {children}
                </Link>
              ),
            },
          })
          .processSync(text).contents
        /* eslint-enable react/prop-types */
      }
    </Wrapper>
  )
})

Markdown.propTypes = {
  text: PropTypes.string,
}

Markdown.defaultProps = {
  text: '',
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

export default Markdown
