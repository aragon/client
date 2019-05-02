import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Transition, animated } from 'react-spring'
import { Helmet } from 'react-helmet'
import { Button, IconClose, breakpoint, springs, theme } from '@aragon/ui'
import { GU } from '../../utils'
import IconQuestion from './IconQuestion'
import logo from './logo.png'

const HELPSCOUT_BEACON = 'helpscout-beacon'
const BEACON_EMBED =
  '!function(e,t,n){function a(){var e=t.getElementsByTagName("script")[0],n=t.createElement("script");n.type="text/javascript",n.async=!0,n.src="https://beacon-v2.helpscout.net",e.parentNode.insertBefore(n,e)}if(e.Beacon=n=function(t,n,a){e.Beacon.readyQueue.push({method:t,options:n,data:a})},n.readyQueue=[],"complete"===t.readyState)return a();e.attachEvent?e.attachEvent("onload",a):e.addEventListener("load",a,!1)}(window,document,window.Beacon||function(){});'
const BEACON_INIT =
  "window.Beacon('init', '163e0284-762b-4e2d-b3b3-70a73a7e6c9f')"
const CLOSED = 'closed, user can open opt-in dialogue'
const OPENED = 'opened, user can opt-in or close'

const Beacon = React.memo(({ load = false, onOptIn }) => {
  return (
    <div
      css={`
        position: absolute;
        z-index: 1001;
        bottom: 10px;
        right: 20px;

        ${breakpoint(
          'medium',
          `
            bottom: 40px;
            right: 40px;
          `
        )}
      `}
    >
      {load ? (
        <Helmet>
          <script type="text/javascript">{BEACON_EMBED}</script>
          <script type="text/javascript">{BEACON_INIT}</script>
        </Helmet>
      ) : (
        <HelpOptIn onOptIn={onOptIn} />
      )}
    </div>
  )
})

Beacon.propTypes = {
  load: PropTypes.bool,
  onOptIn: PropTypes.func.isRequired,
}

Beacon.defaultProps = {
  load: false,
}

const HelpOptIn = React.memo(({ onOptIn }) => {
  const [mode, setMode] = React.useState(CLOSED)

  return (
    <React.Fragment>
      <Transition
        native
        items={mode === OPENED}
        from={{ opacity: 0, enterProgress: 0, blocking: false }}
        enter={{ opacity: 1, enterProgress: 1, blocking: true }}
        leave={{ opacity: 0, enterProgress: 1, blocking: false }}
        config={springs.smooth}
      >
        {show =>
          show &&
          /* eslint-disable react/prop-types */
          (({ opacity, enterProgress, blocking }) => (
            <OptInDialogue
              style={{
                pointerEvents: blocking ? 'auto' : 'none',
                opacity,
                transform: enterProgress.interpolate(
                  v => `
                  translate3d(0, ${(1 - v) * 10}px, 0)
                  scale3d(${1 - (1 - v) * 0.03}, ${1 - (1 - v) * 0.03}, 1)
                `
                ),
              }}
              onClose={() => setMode(CLOSED)}
              onOptIn={onOptIn}
            />
          ))
        /* eslint-enable react/prop-types */
        }
      </Transition>
      <ToggleDialogueButton
        open={mode === OPENED}
        onToggle={() => setMode(mode === OPENED ? CLOSED : OPENED)}
      />
    </React.Fragment>
  )
})

HelpOptIn.propTypes = {
  onOptIn: PropTypes.func.isRequired,
}

