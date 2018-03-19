import React from 'react'
import styled from 'styled-components'
import { Motion, spring } from 'react-motion'
import { spring as springConf } from '@aragon/ui'
import { noop } from '../utils'

import * as Steps from './steps'
import Templates from './templates'

import StepsBar from './StepsBar'
import PrevNext from './PrevNext'

import Start from './Start'
import Template from './Template'
import Domain from './Domain'
import Launch from './Launch'
import Sign from './Sign'

import {
  DomainCheckNone,
  DomainCheckPending,
  DomainCheckAccepted,
  DomainCheckRejected,
} from './domain-states'

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
const SPRING_SCREEN = springConf('slow')

const initialState = {
  template: null,
  templateData: [],
  domain: '',
  domainCheckStatus: DomainCheckNone,
  domainToOpen: '',
  domainToOpenCheckStatus: DomainCheckNone,
  stepIndex: 0,
  direction: 1, // 1 = forward, -1 = backward
}

class Onboarding extends React.PureComponent {
  static defaultProps = {
    account: '',
    balance: null,
    network: '',
    visible: true,
    daoCreationStatus: 'none',
    onComplete: noop,
    onBuildDao: noop,
    onOpenOrganization: noop,
  }
  state = {
    ...initialState,
  }

  componentWillReceiveProps(nextProps) {
    const { props } = this

    if (nextProps.visible && !props.visible) {
      this.setState({ stepIndex: 0 })
    }

    if (
      nextProps.daoCreationStatus !== props.daoCreationStatus &&
      nextProps.daoCreationStatus === 'success'
    ) {
      setTimeout(() => {
        this.nextStep()
      }, 1000)
    }
  }

  reset = () => {
    this.setState({ ...initialState })
  }

  getSteps() {
    const { template } = this.state

    // Prepare the configure steps to be inserted
    const configureSteps = Templates.has(template)
      ? Templates.get(template).screens.map(step => ({
          ...step,
          group: Steps.Configure,
        }))
      : []

    return [
      { screen: 'start', group: Steps.Start },
      { screen: 'template', group: Steps.Template },
      { screen: 'domain', group: Steps.Domain },
      ...configureSteps,
      { screen: 'sign', group: Steps.Launch },
      { screen: 'launch', group: Steps.Launch },
    ]
  }

  currentStep() {
    const { stepIndex } = this.state
    const steps = this.getSteps()
    return steps[stepIndex] || { group: Steps.Start }
  }

  // Get the template data without the screen-by-screen structure
  getTemplateData() {
    const { templateData } = this.state

    // Transforms:
    //
    // [
    //   [ { name: 'foo', value: 1 }, … ],
    //   [ { name: 'bar', value: 2 }, … ],
    //   …
    // ]
    //
    // Into:
    //
    // { foo: 1, bar: 2, … }
    //
    return templateData.reduce(
      (fields, { data }) => ({
        ...fields,
        ...data.reduce(
          (screenFields, { name, value }) => ({
            ...screenFields,
            [name]: value,
          }),
          {}
        ),
      }),
      {}
    )
  }

  getInitialDataFromTemplate(template) {
    if (!Templates.has(template)) {
      return []
    }
    return Templates.get(template).screens.map(({ screen, fields }) => ({
      screen,
      data: Object.entries(fields).map(([name, { defaultValue }]) => ({
        name,
        value: defaultValue(),
      })),
    }))
  }

  // Return a screen object from a template
  getTemplateScreen(template, screen) {
    if (!Templates.has(template)) {
      return null
    }
    return (
      Templates.get(template).screens.find(
        screenData => screenData.screen === screen
      ) || null
    )
  }

  // Filters a field value by calling the corresponding filter on the template
  filterConfigurationValue(template, screen, name, value) {
    const screenData = this.getTemplateScreen(template, screen)
    return screenData
      ? screenData.fields[name].filter(value, this.getTemplateData())
      : null
  }

  // Check if the data is valid by calling validateScreen() on the template
  validateConfigurationScreen(template, screen) {
    const screenData = this.getTemplateScreen(template, screen)
    return screenData
      ? screenData.validateScreen(this.getTemplateData())
      : false
  }

  handleStartCreate = () => {
    this.reset()
    this.moveStep(1)
  }

