import React from 'react'
import styled from 'styled-components'
import { Motion, spring } from 'react-motion'
import { spring as springConf } from '@aragon/ui'
import { lerp } from '../math-utils'
import { noop } from '../utils'
import { Multisig, Democracy } from './templates'

import ConfigureDemocracy from './ConfigureDemocracy'
// import ConfigureMultisig from './ConfigureMultisig'

class Configure extends React.PureComponent {
  static defaultProps = {
    template: null,
    onConfigureDone: noop,
  }
  handleOnConfigureDone = conf => {
    this.props.onConfigureDone(conf)
  }
  render() {
    const { visible, direction, template } = this.props
    return (
      <Motion
        style={{
          showProgress: spring(Number(visible), springConf('slow')),
        }}
      >
        {({ showProgress }) => (
          <Main
            style={{
              pointerEvents: visible ? 'auto' : 'none',
              opacity: showProgress,
            }}
          >
            <Content
              style={{
                transform: `translateX(${lerp(
                  showProgress,
                  50 * (visible ? direction : -direction),
                  0
                )}%)`,
              }}
            >
              {this.renderTemplate(template)}
            </Content>
          </Main>
        )}
      </Motion>
    )
  }
  renderTemplate(template) {
    const { visible } = this.props

    if (!template || !visible) return null

    if (template === Democracy) {
      return (
        <ConfigureDemocracy
          ref={screen => this.props.onConfigureScreen(screen)}
          visible={visible}
          onConfigureDone={this.handleOnConfigureDone}
        />
      )
    }

    if (template === Multisig) {
      return null
    }
  }
}

const Main = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: center;
  width: 100%;
  height: 100%;
  padding: 100px;
  padding-top: 140px;
`

const Content = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`

export default Configure
