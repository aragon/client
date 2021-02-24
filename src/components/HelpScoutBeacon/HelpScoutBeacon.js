import React, { useCallback, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Transition, animated } from 'react-spring'
import {
  Button,
  ButtonIcon,
  DiscButton,
  IconClose,
  IconQuestion,
  LoadingRing,
  Link,
  GU,
  RADIUS,
  springs,
  textStyle,
  useTheme,
  useViewport,
} from '@aragon/ui'
import useBeaconSuggestions from './useBeaconSuggestions'
import { useHelpScout } from './useHelpScout'
import BeaconHeadScripts from './BeaconHeadScripts'
import helpScoutHeaderPng from './assets/help-scout-header.png'
import { useClickOutside, useOnBlur } from '../../hooks'
import { AppType } from '../../prop-types'

const HELPSCOUT_BEACON_KEY = 'helpscout-beacon'
const CLOSED = Symbol('closed, user can open opt-in or beacon')
const OPENED = Symbol('opened, user can close opt-in or beacon')
const OPENING = Symbol('opening')
const CLOSING = Symbol('closing')
const DISC_BUTTON_HEIGHT = 40

const Beacon = React.memo(function Beacon({ apps }) {
  const [beaconReady, setBeaconReady] = useState(false)
  const [openOnReady, setOpenOnReady] = useState(false)
  const [optedIn, setOptedIn] = useState(
    localStorage.getItem(HELPSCOUT_BEACON_KEY) === '1'
  )
  const { above } = useViewport()

  const handleOptIn = () => {
    localStorage.setItem(HELPSCOUT_BEACON_KEY, '1')
    setOptedIn(true)
    setOpenOnReady(true)
  }
  const handleBeaconReady = useCallback(() => {
    if (openOnReady && window.Beacon) {
      window.Beacon('open')
      window.Beacon('once', 'open', () => {
        setBeaconReady(true)
        setOpenOnReady(false)
      })
    } else {
      setBeaconReady(true)
    }
  }, [openOnReady])

  useBeaconSuggestions({ apps, optedIn, beaconReady })

  return (
    <div
      css={`
        position: absolute;
        bottom: ${2 * GU}px;
        right: ${2 * GU}px;
        z-index: 2;

        ${above('large') &&
          `
            bottom: ${3 * GU}px;
            right: ${3 * GU}px;
          `}
      `}
    >
      <BeaconHeadScripts optedIn={optedIn} onReady={handleBeaconReady} />
      <HelpOptIn
        beaconReady={beaconReady}
        onOptIn={handleOptIn}
        optedIn={optedIn}
      />
    </div>
  )
})

Beacon.propTypes = {
  apps: PropTypes.arrayOf(AppType),
}

