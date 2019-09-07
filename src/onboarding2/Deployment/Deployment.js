import React from 'react'
import {
  Button,
  GU,
  RADIUS,
  springs,
  textStyle,
  useTheme,
  useViewport,
} from '@aragon/ui'
import { Transition, animated } from 'react-spring'
import { TITLE_ONBOARDING } from '../styles'

import progressImgLarge from './assets/illustration-progress-large.svg'
import progressImgMedium from './assets/illustration-progress-medium.svg'
import allDoneImg from './assets/illustration-all-done.png'

const AnimDiv = animated.div
const AnimSection = animated.section

function BoxBase({
  children,
  flexDirection = 'column',
  background,
  opacity,
  boxTransform,
}) {
  const theme = useTheme()
  const { below } = useViewport()
  const fullWidth = below('large')
  return (
    <AnimDiv
      style={{ opacity }}
      css={`
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        overflow: auto;
        flex-grow: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: ${fullWidth ? 0 : 8 * GU}px;
        background: ${background || theme.background};
      `}
    >
      <AnimSection
        style={{ transform: boxTransform }}
        css={`
          flex-grow: 1;
          display: ${flexDirection === 'column' ? 'grid' : 'flex'};
          flex-direction: ${flexDirection};
          align-items: center;
          justify-content: center;
          max-width: ${fullWidth ? 'none' : `${128 * GU}px`};
          height: ${fullWidth ? 'auto' : `${80 * GU}px`};
          background: ${theme.surface};
          border-radius: ${fullWidth ? 0 : RADIUS}px;
          box-shadow: ${fullWidth ? 'none' : '0px 4px 6px rgba(0, 0, 0, 0.05)'};
          position: ${fullWidth ? 'absolute' : 'static'};
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          overflow: ${fullWidth ? 'auto' : 'visible'};
        `}
      >
        {children}
      </AnimSection>
    </AnimDiv>
  )
}

function BoxProgress({ opacity, boxTransform }) {
  const theme = useTheme()
  const { below } = useViewport()
  const fullWidth = below('large')

  return (
    <BoxBase
      opacity={opacity}
      boxTransform={boxTransform}
      flexDirection={fullWidth ? 'column' : 'row-reverse'}
      background="linear-gradient(
        328deg,
        #95bbce 0%,
        #c5d0e6 46.04%,
        #e7e4f6 100%
      )"
    >
      <div
        css={`
          width: ${fullWidth ? 100 : 50}%;
          height: ${fullWidth ? '430px' : '100%'};
          background: #bbcbe1 50% 50% / cover no-repeat
            url(${fullWidth ? progressImgMedium : progressImgLarge});
        `}
      />
      <div
        css={`
          display: flex;
          flex-direction: column;
          justify-content: center;
          width: ${fullWidth ? 100 : 50}%;
          height: ${fullWidth ? 'auto' : '100%'};
          padding: ${6 * GU}px;
        `}
      >
        <h1
          css={`
              ${TITLE_ONBOARDING}
              margin-bottom: ${2 * GU}px;
            `}
        >
          21st century <span css="color: #8DB9D5">organizations</span>
        </h1>
        <p
          css={`
            ${textStyle('body1')}
            line-height: 2;
            color: ${theme.surfaceContentSecondary};
          `}
        >
          Aragon organizations are digital natives.
          <br /> They live on Ethereum, a ledger secured by incentives and
          cryptography. No one can take your organization away from you.
        </p>
      </div>
    </BoxBase>
  )
}

function BoxReady({ opacity, boxTransform }) {
  const { below } = useViewport()
  const fullWidth = below('large')
  const small = below('medium')
  return (
    <BoxBase opacity={opacity} boxTransform={boxTransform}>
      <div
        css={`
          ${small ? textStyle('title1') : TITLE_ONBOARDING}
          text-align: center;
          padding: ${6 * GU}px ${small ? 6 * GU : 10 * GU}px;
        `}
      >
        <img
          src={allDoneImg}
          alt=""
          width="253"
          height="206"
          css={`
            width: ${fullWidth ? 230 : 253}px;
            height: auto;
          `}
        />
        <div
          css={`
            margin: ${6 * GU}px 0;
          `}
        >
          <p>
            <strong>All done!</strong>
          </p>
          <p css="font-weight: 400">Your decentralized organization is ready</p>
          <Button label="Get started" mode="strong" href="/" external={false} />
        </div>
      </div>
    </BoxBase>
  )
}

const Deployment = React.memo(function Deployment({ ready }) {
  return (
    <Transition
      native
      reset
      unique
      items={ready}
      from={{ opacity: 0, transform: `translate3d(10%, 0, 0)` }}
      enter={{ opacity: 1, transform: `translate3d(0%, 0, 0)` }}
      leave={{ opacity: 0, transform: `translate3d(-10%, 0, 0)` }}
      config={springs.smooth}
    >
      {ready => ({ opacity, transform }) =>
        ready ? (
          <BoxReady opacity={opacity} boxTransform={transform} />
        ) : (
          <BoxProgress opacity={opacity} boxTransform={transform} />
        )}
    </Transition>
  )
})

export default Deployment
