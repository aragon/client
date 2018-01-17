import React from 'react'
import ReactDOM from 'react-dom'
import { styled } from '@aragon/ui'
import { clamp, lerp } from '../../math-utils'
import { noop } from '../../utils'
import AppLoadingProgressBar from './AppLoadingProgressBar'

const LOADING_START = 25 // Start loading indicator at 25%
const LOADING_END = 100
const LOADING_FUDGE_LIMIT = 75 // Limit arbitrary incremental movement of loading incator to 75%

// See https://developer.mozilla.org/en-US/docs/Web/HTML/Element/iframe for details about sandbox
// `sandbox` works like a whitelist: by default, almost every functionality is restricted.
const SANDBOX = [
  // Allows new browsing contexts (e.g. new windows or tabs) generated by the
  // iframe to escape the sandbox restrictions. Otherwise, new contexts would
  // share the same restrictions as their originating iframe (in our case, the
  // new contexts would only have the ability to run JavaScript).
  'allow-popups-to-escape-sandbox',

  // Gotta run 'em all!
  'allow-scripts',

  // Note that we haven't enabled:
  //   - 'allow-same-origin':
  //       The most important security setting: leaving this disabled lets the
  //       iframe be considered as coming from a unique, orphan origin. This
  //       means that the page won't have access to any cookies, local/session
  //       storage, or access to open pages (e.g. the parent window, this Dapp).
  //
  //       However, this does force some restrictions:
  //         - `window.postMessage()` must use `*` as an origin to communicate
  //           with this iframe
  //         - React devtools can't be hooked in from the browser, so you have
  //           to use the native `react-devtools` electron app for debugging
  //
  //  - 'allow-top-navigation':
  //       Leaving this disabled disallows the iframe from navigating the
  //       Dapp's context (e.g. to a malicious page)
].join(' ')

class AppIFrame extends React.Component {
  state = {
    hideProgressBar: true,
    loadProgress: 0,
  }
  componentDidMount() {
    this.navigateIFrame(this.props.src)
  }
  componentWillReceiveProps(nextProps) {
    const { src: nextSrc } = nextProps
    if (nextSrc !== this.src) {
      this.resetProgress(() => {
        this.navigateIFrame(nextSrc)
      })
    }
  }
  componentWillUnmount() {
    this.clearProgressTimeout()
  }
  isHidden = () => {
    const { hidden, src } = this.props
    return !src || hidden
  }
  navigateIFrame = src => {
    // Rather than load src=undefined, this component hides itself. That way, if the user later
    // navigates back to the same src, we don't have to reload the iframe.
    if (src) {
      // Cache src to avoid cases where the iframe would load the same page as before
      this.src = src
      this.setProgressTimeout(this.startProgress(), 100)

      // Detach the iframe from the DOM before setting the src to avoid adding history state
      const containerNode = this.iframe.parentNode
      this.iframe.remove()
      this.iframe.src = src
      containerNode.append(this.iframe)
    }
  }
  setProgressTimeout = (...args) => {
    this.progressTimer = setTimeout(...args)
  }
  clearProgressTimeout = () => {
    clearTimeout(this.progressTimer)
  }
  startProgress = () => {
    this.setState(
      {
        hideProgressBar: false,
        loadProgress: LOADING_START,
      },
      () => {
        this.setProgressTimeout(this.fudgeProgress, 500)
      }
    )
  }
  fudgeProgress = () => {
    const { loadProgress } = this.state
    if (loadProgress < LOADING_FUDGE_LIMIT) {
      const delay = clamp(Math.random() * 1000, 350, 650)
      // Move progress ahead by 1.5% to 7.5%
      const moveProgress = clamp(Math.random() / 10, 0.02, 0.1)
      const nextProgress = lerp(moveProgress, loadProgress, LOADING_END)
      this.setState({ loadProgress: nextProgress }, () => {
        this.setProgressTimeout(this.fudgeProgress, delay)
      })
    }
  }
  endProgress = () => {
    this.clearProgressTimeout()
    this.setState({ hideProgressBar: true, loadProgress: LOADING_END }, () => {
      this.setProgressTimeout(this.resetProgress, 500)
    })
  }
  resetProgress = (cb = noop) => {
    this.clearProgressTimeout()
    this.setState({ hideProgressBar: true, loadProgress: 0 }, cb)
  }
  handleOnLoad = (...args) => {
    const { onLoad } = this.props
    this.endProgress()
    if (typeof onLoad === 'function') {
      onLoad(...args)
    }
  }
  render() {
    const { ...props } = this.props
    const { hideProgressBar, loadProgress } = this.state
    const show = !this.isHidden()
    const progressBar = show && (
      <AppLoadingProgressBar hide={hideProgressBar} percent={loadProgress} />
    )

    // Remove onLoad prop as we wrap it with our own
    delete props.onLoad

    // Remove src prop as we use manage the src ourselves to avoid adding duplicate history entries
    // every time the src changes (see `navigateIFrame()`)
    delete props.src

    return (
      <React.Fragment>
        {progressBar}
        <StyledIFrame
          frameBorder={0}
          onLoad={this.handleOnLoad}
          ref={iframe => {
            this.iframe = ReactDOM.findDOMNode(iframe)
          }}
          sandbox={SANDBOX}
          style={{
            display: show ? 'block' : 'none',
          }}
          {...props}
        />
      </React.Fragment>
    )
  }
}

const StyledIFrame = styled.iframe`
  display: block;
  height: 100%;
  width: 100%;
`

export default AppIFrame