const HelpOptIn = React.memo(function HelpOptIn({
  beaconReady,
  onOptIn,
  optedIn,
}) {
  const { above } = useViewport()
  const expandedMode = above('medium')
  const [mode, setMode] = useState(CLOSED)
  const [beaconIframe, setBeaconIframe] = useState(null)

  // open and close atomic actions
  const handleClose = useCallback(() => {
    setMode(CLOSING)
    if (beaconReady) {
      window.Beacon('close')
    }
  }, [beaconReady])
  const handleOpen = useCallback(() => {
    setMode(OPENING)
    if (beaconReady) {
      window.Beacon('open')
    }
  }, [beaconReady])
  // toggle between states, based on whether beacon is ready or not
  const handleToggle = useCallback(() => {
    if (beaconReady) {
      if (mode === CLOSED || mode === CLOSING) {
        handleOpen()
      } else {
        handleClose()
      }
    } else if (mode !== CLOSING && mode !== OPENING) {
      if (mode === CLOSED) {
        handleOpen()
      } else {
        handleClose()
      }
    }
  }, [beaconReady, mode, handleClose, handleOpen])
  // used to avoid weird intermediate states by clicking rapidly the toggle button
  const handleToggleEnd = useCallback(() => {
    setMode(mode === OPENING ? OPENED : CLOSED)
  }, [mode])
  // takes care of closing modal when a click is registered outside of the container
  const handleClickOutside = useCallback(() => {
    if ((mode === OPENED || mode === OPENING) && expandedMode) {
      handleToggle()
    }
  }, [mode, handleToggle, expandedMode])
  // takes care of closing modal when losing focus of the opt-in modal
  const handleOptInBlur = useCallback(() => {
    if (!optedIn) {
      handleClickOutside()
    }
  }, [optedIn, handleClickOutside])
  // takes care of closing beacon modal when it loses focus
  const handleBeaconIframeBlur = useCallback(() => {
    if (mode === OPENED || mode === OPENING) {
      setTimeout(() => handleClose(), 100)
    }
  }, [mode, handleClose])

  const { ref: clickContainerRef } = useClickOutside(handleClickOutside)
  const { handleBlur } = useOnBlur(handleOptInBlur, clickContainerRef)

  useEffect(() => {
    if (beaconReady && window.Beacon) {
      window.Beacon('on', 'open', () => setMode(OPENED))
      window.Beacon('on', 'close', () => setMode(CLOSED))
    }
  }, [beaconReady])
  useEffect(() => {
    if (beaconReady && mode === OPENED && !beaconIframe) {
      // This iframe is mounted by the HelpScout Beacon API, and is expected to
      // stay mounted until Beacon('destroy') is called.
      // At the moment, we never destroy the Beacon, so we can assume it's
      // always mounted once the beacon is ready.
      // See https://developer.helpscout.com/beacon-2/web/javascript-api/#beacondestroy
      //
      // Note that the HelpScout API seems to do the mounting asynchronously, as
      // the iframe does not seem to be immediately available once window.Beacon
      // is loaded. However, we do know once the Beacon's been opened
      // (mode === OPENED) that the iframe is available.
      const iframe = document.querySelector('#beacon-container iframe')
      setBeaconIframe(iframe)
    }
  }, [beaconReady, mode, beaconIframe])
  useEffect(() => {
    if (beaconIframe) {
      beaconIframe.contentWindow.addEventListener(
        'blur',
        handleBeaconIframeBlur
      )
    }
    return () => {
      if (beaconIframe && beaconIframe.contentWindow) {
        beaconIframe.contentWindow.removeEventListener(
          'blur',
          handleBeaconIframeBlur
        )
      }
    }
  }, [beaconIframe, handleBeaconIframeBlur])

  return (
    <div ref={clickContainerRef} onBlur={handleBlur}>
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
                onOptIn={onOptIn}
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
    </div>
  )
})

HelpOptIn.propTypes = {
  beaconReady: PropTypes.bool.isRequired,
  onOptIn: PropTypes.func.isRequired,
  optedIn: PropTypes.bool.isRequired,
}

const ToggleDialogueButton = React.memo(({ open, onToggle }) => {
  const theme = useTheme()
  const { below } = useViewport()

  return (
    <DiscButton
      description="Help"
      onClick={onToggle}
      css={`
        display: flex;
        align-items: center;
        justify-content: center;
        margin-left: calc(100% - ${DISC_BUTTON_HEIGHT}px);
        margin-top: ${2 * GU}px;
        ${below('medium') &&
          `
            position: absolute;
            top: calc(-${DISC_BUTTON_HEIGHT}px - ${2 * GU}px);
          `}
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
                color={theme.helpContent}
                css={`
                  & path {
                    fill: ${theme.helpContent};
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
              <IconQuestion width={22} height={22} />
            </RoundButtonIcon>
          ))
        }
      </Transition>
    </DiscButton>
  )
})

ToggleDialogueButton.propTypes = {
  open: PropTypes.bool.isRequired,
  onToggle: PropTypes.func.isRequired,
}

