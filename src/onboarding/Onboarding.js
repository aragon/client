import React from 'react'
import styled from 'styled-components'
import { Motion, spring } from 'react-motion'
import { noop } from '../utils'

import * as Steps from './steps'
import Templates from './templates'

import StepsBar from './StepsBar'
import PrevNext from './PrevNext'

import Start from './Start'
import Template from './Template'
import Domain from './Domain'
import Configure from './Configure'
import Launch from './Launch'

const SPRING_SHOW = {
  stiffness: 120,
  damping: 17,
  precision: 0.001,
}
const SPRING_HIDE = {
  stiffness: 70,
  damping: 15,
  precision: 0.001,
}

class Onboarding extends React.Component {
  static defaultProps = {
    visible: true,
    onComplete: noop,
  }
  state = {
    template: null,
    domain: '',
    configuration: null,
    configurationStep: 1,
    step: Steps.Start,
    direction: 1, // 1 = forward, -1 = backward
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.visible && !this.props.visible) {
      this.setState({ step: Steps.Start })
    }
  }
  handleStartCreate = () => {
    this.setState({
      step: Steps.Template,
      direction: 1,
    })
  }
  handleStartRest = () => {
    // Unset the template and the domain when the home screen finishes its
    // transition
    const { step } = this.state
    if (step === Steps.Start) {
      this.setState({ template: null, domain: '' })
    }
  }
  handleTemplateSelect = (template = null) => {
    this.setState({ template })
  }
  handleDomainChange = domain => {
    this.setState({ domain })
  }

  handleConfigureScreen = screen => {
    this.configureScreen = screen
  }

  handleConfigureDone = conf => {
    this.moveStep(1)
  }

  // Set the direction to 1 (next) or -1 (prev)
  moveStep = (direction = 1) => {
    const { step } = this.state
    const index = Steps.ProgressBarSteps.findIndex(
      ({ step: _step }) => _step === step
    )
    if (index === -1) {
      return
    }
    const newStepIndex = index + direction
    const newStepWrapper = Steps.ProgressBarSteps[index + direction]
    const newStep = newStepWrapper ? newStepWrapper.step : Steps.Start

    if (newStepIndex === Steps.ProgressBarSteps.length) {
      this.props.onComplete()
      return
    }

    if (!newStep) {
      return
    }

    // Arriving on the Configure step
    if (newStep !== step && newStep === Steps.Configure) {
      if (this.configureScreen) {
        this.configureScreen.reset()
        this.configureScreen = null
      }
      this.setState({
        configurationStep: 1,
        configuration: null,
      })
    }

    this.setState({ step: newStep, direction })
  }
  nextStep = () => {
    const { step } = this.state
    if (step === Steps.Configure && this.configureScreen) {
      this.configureScreen.nextStep()
      return
    }

    this.moveStep(1)
  }
  prevStep = () => {
    this.moveStep(-1)
  }
  isNextEnabled() {
    const { template, step, domain } = this.state
    if (step === Steps.Template && !template) {
      return false
    }
    if (step === Steps.Domain && !domain) {
      return false
    }
    return true
  }
  isPrevEnabled() {
    return true
  }
  render() {
    const { step, direction, template, domain } = this.state
    const { visible } = this.props
    const enableNext = this.isNextEnabled()
    const enablePrev = this.isPrevEnabled()
    return (
      <Motion
        style={{
          showProgress: spring(
            Number(visible),
            visible ? SPRING_SHOW : SPRING_HIDE
          ),
        }}
      >
        {({ showProgress }) => (
          <Main
            style={{
              transform: visible
                ? 'none'
                : `translateY(${100 * (1 - showProgress)}%)`,
              opacity: visible ? showProgress : 1,
            }}
          >
            <View>
              <Window>
                <StepsBar step={step} />
                <Screen active={step === Steps.Start}>
                  <Start
                    visible={step === Steps.Start}
                    onCreate={this.handleStartCreate}
                    onJoin={this.props.onComplete}
                    onRest={this.handleStartRest}
                  />
                </Screen>
                <Screen active={step === Steps.Template}>
                  <Template
                    visible={step === Steps.Template}
                    direction={direction}
                    templates={Templates}
                    activeTemplate={template}
                    onSelect={this.handleTemplateSelect}
                  />
                </Screen>
                <Screen active={step === Steps.Domain}>
                  <Domain
                    visible={step === Steps.Domain}
                    direction={direction}
                    domain={domain}
                    onDomainChange={this.handleDomainChange}
                  />
                </Screen>
                <Screen active={step === Steps.Configure}>
                  <Configure
                    visible={step === Steps.Configure}
                    direction={direction}
                    template={template}
                    onConfigureScreen={this.handleConfigureScreen}
                    onConfigureDone={this.handleConfigureDone}
                  />
                </Screen>
                <Screen active={step === Steps.Launch}>
                  <Launch
                    visible={step === Steps.Launch}
                    direction={direction}
                    onConfirm={this.nextStep}
                  />
                </Screen>
                <Footer>
                  <PrevNext
                    visible={step !== Steps.Start && step !== Steps.Launch}
                    direction={direction}
                    onPrev={this.prevStep}
                    onNext={this.nextStep}
                    enableNext={enableNext}
                    enablePrev={enablePrev}
                  />
                </Footer>
              </Window>
            </View>
          </Main>
        )}
      </Motion>
    )
  }
}

const Screen = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: ${({ active }) => (active ? 'auto' : 'none')};
`

const Main = styled.div`
  position: fixed;
  z-index: 2;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: auto;
  height: 100vh;
  background-image: linear-gradient(
      0deg,
      rgba(0, 0, 0, 0.08) 0%,
      rgba(0, 0, 0, 0.08) 100%
    ),
    linear-gradient(-226deg, #00f1e1 0%, #00b4e4 100%);
`

const View = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 800px;
  min-height: 100%;
  padding: 50px;
`

const Window = styled.div`
  overflow: hidden;
  position: relative;
  width: 1080px;
  height: 660px;
  background: #fff;
  border-radius: 3px;
  box-shadow: 0 10px 28px 0 rgba(11, 103, 157, 0.7);
`

const Footer = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
`

export default Onboarding
