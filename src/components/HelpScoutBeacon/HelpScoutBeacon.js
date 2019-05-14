import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Transition, animated } from 'react-spring'
import {
  Button,
  ButtonIcon,
  IconClose,
  SafeLink,
  breakpoint,
  springs,
  theme,
  useViewport,
} from '@aragon/ui'
import BeaconHeadScripts from './BeaconHeadScripts'
import IconQuestion from './IconQuestion'
import headerImg from './header.png'
import LoadingRing from '../LoadingRing'
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
  const [beaconReady, setBeaconReady] = React.useState(optedIn)

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
    const isBeaconReady = () => {
      if (window.Beacon) {
        window.Beacon('on', 'open', () => setBeaconReady(true))
        window.Beacon('open')
        return
      }
      setTimeout(isBeaconReady, 100)
    }
    onOptIn()
    isBeaconReady()
  }, [onOptIn, window.Beacon])

  React.useEffect(() => {
    if (optedIn && window.Beacon) {
      window.Beacon('on', 'open', () => setMode(OPENED))
      window.Beacon('on', 'close', () => setMode(CLOSED))
    }
  }, [optedIn, window.Beacon])

  return (
    <React.Fragment>
      {(!optedIn || !beaconReady) && (
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
                  position: 'relative',
                  zIndex: 2,
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
                optedIn={optedIn}
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

const OptInDialogue = React.memo(({ onClose, onOptIn, optedIn, ...styles }) => {
  const { below } = useViewport()

  return (
    <animated.div {...styles}>
      <Wrapper>
        <Header>
          {below('medium') && (
            <ButtonIcon
              label="Close"
              onClick={onClose}
              css={`
                position: absolute;
                top: ${1 * GU}px;
                right: ${1 * GU}px;
              `}
            >
              <IconClose
                color={theme.gradientText}
                css={`
                  width: auto;
                  height: 24px;

                  & path {
                    fill: ${theme.gradientText};
                    /* original size 10px * 2.4 = 24px*/
                    transform: scale(2.4);
                    opacity: 1;
                  }
                `}
              />
            </ButtonIcon>
          )}
          <HeaderImage src={headerImg} alt="" />
        </Header>
        <Main>
          {!optedIn ? (
            <React.Fragment>
              <div css={'flex: 1'}>
                <Heading>We need your consent.</Heading>
                <Paragraph>
                  We want to assist you in using the product, providing help,
                  and answers to common questions.
                </Paragraph>
                <Paragraph>
                  For that, we use a third-party system called{' '}
                  <StyledSafeLink href="https://www.helpscout.com/">
                    HelpScout
                  </StyledSafeLink>
                  . If you opt-in, we will load their program onto Aragon.
                  HelpScout is a{' '}
                  <StyledSafeLink href="https://bcorporation.net/directory/help-scout">
                    Public Benefit Corp
                  </StyledSafeLink>
                  .
                </Paragraph>
              </div>
              <Button
                mode="strong"
                wide
                onClick={onOptIn}
                css={'font-size: 15px;'}
              >
                Yes, I’d like help
              </Button>
            </React.Fragment>
          ) : (
            <div
              css={`
                display: flex;
                align-items: center;
                justify-content: center;
                height: 200px;
              `}
            >
              <LoadingRing spin />
              <div>Loading…</div>
            </div>
          )}
        </Main>
      </Wrapper>
    </animated.div>
  )
})

OptInDialogue.propTypes = {
  onClose: PropTypes.func.isRequired,
  onOptIn: PropTypes.func.isRequired,
  optedIn: PropTypes.bool.isRequired,
}

const Paragraph = styled.p`
  color: #5d6e7f;
  margin-top: ${1 * GU}px;
  font-size: 15px;
  line-height: 26px;

  ${breakpoint(
    'medium',
    `
      font-size: 13px;
      line-height: 21px;
    `
  )}
`

const Wrapper = styled.aside`
  background: #fff;
  position: absolute;
  bottom: ${-2 * GU}px;
  right: ${-2 * GU}px;
  width: 100vw;
  height: 100vh;
  z-index: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;

  ${breakpoint(
    'medium',
    `
      bottom: calc(-40px - ${4 * GU}px);
      width: 336px;
      height: 482px;
      position: unset;
      border: 1px solid rgba(209, 209, 209, 0.5);
      box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.15);
      border-radius: 3px;
    `
  )}
`

const Header = styled.header`
  position: relative;
  height: 240px;
  background-color: #08bee5;
  color: ${theme.gradientText};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;

  ${breakpoint(
    'medium',
    `
      height: 148px;
      /* needs both height and min-height as button uses flex: 1
       * and would push this upwards */
      min-height: 148px;
      border-top-right-radius: 4px;
      border-top-left-radius: 4px;
    `
  )}
`

const HeaderImage = styled.img`
  position: absolute;
  bottom: -12px;
`

const Main = styled.main`
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: ${5 * GU}px ${3 * GU}px ${3 * GU}px;
`

const Heading = styled.h3`
  font-weight: bold;
  color: #352c47;
  font-size: 26px;
  line-height: 40px;

  ${breakpoint(
    'medium',
    `
      font-size: 20px;
      line-height: 31px;
    `
  )}
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