const OptInDialogue = React.memo(({ onClose, onOptIn, optedIn, ...styles }) => {
  const theme = useTheme()
  const { below, above } = useViewport()

  return (
    <animated.div {...styles}>
      <aside
        css={`
          background: ${theme.helpSurface};
          position: absolute;
          bottom: ${-2 * GU}px;
          right: ${-2 * GU}px;
          width: 100vw;
          height: 100vh;
          z-index: 1;
          overflow: hidden;
          display: flex;
          flex-direction: column;

          ${above('medium') &&
            `
              bottom: calc(-${5 * GU}px - ${4 * GU}px);
              width: ${42 * GU}px;
              height: ${60.25 * GU}px;
              position: unset;
              box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.15);
              border-radius: ${RADIUS}px;
            `}
        `}
      >
        <header
          css={`
            position: relative;
            height: ${30 * GU}px;
            background-color: ${theme.help};
            display: flex;
            align-items: center;
            justify-content: center;
            flex-direction: column;

            ${above('medium') &&
              `
                // Needs both height and min-height as button
                // uses flex: 1 and would push this upwards.
                height: ${18.5 * GU}px;
                min-height: ${18.5 * GU}px;
                border-top-right-radius: ${RADIUS}px;
                border-top-left-radius: ${RADIUS}px;
              `}
          `}
        >
          {below('medium') && <CloseButton onClick={onClose} />}
          <img
            src={helpScoutHeaderPng}
            alt=""
            css={`
              width: 300px;
              height: 139px;
              position: absolute;
              bottom: -6px;
            `}
          />
        </header>
        <main
          css={`
            height: 100%;
            display: flex;
            flex-direction: column;
            padding: ${5 * GU}px ${3 * GU}px ${3 * GU}px;
            color: ${theme.helpSurfaceContent};
          `}
        >
          {!optedIn ? (
            <React.Fragment>
              <div css={'flex: 1'}>
                <h3
                  css={`
                    ${textStyle('title4')};
                  `}
                >
                  We need your consent.
                </h3>
                <Paragraph isSmall={above('medium')}>
                  We want to assist you in using the product, providing help,
                  and answers to common questions.
                </Paragraph>
                <Paragraph isSmall={above('medium')}>
                  For that, we use a third-party system called{' '}
                  <Link href="https://www.helpscout.com/" target="_blank">
                    HelpScout
                  </Link>
                  . If you opt-in, we will load their program onto Aragon.
                  HelpScout is a{' '}
                  <Link
                    target="_blank"
                    href="https://bcorporation.net/directory/help-scout"
                  >
                    Public Benefit Corp
                  </Link>
                  .
                </Paragraph>
              </div>
              <Button
                mode="strong"
                wide
                onClick={onOptIn}
                css={`
                  ${textStyle('label1')};
                  text-transform: unset;
                `}
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
              <LoadingRing />
              <div>Loading…</div>
            </div>
          )}
        </main>
      </aside>
    </animated.div>
  )
})

OptInDialogue.propTypes = {
  onClose: PropTypes.func.isRequired,
  onOptIn: PropTypes.func.isRequired,
  optedIn: PropTypes.bool.isRequired,
}

const CloseButton = React.memo(({ onClick, ...props }) => {
  const theme = useTheme()

  return (
    <ButtonIcon
      label="Close"
      onClick={onClick}
      css={`
        position: absolute;
        top: ${1 * GU}px;
        right: ${1 * GU}px;
        z-index: 1;
      `}
      {...props}
    >
      <IconClose
        color={theme.accentContent}
        css={`
          width: auto;
          height: 24px;

          & path {
            fill: ${theme.accentContent};
            opacity: 1;
          }
        `}
      />
    </ButtonIcon>
  )
})

function Paragraph({ children }) {
  const { above } = useViewport()

  return (
    <p
      css={`
        color: #5d6e7f;
        margin-top: ${1 * GU}px;
        font-size: 15px;
        line-height: 26px;
        ${above('medium') &&
          `
            font-size: 13px;
            line-height: 21px;
          `}
      `}
    >
      {children}
    </p>
  )
}

const RoundButtonIcon = styled(animated.div)`
  display: flex;
  position: absolute;
`

export default props => {
  const { optedOut } = useHelpScout()
  if (optedOut) {
    return null
  }
  return <Beacon {...props} />
}
