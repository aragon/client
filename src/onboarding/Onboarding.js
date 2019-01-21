import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Spring, animated } from 'react-spring'
import { breakpoint } from '@aragon/ui'
import { noop } from '../utils'
import { getUnknownBalance } from '../web3-utils'
import { isNameAvailable } from '../aragonjs-wrapper'
import springs from '../springs'

import * as Steps from './steps'
import Templates from './templates'

import StepsBar from './StepsBar'
import PrevNext from './PrevNext'

import Start from './Start'
import Template from './Template'
import Domain from './Domain'
import Launch from './Launch'
import Sign from './Sign'
import DeprecatedBanner from '../components/DeprecatedBanner/DeprecatedBanner'

import {
  DomainCheckNone,
  DomainCheckPending,
  DomainCheckAccepted,
  DomainCheckRejected,
} from './domain-states'
import {
  DAO_CREATION_STATUS_NONE,
  DAO_CREATION_STATUS_SUCCESS,
  DAO_CREATION_STATUS_ERROR,
} from '../symbols'

const initialState = {
  template: null,
  templateData: {},
  domain: '',
  domainCheckStatus: DomainCheckNone,
  domainToOpen: '',
  domainToOpenCheckStatus: DomainCheckNone,
  stepIndex: 0,
  direction: 1, // 1 = forward, -1 = backward
  render: true,
}

class Onboarding extends React.PureComponent {
  static propTypes = {
    account: PropTypes.string.isRequired,
    balance: PropTypes.object,
    banner: PropTypes.oneOfType([
      PropTypes.bool,
      PropTypes.shape({
        type: PropTypes.oneOf([DeprecatedBanner]),
      }),
    ]).isRequired,
    daoCreationStatus: PropTypes.oneOf([
      DAO_CREATION_STATUS_NONE,
      DAO_CREATION_STATUS_SUCCESS,
      DAO_CREATION_STATUS_ERROR,
    ]).isRequired,
    onBuildDao: PropTypes.func.isRequired,
    onComplete: PropTypes.func.isRequired,
    onOpenOrganization: PropTypes.func.isRequired,
    onResetDaoBuilder: PropTypes.func.isRequired,
    selectorNetworks: PropTypes.array.isRequired,
    visible: PropTypes.bool.isRequired,
    walletNetwork: PropTypes.string.isRequired,
    walletWeb3: PropTypes.object,
  }

  static defaultProps = {
    account: '',
    balance: getUnknownBalance(),
    banner: null,
    daoCreationStatus: DAO_CREATION_STATUS_NONE,
    onComplete: noop,
    onBuildDao: noop,
    onOpenOrganization: noop,
    onResetDaoBuilder: noop,
    onRequestEnable: noop,
    visible: true,
    walletNetwork: '',
    walletProviderId: '',
  }
  state = {
    ...initialState,
  }

  constructor(props) {
    super(props)
    this.state.render = props.visible
  }

  componentWillReceiveProps(nextProps) {
    const { props } = this

    if (nextProps.visible && !props.visible) {
      this.setState({ stepIndex: 0, render: true })
    }

    if (
      nextProps.daoCreationStatus !== props.daoCreationStatus &&
      nextProps.daoCreationStatus === DAO_CREATION_STATUS_SUCCESS
    ) {
      setTimeout(() => {
        this.nextStep()
      }, 1000)
    }
  }

  handleTransitionRest = () => {
    if (!this.props.visible) {
      this.setState({ render: false })
    }
  }