  handleStartRest = () => {
    // Unset the template and the domain when
    // the home screen finishes its transition.
    const { stepIndex } = this.state
    if (stepIndex === 0) {
      this.setState({ template: null, domain: '' })
    }
  }

  handleTemplateSelect = (template = null) => {
    this.setState({
      template,
      templateData: this.getInitialDataFromTemplate(template),
    })
  }

  checkDomain = (
    domain,
    domainKey,
    domainStatusKey,
    timerKey,
    invertCheck = false
  ) => {
    const { daoBuilder } = this.props
    const filteredDomain = domain.trim().toLowerCase()

    this.setState({
      [domainKey]: filteredDomain,
      [domainStatusKey]: DomainCheckPending,
    })
    clearTimeout(this[timerKey])

    // Empty name
    if (!filteredDomain) {
      this.setState({ [domainStatusKey]: DomainCheckNone })
      return
    }

    const checkName = async () => {
      try {
        const available = await daoBuilder.isNameAvailable(filteredDomain)

        // The domain could have changed in the meantime
        if (filteredDomain === this.state[domainKey]) {
          const valid = invertCheck ? !available : available
          const status = valid ? DomainCheckAccepted : DomainCheckRejected
          this.setState({ [domainStatusKey]: status })
        }
      } catch (err) {
        // Retry every second
        this[timerKey] = setTimeout(checkName, 1000)
      }
    }

    // Check the domain only after the field is not updated during 300ms
    this[timerKey] = setTimeout(checkName, 300)
  }

  handleDomainChange = domain => {
    this.checkDomain(
      domain,
      'domain',
      'domainCheckStatus',
      'domainCheckTimer',
      false
    )
  }

  handleDomainToOpenChange = domain => {
    this.checkDomain(
      domain,
      'domainToOpen',
      'domainToOpenCheckStatus',
      'domainToOpenCheckTimer',
      true
    )
  }

  handleOpenOrganization = () => {
    const { domainToOpenCheckStatus, domainToOpen } = this.state
    if (domainToOpenCheckStatus === DomainCheckAccepted) {
      this.props.onOpenOrganization(`${domainToOpen}.aragonid.eth`)
    }
  }

  handleConfigurationFieldUpdate = (screen, name, value) => {
    this.setState(({ templateData, template }) => {
      const filteredValue = this.filterConfigurationValue(
        template,
        screen,
        name,
        value
      )

      // If the filter returns null, the value is not updated
      if (filteredValue === null) {
        return {}
      }

      return {
        templateData: templateData.map(screenData => {
          if (screenData.screen !== screen) {
            return screenData
          }
          return {
            screen,
            data: screenData.data.map(field => {
              if (field.name !== name) {
                return field
              }
              return { name, value: filteredValue }
            }),
          }
        }),
      }
    })
  }

  buildDao = () => {
    const { template, domain } = this.state

    if (!Templates.has(template)) {
      return null
    }

    const templateData = Templates.get(template)
    const data = templateData.prepareData(this.getTemplateData())

    console.log('build DAO', data)
    this.props.onBuildDao(templateData.name, domain, data)
  }

