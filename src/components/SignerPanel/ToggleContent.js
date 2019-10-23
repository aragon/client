import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { IconDown, GU, springs, textStyle, useTheme } from '@aragon/ui'
import { Transition, animated } from 'react-spring'

export default class ToggleContent extends React.Component {
  static propTypes = {
    labelOpen: PropTypes.string.isRequired,
    labelClosed: PropTypes.string.isRequired,
    children: PropTypes.node.isRequired,
  }

  state = { opened: false }
  handleClick = () => {
    this.setState(({ opened }) => ({
      opened: !opened,
    }))
  }
  render() {
    const { opened } = this.state
    const { labelOpen, labelClosed, children } = this.props
    return (
      <div>
        <Label onClick={this.handleClick}>
          {opened ? labelOpen : labelClosed}{' '}
          <div
            css={`
              display: flex;
              align-items: center;
              padding: 0 ${1 * GU}px;
              transition: transform 150ms ease-in-out;
              transform: rotate3d(0, 0, 1, ${opened ? 180 : 0}deg);
            `}
          >
            <IconDown size="tiny" />
          </div>
        </Label>

        <Transition
          items={opened}
          config={springs.swift}
          from={{ height: 0, opacity: 0 }}
          enter={{ height: 'auto', opacity: 1 }}
          leave={{ height: 0, opacity: 0 }}
          native
        >
          {show =>
            show && (props => <Content style={props}>{children}</Content>)
          }
        </Transition>
      </div>
    )
  }
}

function Label(props) {
  const theme = useTheme()
  return (
    <button
      type="button"
      css={`
        cursor: pointer;
        background: none;
        border: 0;
        outline: 0;
        padding: 0;
        display: flex;
        align-items: center;
        ${textStyle('label2')}
        color: ${theme.surfaceContentSecondary};
        margin-bottom: ${2 * GU}px;
      `}
      {...props}
    />
  )
}

const Content = styled(animated.div)`
  max-height: 360px;
  overflow: hidden;
  overflow-y: scroll;
`