  reset = () => {
    this.setState({ ...initialState })
    this.props.onResetDaoBuilder()
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

  getInitialDataFromTemplate(template) {
    if (!Templates.has(template)) {
      return []
    }
    const fields = Templates.get(template).fields
    return Object.entries(fields).reduce(
      (fields, [name, { defaultValue }]) => ({
        ...fields,
        [name]: defaultValue(),
      }),
      {}
    )
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
  filterConfigurationValue(template, name, value) {
    if (!Templates.has(template)) {
      return null
    }
    return Templates.get(template).fields[name].filter(
      value,
      this.state.templateData
    )
  }

  // Check if the data is valid by calling validate() on the template screen
  validateConfigurationScreen(template, screen) {
    const screenData = this.getTemplateScreen(template, screen)
    return screenData ? screenData.validate(this.state.templateData) : false
  }

  handleConfigurationFieldUpdate = (screen, name, value) => {
    this.setState(({ templateData, template }) => {
      const updatedFields = this.filterConfigurationValue(template, name, value)

      // If the filter returns null, the value is not updated
      if (updatedFields === null) {
        return {}
      }

      return {
        templateData: {
          ...templateData,
          ...updatedFields,
        },
      }
    })
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
    const filteredDomain = domain
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '')
      .slice(0, 30)

    // No change
    if (this.state[domainKey] === filteredDomain) {
      return
    }

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
        const available = await isNameAvailable(filteredDomain)

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

  // Open the organization stored in `domainToOpen`
  handleOpenOrganization = () => {
    const { domainToOpenCheckStatus, domainToOpen } = this.state
    if (domainToOpenCheckStatus === DomainCheckAccepted) {
      this.props.onOpenOrganization(`${domainToOpen}.aragonid.eth`)
    }
  }

  // Open the specified address as an organization
  handleOpenOrganizationAddress = address => {
    this.props.onOpenOrganization(address)
  }

  buildDao = () => {
    const { template, domain } = this.state

    if (!Templates.has(template)) {
      return null
    }

    const templateData = Templates.get(template)
    const data = templateData.prepareData(this.state.templateData)

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
    const { daoCreationStatus } = this.props
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
    if (step.screen === 'sign') {
      return daoCreationStatus === DAO_CREATION_STATUS_SUCCESS
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
    const { direction, stepIndex, render } = this.state
    const { visible, banner } = this.props

    if (!render && !visible) {
      return null
    }

    const step = this.currentStep()
    const steps = this.getSteps()
    return (
      <Spring
        config={springs.lazy}
        to={{ showProgress: Number(visible) }}
        onRest={this.handleTransitionRest}
        native
      >
        {({ showProgress }) => (
          <Main
            style={{
              transform: visible
                ? 'none'
                : showProgress.interpolate(
                    v => `translate3d(0, ${110 * (1 - v)}%, 0)`
                  ),
              opacity: showProgress,
            }}
          >
            <BannerWrapper>{banner}</BannerWrapper>
            <View>
              <Window>
                <Spring
                  native
                  config={springs.smooth}
                  to={{ screenProgress: stepIndex }}
                >
                  {({ screenProgress }) => (
                    <React.Fragment>
                      <StepsBar activeGroup={step.group} />
                      <div>
                        {steps.map(({ screen }, i) => (
                          <Screen active={screen === step.screen} key={screen}>
                            {this.renderScreen(
                              screen,
                              i,
                              screenProgress,
                              screen === step.screen
                            )}
                          </Screen>
                        ))}
                      </div>
                      <PrevNext
                        visible={this.isPrevNextVisible()}
                        direction={direction}
                        onPrev={this.prevStep}
                        onNext={this.nextStep}
                        enableNext={this.isNextEnabled()}
                        enablePrev={this.isPrevEnabled()}
                        signingNext={this.isSigningNext()}
                      />
                    </React.Fragment>
                  )}
                </Spring>
              </Window>
            </View>
          </Main>
        )}
      </Spring>
    )
  }
  renderScreen(screen, screenIndex, positionProgress, isActive) {
    const {
      template,
      domain,
      domainCheckStatus,
      domainToOpen,
      domainToOpenCheckStatus,
    } = this.state

    const {
      account,
      balance,
      daoCreationStatus,
      onComplete,
      selectorNetworks,
      onRequestEnable,
      walletNetwork,
      walletProviderId,
      walletWeb3,
    } = this.props

    // No need to move the screens farther than one step
    const getPositionProgress = progress =>
      Math.min(1, Math.max(-1, screenIndex - progress))

    // used by every screen
    const screenTransitionStyles = {
      opacity: positionProgress.interpolate(
        v => 1 - Math.abs(getPositionProgress(v))
      ),
      transform: positionProgress.interpolate(
        v => `translateX(${getPositionProgress(v) * 50}%)`
      ),
    }

    const sharedProps = {
      screenTransitionStyles,
      forceFocus: isActive,
    }

    if (screen === 'start') {
      return (
        <Start
          hasAccount={Boolean(account)}
          balance={balance}
          onCreate={this.handleStartCreate}
          onRest={this.handleStartRest}
          domain={domainToOpen}
          domainCheckStatus={domainToOpenCheckStatus}
          onDomainChange={this.handleDomainToOpenChange}
          onOpenOrganization={this.handleOpenOrganization}
          onOpenOrganizationAddress={this.handleOpenOrganizationAddress}
          selectorNetworks={selectorNetworks}
          onRequestEnable={onRequestEnable}
          walletNetwork={walletNetwork}
          walletProviderId={walletProviderId}
          walletWeb3={walletWeb3}
          {...sharedProps}
        />
      )
    }
    if (screen === 'template') {
      return (
        <Template
          templates={Templates}
          activeTemplate={template}
          onSelect={this.handleTemplateSelect}
          {...sharedProps}
        />
      )
    }
    if (screen === 'domain') {
      return (
        <Domain
          domain={domain}
          domainCheckStatus={domainCheckStatus}
          onDomainChange={this.handleDomainChange}
          onSubmit={this.nextStep}
          {...sharedProps}
        />
      )
    }
    if (screen === 'sign') {
      return (
        <Sign
          daoCreationStatus={daoCreationStatus}
          onTryAgain={this.reset}
          {...sharedProps}
        />
      )
    }
    if (screen === 'launch') {
      return <Launch onConfirm={onComplete} {...sharedProps} />
    }

    const steps = this.getSteps()
    const configureScreen = steps.find(
      step => step.screen === screen && step.group === Steps.Configure
    )
    if (!configureScreen) {
      return null
    }

    const ConfigureScreen = configureScreen.Component
    const fields = this.state.templateData
    return (
      <ConfigureScreen
        screen={screen}
        fields={fields}
        onFieldUpdate={this.handleConfigurationFieldUpdate}
        onSubmit={this.nextStep}
        {...sharedProps}
      />
    )
  }
}

const Main = styled(animated.div)`
  position: fixed;
  z-index: 3;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  height: 100%;
  display: flex;
  flex-direction: column;
  background-image: linear-gradient(
      0deg,
      rgba(0, 0, 0, 0.08) 0%,
      rgba(0, 0, 0, 0.08) 100%
    ),
    linear-gradient(-226deg, #00f1e1 0%, #00b4e4 100%);

  ${breakpoint(
    'medium',
    `
      overflow: auto;
    `
  )}
`

const BannerWrapper = styled.div`
  position: relative;
  z-index: 2;
`

const View = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-grow: 1;

  ${breakpoint(
    'medium',
    `
      min-width: 800px;
      padding: 50px;
    `
  )}
`

const Window = styled.div`
  position: relative;
  width: 100vw;
  height: 100vh;
  background: #fff;

  ${breakpoint(
    'medium',
    `
      width: 1080px;
      height: 660px;
      border-radius: 3px;
      box-shadow: 0 10px 28px 0 rgba(11, 103, 157, 0.7);
    `
  )}
`

const Screen = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: auto;
  pointer-events: ${({ active }) => (active ? 'auto' : 'none')};

  ${breakpoint(
    'medium',
    `
      overflow: hidden;
    `
  )}
`

export default Onboarding
