import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Transition, animated } from 'react-spring'
import {
  Button,
  IconClose,
  SafeLink,
  breakpoint,
  springs,
  theme,
} from '@aragon/ui'
import BeaconHeadScripts from './BeaconHeadScripts'
import IconQuestion from './IconQuestion'
import logo from './logo.png'
import { GU } from '../../utils'

const HELPSCOUT_BEACON_KEY = 'helpscout-beacon'
const CLOSED = 'closed, user can open opt-in dialogue'
const OPENED = 'opened, user can opt-in or close'
const OPENING = 'opening'
const CLOSING = 'closing'

const Beacon = React.memo(() => {
  const [optedIn, setOptedIn] = React.useState(
    localStorage.getItem(HELPSCOUT_BEACON_KEY) === '1'
  )
  const handleOptIn = React.useCallback(() => {
    localStorage.setItem(HELPSCOUT_BEACON_KEY, '1')
    setOptedIn(true)
  }, [HELPSCOUT_BEACON_KEY])

  return (
    <div
      css={`
        position: absolute;
        bottom: ${2 * GU}px;
        right: ${2 * GU}px;
        z-index: 1001;

        ${breakpoint(
          'medium',
          `
            z-index: 10000;
            bottom: ${3 * GU}px;
            right: ${3 * GU}px;
          `
        )}
      `}
    >
      <BeaconHeadScripts optedIn={optedIn} />
      <HelpOptIn onOptIn={handleOptIn} optedIn={optedIn} />
    </div>
  )
})

const HelpOptIn = React.memo(({ onOptIn, optedIn }) => {
  const [mode, setMode] = React.useState(CLOSED)
  const handleClose = React.useCallback(() => setMode(CLOSED), [CLOSED])
  const handleToggle = React.useCallback(() => {
    if (mode !== OPENING && mode !== CLOSING) {
      setMode(mode === CLOSED ? OPENING : CLOSING)
    }
    if (optedIn) {
      window.Beacon('toggle')
    }
  }, [OPENING, CLOSING, CLOSED, optedIn, mode])
  const handleToggleEnd = React.useCallback(() => {
    setMode(mode === OPENING ? OPENED : CLOSED)
  }, [OPENING, OPENED, CLOSED, mode])
  const handleOptIn = React.useCallback(() => {
    onOptIn()
    setTimeout(() => window.Beacon('open'), 100)
  }, [onOptIn])
  React.useEffect(() => {
    if (optedIn && window.Beacon) {
      window.Beacon('on', 'open', () => setMode(OPENED))
      window.Beacon('on', 'close', () => setMode(CLOSED))
    }
  }, [optedIn, window.Beacon])

  return (
    <React.Fragment>
      {!optedIn && (
        <Transition
          native
          items={mode === OPENING || mode === OPENED}
          from={{ opacity: 0, enterProgress: 0, blocking: false }}
          enter={{ opacity: 1, enterProgress: 1, blocking: true }}
          leave={{ opacity: 0, enterProgress: 0, blocking: false }}
          onDestroyed={handleToggleEnd}
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
                      translate3d(0, ${(1 - v) * 20}px, 0)
                    `
                  ),
                }}
                onClose={handleClose}
                onOptIn={handleOptIn}
              />
            ))
          /* eslint-enable react/prop-types */
          }
        </Transition>
      )}
      <ToggleDialogueButton
        open={mode === OPENED || mode === OPENING}
        onToggle={handleToggle}
      />
    </React.Fragment>
  )
})

HelpOptIn.propTypes = {
  onOptIn: PropTypes.func.isRequired,
  optedIn: PropTypes.bool.isRequired,
}

const ToggleDialogueButton = React.memo(({ open, onToggle }) => {
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
            <RoundButtonIcon
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
            </RoundButtonIcon>
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
            <RoundButtonIcon
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
            </RoundButtonIcon>
          ))
        }
      </Transition>
    </RoundButton>
  )
})

ToggleDialogueButton.propTypes = {
  open: PropTypes.bool.isRequired,
  onToggle: PropTypes.func.isRequired,
}

const OptInDialogue = React.memo(({ onClose, onOptIn, ...styles }) => {
  return (
    <animated.div {...styles}>
      <Wrapper>
        <Header>
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
            alt=""
          />
        </Header>
        <main
          css={`
            display: flex;
            flex: 1;
            padding: ${2 * GU}px;
            overflow: auto;
          `}
        >
          <Body>
            <h3
              css={`
                font-weight: bold;
                font-size: 18px;
              `}
            >
              We need your consent.
            </h3>
            <p>
              We want to assist you in using the product, providing help, and
              answers to common questions.
            </p>
            <p>
              For that, we use a third-party system called{' '}
              <StyledSafeLink href="https://www.helpscout.com/">
                Help Scout
              </StyledSafeLink>
              . If you opt-in, we will load their program onto Aragon.
              <br />
              Help Scout is a{' '}
              <StyledSafeLink href="https://bcorporation.net/directory/help-scout">
                Public Benefit Corp
              </StyledSafeLink>
              .
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
              Yes, I’d like help
            </Button>
          </Body>
        </main>
      </Wrapper>
    </animated.div>
  )
})

OptInDialogue.propTypes = {
  onClose: PropTypes.func.isRequired,
  onOptIn: PropTypes.func.isRequired,
}

const Wrapper = styled.aside`
  background: #fff;
  border: 1px solid rgba(209, 209, 209, 0.5);
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.15);
  border-radius: 3px;
  width: calc(100vw - ${4 * GU}px);
  position: absolute;
  bottom: 100%;
  /* zeroY is relative to beacon container full viewport height
  * minus 4 GUs (64px) top plus the relative position of zeroY to the
  * edge of the viewport (60px) plus one GU for margin (16px) */
  top: calc(-100vh + 140px);
  /* zeroX is relative to beacon container full viewport width
  * minus 2 GUs on each side (32px) plus the position of zeroX
  * relative to the edge of the viewport (60px) */
  left: calc(-100vw + 92px);
  z-index: 1;
  display: flex;
  flex-direction: column;
  height: calc(100vh - 60px - ${2 * GU}px - ${4 * GU}px - ${4 * GU}px);
  overflow: hidden;

  ${breakpoint(
    'medium',
    `
      width: 350px;
      height: 600px;
      position: unset;
    `
  )}
`

const Header = styled.header`
  border-top-right-radius: 2px;
  border-top-left-radius: 2px;
  height: 150px;
  background-color: transparent;
  background-image: linear-gradient(
    180deg,
    ${theme.gradientStart},
    ${theme.gradientEnd}
  );
  color: ${theme.gradientText};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`

const Body = styled.div`
  min-height: 350px;
  line-height: 22px;
  font-size: 15px;
  display: flex;
  flex-direction: column;
  flex: 1;
  justify-content: space-around;
`

const StyledSafeLink = styled(SafeLink).attrs({ target: '_blank' })`
  text-decoration: none;
  color: ${theme.accent};

  &:hover,
  &:focus {
    text-decoration: underline;
  }
`

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

const RoundButtonIcon = styled(animated.div)`
  display: flex;
  position: absolute;
`

export default Beacon
