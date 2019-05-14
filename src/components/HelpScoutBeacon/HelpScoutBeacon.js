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
import headerImg from './header.png'
import { GU } from '../../utils'

const HELPSCOUT_BEACON_KEY = 'helpscout-beacon'
const CLOSED = 'closed, user can open opt-in dialogue'
const OPENED = 'opened, user can opt-in or close'
const OPENING = 'opening'
const CLOSING = 'closing'
const ROUND_BUTTON_HEIGHT = 40

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
        z-index: 3;

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
        margin-left: calc(100% - ${ROUND_BUTTON_HEIGHT}px);
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
                  height: 17px;

                  & path {
                    fill: ${theme.gradientText};
                    /* original size 10px * 1.7 = 17px*/
                    transform: scale(1.7);
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
              <IconQuestion width="auto" height={18} />
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
          <img
            css={`
              margin-top: 22.5px;
            `}
            src={headerImg}
            alt=""
          />
        </Header>
        <main
          css={`
            padding: ${5 * GU}px ${3 * GU}px ${3 * GU}px;
          `}
        >
          <h3
            css={`
              font-weight: bold;
              font-size: 20px;
              line-height: 31px;
              color: #352c47;
            `}
          >
            We need your consent.
          </h3>
          <Paragraph>
            We want to assist you in using the product, providing help, and
            answers to common questions.
          </Paragraph>
          <Paragraph>
            For that, we use a third-party system called{' '}
            <StyledSafeLink href="https://www.helpscout.com/">
              HelpScout
            </StyledSafeLink>
            . If you opt-in, we will load their program onto Aragon. HelpScout
            is a{' '}
            <StyledSafeLink href="https://bcorporation.net/directory/help-scout">
              Public Benefit Corp
            </StyledSafeLink>
            .
          </Paragraph>
          <Button
            mode="strong"
            wide
            onClick={onOptIn}
            css={`
              margin-top: ${5 * GU}px;
              font-size: 15px;
            `}
          >
            Yes, I’d like help
          </Button>
        </main>
      </Wrapper>
    </animated.div>
  )
})

OptInDialogue.propTypes = {
  onClose: PropTypes.func.isRequired,
  onOptIn: PropTypes.func.isRequired,
}

const Paragraph = styled.p`
  color: #5d6e7f;
  font-size: 13px;
  line-height: 21px;
  margin-top: ${1 * GU}px;
`

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
  right: 0;
  z-index: 1;
  height: calc(100vh - 60px - ${2 * GU}px - ${4 * GU}px - ${4 * GU}px);
  overflow: hidden;

  ${breakpoint(
    'medium',
    `
      width: 336px;
      height: 482px;
      position: unset;
    `
  )}
`

const Header = styled.header`
  border-top-right-radius: 4px;
  border-top-left-radius: 4px;
  height: 148px;
  background-color: #08bee5;
  color: ${theme.gradientText};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
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
  width: ${ROUND_BUTTON_HEIGHT}px;
  height: ${ROUND_BUTTON_HEIGHT}px;
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