  // Set the direction to 1 (next) or -1 (prev)
  moveStep = (direction = 1) => {
    const { stepIndex } = this.state
    const steps = this.getSteps()
    const newStepIndex = stepIndex + direction
    if (newStepIndex > steps.length - 1 || newStepIndex < 0) {
      return
    }

    if (steps[newStepIndex].screen === 'sign') {
      this.buildDao()
    }

    this.setState({ stepIndex: newStepIndex, direction })
  }
  nextStep = () => {
    if (this.isNextEnabled()) {
      this.moveStep(1)
    }
  }
  prevStep = () => {
    if (this.isPrevEnabled()) {
      this.moveStep(-1)
    }
  }
  isNextEnabled() {
    const { template, domainCheckStatus } = this.state
    const step = this.currentStep()
    if (step.screen === 'template' || step.screen === 'start') {
      return !!template
    }
    if (step.screen === 'domain') {
      return domainCheckStatus === DomainCheckAccepted
    }
    if (step.group === Steps.Configure) {
      return this.validateConfigurationScreen(template, step.screen)
    }
    return true
  }
  isPrevEnabled() {
    return true
  }
  isPrevNextVisible() {
    const step = this.currentStep()
    return (
      step.group !== Steps.Start &&
      step.group !== Steps.Launch &&
      step.group !== Steps.Sign
    )
  }
  isSigningNext() {
    const { stepIndex } = this.state
    const steps = this.getSteps()
    return steps[stepIndex + 1] && steps[stepIndex + 1].name === 'sign'
  }
  render() {
    const { direction, stepIndex } = this.state
    const { visible } = this.props
    const step = this.currentStep()
    const steps = this.getSteps()
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
                <Motion
                  style={{
                    screenProgress: spring(stepIndex, SPRING_SCREEN),
                  }}
                >
                  {({ screenProgress }) => (
                    <React.Fragment>
                      <StepsBar activeGroup={step.group} />
                      <div>
                        {steps.map(({ screen }, i) => (
                          <Screen active={screen === step.screen} key={screen}>
                            {this.renderScreen(
                              screen,
                              screen === step.screen,
                              i - screenProgress
                            )}
                          </Screen>
                        ))}
                      </div>
                      <Footer>
                        <PrevNext
                          visible={this.isPrevNextVisible()}
                          direction={direction}
                          onPrev={this.prevStep}
                          onNext={this.nextStep}
                          enableNext={this.isNextEnabled()}
                          enablePrev={this.isPrevEnabled()}
                          signingNext={this.isSigningNext()}
                        />
                      </Footer>
                    </React.Fragment>
                  )}
                </Motion>
              </Window>
            </View>
          </Main>
        )}
      </Motion>
    )
  }
  renderScreen(screen, visible, hideProgress) {
    const {
      template,
      domain,
      domainCheckStatus,
      domainToOpen,
      domainToOpenCheckStatus,
    } = this.state
    const {
      account,
      network,
      balance,
      daoCreationStatus,
      onComplete,
    } = this.props

    // No need to move the screens farther than one step
    hideProgress = Math.min(1, Math.max(-1, hideProgress))

    if (screen === 'start') {
      return (
        <Start
          hideProgress={hideProgress}
          hasAccount={!!account}
          balance={balance}
          network={network}
          onCreate={this.handleStartCreate}
          onRest={this.handleStartRest}
          domain={domainToOpen}
          domainCheckStatus={domainToOpenCheckStatus}
          onDomainChange={this.handleDomainToOpenChange}
          onOpenOrganization={this.handleOpenOrganization}
        />
      )
    }
    if (screen === 'template') {
      return (
        <Template
          hideProgress={hideProgress}
          templates={Templates}
          activeTemplate={template}
          onSelect={this.handleTemplateSelect}
        />
      )
    }
    if (screen === 'domain') {
      return (
        <Domain
          hideProgress={hideProgress}
          domain={domain}
          domainCheckStatus={domainCheckStatus}
          onDomainChange={this.handleDomainChange}
          onSubmit={this.nextStep}
        />
      )
    }
    if (screen === 'sign') {
      return (
        <Sign
          hideProgress={hideProgress}
          daoCreationStatus={daoCreationStatus}
          onTryAgain={this.reset}
        />
      )
    }
    if (screen === 'launch') {
      return <Launch hideProgress={hideProgress} onConfirm={onComplete} />
    }

    const steps = this.getSteps()
    const configureScreen = steps.find(
      step => step.screen === screen && step.group === Steps.Configure
    )
    if (!configureScreen) {
      return null
    }

    const ConfigureScreen = configureScreen.Component
    const screenData = this.state.templateData.find(
      data => data.screen === screen
    )
    const fields = screenData
      ? screenData.data.reduce(
          (fields, { name, value }) => ({ ...fields, [name]: value }),
          {}
        )
      : {}
    return (
      <ConfigureScreen
        hideProgress={hideProgress}
        screen={screen}
        fields={fields}
        onFieldUpdate={this.handleConfigurationFieldUpdate}
        onSubmit={this.nextStep}
      />
    )
  }
}

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
  position: relative;
  width: 1080px;
  height: 660px;
  background: #fff;
  border-radius: 3px;
  box-shadow: 0 10px 28px 0 rgba(11, 103, 157, 0.7);
`

const Screen = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
  pointer-events: ${({ active }) => (active ? 'auto' : 'none')};
`

const Footer = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
`

export default Onboarding
