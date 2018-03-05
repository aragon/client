import React from 'react'
import styled from 'styled-components'
import { Motion, spring } from 'react-motion'
import {
  theme,
  spring as springConf,
  Text,
} from '@aragon/ui'
import { noop } from '../utils'
import { lerp } from '../math-utils'
import TemplateCard from './TemplateCard'

import imgBlank from './assets/template-blank.svg'
import imgStartup from './assets/template-startup.svg'
import imgDemocracy from './assets/template-democracy.svg'
import imgMultisig from './assets/template-multisig.svg'

const TEMPLATES = [
  ['Blank', imgBlank],
  ['Startup', imgStartup],
  ['Token project with democracy', imgDemocracy],
  ['Token project with multisig', imgMultisig],
]

class Template extends React.Component {
  static defaultProps = {
    onSelect: noop,
  }
  state = {
    canHide: false,
    selected: -1,
  }
  handleRest = () => {
    this.setState({
      canHide: !this.props.visible,
    })
  }
  handleTemplateSelect = index => {
    this.setState({ selected: index })
    this.props.onSelect(index)
  }
  render() {
    const { visible, direction } = this.props
    const { selected } = this.state
    return (
      <Motion
        style={{
          showProgress: spring(Number(visible), springConf('slow')),
        }}
        onRest={this.handleRest}
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
                  50 * (visible? direction : -direction),
                  0
                )}%)`,
              }}
            >
              <Title>
                <Text size="great" weight="bold" color={theme.textDimmed}>
                  Create a new organisation
                </Text>
              </Title>

              <p>
                <Text size="large" color={theme.textSecondary}>
                  Choose a template to get started quickly. Don’t worry - you
                  can change it later
                </Text>
              </p>

              <Templates>
                {TEMPLATES.map(([label, img], i) => (
                  <TemplateCardWrapper key={i}>
                    <TemplateCard
                      index={i}
                      img={img}
                      label={label}
                      active={i === selected}
                      onSelect={this.handleTemplateSelect}
                    />
                  </TemplateCardWrapper>
                ))}
              </Templates>
            </Content>
          </Main>
        )}
      </Motion>
    )
  }
}

const Main = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  padding: 100px;
`

const Content = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`

const Title = styled.h1`
  font-size: 37px;
  margin-bottom: 40px;
`

const Templates = styled.div`
  display: flex;
  margin-top: 50px;
`

const TemplateCardWrapper = styled.div`
  & + & {
    margin-left: 25px;
  }
`

export default Template
