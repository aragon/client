import React from 'react'
import PropTypes from 'prop-types'
import { theme } from '@aragon/ui'
import { GU } from '../../utils'

class Screenshots extends React.Component {
  static propTypes = {
    screenshots: PropTypes.arrayOf(PropTypes.string),
  }
  state = {
    currentScreenshot: -1,
  }
  open(index) {
    this.setState({ currentScreenshot: index })
  }
  close() {
    this.setState({ currentScreenshot: -1 })
  }
  render() {
    const { screenshots } = this.props
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
          {screenshots.map((url, index) => (
            <img
              onClick={() => this.open(index)}
              key={url}
              src={url}
              alt=""
              width="198"
              height="120"
              css={`
                flex-grow: 0;
                flex-shrink: 0;
                display: block;
                margin-left: 24px;
                border: 1px solid ${theme.contentBorder};
                &:first-child {
                  margin-left: 0;
                }
              `}
            />
          ))}
        </div>
      </div>
    )
  }
}

export default Screenshots