const ToggleDialogueButton = ({ open, onToggle }) => {
  return (
    <RoundButton
      onClick={onToggle}
      css={`
        margin-left: calc(100% - 60px);
        margin-top: ${2 * GU}px;
      `}
    >
      <Transition
        native
        items={open}
        from={{ opacity: 0, enterProgress: 0 }}
        enter={{ opacity: 1, enterProgress: 1 }}
        leave={{ opacity: 0, enterProgress: 1 }}
        config={springs.smooth}
      >
        {show =>
          show &&
          /* eslint-disable react/prop-types */
          (({ opacity, enterProgress }) => (
            <AnimatedDiv
              style={{
                opacity,
                transform: enterProgress.interpolate(
                  v => `rotate(${45 * (1 - v)}deg)`
                ),
              }}
            >
              <IconClose
                color={theme.gradientText}
                css={`
                  width: auto;
                  height: 22px;

                  & path {
                    fill: ${theme.gradientText};
                    transform: scale(2.2);
                    opacity: 1;
                  }
                `}
              />
            </AnimatedDiv>
          ))
        }
      </Transition>
      <Transition
        native
        items={!open}
        from={{ opacity: 0, enterProgress: 0 }}
        enter={{ opacity: 1, enterProgress: 1 }}
        leave={{ opacity: 0, enterProgress: 1 }}
        config={springs.smooth}
      >
        {show =>
          show &&
          /* eslint-disable react/prop-types */
          (({ opacity, enterProgress }) => (
            <AnimatedDiv
              style={{
                opacity,
                transform: enterProgress.interpolate(
                  v => `
                    scale3d(${1 - (1 - v) * 0.03}, ${1 - (1 - v) * 0.03}, 1)
                  `
                ),
              }}
            >
              <IconQuestion />
            </AnimatedDiv>
          ))
        }
      </Transition>
    </RoundButton>
  )
}

ToggleDialogueButton.propTypes = {
  open: PropTypes.bool.isRequired,
  onToggle: PropTypes.func.isRequired,
}

const OptInDialogue = React.memo(({ onClose, onOptIn, ...styles }) => {
  return (
    <animated.div {...styles}>
      <aside
        css={`
          background: #fff;
          border: 1px solid rgba(209, 209, 209, 0.5);
          box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.15);
          border-radius: 3px;
          width: 100vw;
          position: absolute;
          top: calc(-100vh + 86px);
          left: calc(-100vw + 80px);
          height: 100vh;
          z-index: 1;

          ${breakpoint(
            'medium',
            `
              width: 278px;
              height: unset;
              position: unset;
            `
          )}
        `}
      >
        <header
          css={`
            height: 157px;
            background-color: transparent;
            background-image: linear-gradient(
              180deg,
              ${theme.gradientStart},
              ${theme.gradientEnd}
            )};
            color: ${theme.gradientText}
            display: flex;
            align-items: center;
            justify-content: center;
            flex-direction: column;
          `}
        >
          <h2
            css={`
              font-size: 18px;
              line-height: 22px;
            `}
          >
            How can we help?
          </h2>
          <img
            css={`
              margin-top: ${2.5 * GU}px;
            `}
            src={logo}
            alt="Aragon logo"
          />
        </header>
        <main
          css={`
            padding: ${2 * GU}px;
            display: grid;
            grid-gap: ${2 * GU}px;
            line-height: 22px;
            font-size: 13px;
          `}
        >
          <h3
            css={`
              font-weight: bold;
              font-size: 16px;
            `}
          >
            We do not track our users’ data
          </h3>
          <p>
            We want to provide you with the best experience and assist you in
            using our product.
          </p>
          <p>
            You can use this Help button to find information from our Wiki or
            ask questions directly to a member of our team.
          </p>
          <Button
            mode="strong"
            wide
            onClick={onOptIn}
            css={`
              margin-top: ${1 * GU}px;
              font-size: 15px;
            `}
          >
            Yes, Id like help
          </Button>
        </main>
      </aside>
    </animated.div>
  )
})

OptInDialogue.propTypes = {
  onClose: PropTypes.func.isRequired,
  onOptIn: PropTypes.func.isRequired,
}

const RoundButton = styled(Button).attrs({ mode: 'strong' })`
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.15);
  border-radius: 50%;
  width: 60px;
  height: 60px;
  padding: 0;
  margin: 0;
  display: flex;
  align-items: center;
  justify-content: center;
`

const AnimatedDiv = styled(animated.div)`
  display: flex;
  position: absolute;
`

export { HELPSCOUT_BEACON }
export default Beacon
