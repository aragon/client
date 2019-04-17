import React from 'react'
import PropTypes from 'prop-types'
import { ExternalLink, theme } from '@aragon/ui'
import { RepoType } from '../../prop-types'
import { GU, imgSrcFromBase } from '../../utils'

class Screenshots extends React.Component {
  static propTypes = {
    repo: RepoType.isRequired,
    screenshots: PropTypes.arrayOf(
      PropTypes.shape({
        src: PropTypes.string.isRequired,
      })
    ).isRequired,
  }
  render() {
    const {
      screenshots,
      repo: { baseUrl },
    } = this.props
    return (
      <div
        css={`
          overflow-x: auto;
        `}
      >
        <div
          css={`
            display: flex;
            width: 100%;
            padding-bottom: ${3 * GU}px;
          `}
        >
          {screenshots.map(({ src }, index) => {
            const url = imgSrcFromBase(baseUrl, src)
            return (
              <ExternalLink
                href={url}
                css={`
                  flex-grow: 0;
                  flex-shrink: 0;
                  margin-left: 24px;
                  border: 1px solid ${theme.contentBorder};
                  outline: 0;
                  &:focus {
                    outline: 2px solid ${theme.accent};
                  }
                  &:first-child {
                    margin-left: 0;
                  }
                `}
              >
                <img
                  key={src}
                  src={url}
                  alt=""
                  width="198"
                  height="120"
                  css={`
                    display: block;
                  `}
                />
              </ExternalLink>
            )
          })}
        </div>
      </div>
    )
  }
}

export default Screenshots
