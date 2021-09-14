import React from 'react'
import PropTypes from 'prop-types'
import { AppType } from '../../prop-types'
import { appIframeSandbox } from '../../security/configuration'
import { noop } from '../../util/utils'

class AppIFrame extends React.Component {
  static propTypes = {
    app: AppType.isRequired,
    iframeRef: PropTypes.func,
    onLoadingCancel: PropTypes.func,
    onLoadingError: PropTypes.func,
    onLoadingSuccess: PropTypes.func,
    onLoadingStart: PropTypes.func,
    onMessage: PropTypes.func,
    onNavigate: PropTypes.func,
  }
  static defaultProps = {
    iframeRef: noop,
    onLoadingCancel: noop,
    onLoadingError: noop,
    onLoadingSuccess: noop,
    onLoadingStart: noop,
    onMessage: noop,
    onNavigate: noop,
  }
  state = {
    isLoading: false,
  }
  componentDidMount() {
    window.addEventListener('message', this.handleReceiveMessage, false)
    this.navigateIFrame(this.props.app.src)
  }
  componentWillReceiveProps(nextProps) {
    const { app: nextApp } = nextProps
    if (
      nextApp.src !== this.props.app.src ||
      // Also navigate when it's the same app, but a different instance
      nextApp.proxyAddress !== this.props.app.proxyAddress
    ) {
      this.navigateIFrame(nextApp.src)
    }
  }
  componentWillUnmount() {
    window.removeEventListener('message', this.handleReceiveMessage, false)
    if (this.state.isLoading) {
      this.props.onLoadingCancel()
    }
  }
  loadingStart() {
    if (this.state.isLoading) {
      this.props.onLoadingCancel()
    }
    this.props.onLoadingStart()
    this.setState({ isLoading: true })
  }
  isHidden = () => {
    const { app } = this.props
    return !app || !app.src
  }
  // To be called from outside
  reloadIframe = () => {
    this.loadingStart()
  }
  navigateIFrame = src => {
    // Rather than load src=undefined, this component hides itself. That way,
    // if the user later navigates back to the same src, we don't have to
    // reload the iframe.
    if (!src) return

    // Cache src to avoid cases where the iframe would load the same page as
    // before
    this.src = src

    // Detach the iframe from the DOM before setting the src to avoid adding
    // history state
    const containerNode = this.iframe.parentNode
    this.iframe.remove()
    this.iframe.src = src
    containerNode.appendChild(this.iframe)

    this.loadingStart()

    this.props.onNavigate(this.props.app)
  }
  sendMessage = data => {
    // Must use '*' for origin as we've sandboxed the iframe's origin
    this.iframe.contentWindow.postMessage(data, '*')
  }
  handleOnLoad = event => {
    this.setState({ isLoading: false })
    this.props.onLoadingSuccess({ iframeElement: event.target })
  }
  handleReceiveMessage = event => {
    const { onMessage } = this.props
    if (
      // Make sure the event actually came from the iframe window
      // We can't use event.origin as it's always null due to the origin sandboxing
      event.source === this.iframe.contentWindow
    ) {
      onMessage(event)
    }
  }
  handleIFrameRef = iframe => {
    const { iframeRef } = this.props
    iframeRef(iframe)
    this.iframe = iframe
  }
  render() {
    const { ...props } = this.props
    const show = !this.isHidden()

    // Remove the props managed by AppIframe, so we can pass everything else to
    // the <iframe> element.
    Object.keys(AppIFrame.propTypes).forEach(name => {
      delete props[name]
    })

    // Also remove the `src` prop as we manage the src ourselves to avoid
    // adding duplicate history entries every time the src changes (see
    // `navigateIFrame()`)
    delete props.src

    return (
      <iframe
        name="AppIFrame"
        allow="camera *; microphone *"
        frameBorder="0"
        onLoad={this.handleOnLoad}
        ref={this.handleIFrameRef}
        sandbox={appIframeSandbox}
        css={`
          display: ${show ? 'block' : 'none'};
          height: 100%;
          width: 100%;
        `}
        {...props}
      />
    )
  }
}

export default AppIFrame
