import React, { useCallback } from 'react'
import PropTypes from 'prop-types'
import { keyframes, css } from 'styled-components'
import { useTheme, textStyle, RADIUS, GU } from '@aragon/ui'
import AppIcon from '../AppIcon/AppIcon'
import { useClientTheme } from '../../client-theme'

const PREVIOUS = Symbol('PREVIOUS')
const CURRENT = Symbol('CURRENT')
const NEXT = Symbol('NEXT')

const ITEM_SPACING = 3.5 * GU

const pulseAnimation = keyframes`
  from {
    transform: scale3d(0.25, 0.25, 1);
    opacity: 0.5;
  }

  to {
    transform: scale3d(1.25, 1.25, 1);
    opacity: 0;
  }
`

function TransactionJourney({
  items,
  activeItem,
  pulse,
  themeColor,
  className,
}) {
  const theme = useTheme()
  const color = themeColor || theme.accent

  const getItemPosition = useCallback(
    itemIndex => {
      if (itemIndex === activeItem) {
        return CURRENT
      }

      if (itemIndex < activeItem) {
        return PREVIOUS
      }

      if (itemIndex > activeItem) {
        return NEXT
      }
    },
    [activeItem]
  )

  return (
    <div className={className}>
      <ul
        css={`
          list-style: none;
        `}
      >
        {items.map(([title, { app, content }], i) => {
          const status = getItemPosition(i)

          return (
            <JourneyItem
              key={i}
              title={title}
              app={app}
              status={status}
              isLastItem={i === items.length - 1}
              pulse={pulse}
              themeColor={color}
            >
              {content}
            </JourneyItem>
          )
        })}
      </ul>
    </div>
  )
}

TransactionJourney.defaultProps = {
  activeItem: 0,
  pulse: false,
}

TransactionJourney.propTypes = {
  activeItem: PropTypes.number,
  items: PropTypes.arrayOf(PropTypes.array).isRequired,
  className: PropTypes.string,
  pulse: PropTypes.bool,
  themeColor: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
}

/* eslint-disable react/prop-types */
function PulsePip({ className, size, themeColor }) {
  return (
    <div
      className={className}
      css={`
        position: relative;
        width: ${size}px;
        height: ${size}px;

        &::after,
        &::before {
          content: '';
          position: absolute;
          background-color: ${themeColor};
          border-radius: 100%;

          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
        }

        &::after {
          animation: ${pulseAnimation} 2s ease infinite;

          top: -${size}px;
          bottom: -${size}px;
          left: -${size}px;
          right: -${size}px;

          opacity: 0.2;
        }
      `}
    />
  )
}

function ProgressLine({ status, pulse, themeColor }) {
  const theme = useTheme()

  const pipSize = 1 * GU
  const pipOffset = ITEM_SPACING + 1.25 * GU

  const showHighlight = status === PREVIOUS || (status === CURRENT && pulse)
  const highlight = css`
    &::before {
      content: '';

      bottom: ${pulse && status === CURRENT ? pipOffset : 0}px;
      border-left: 1px solid ${themeColor};

      z-index: 1;
    }
  `

  return (
    <div
      css={`
        position: absolute;

        bottom: 0;
        top: 0;
        left: 50%;

        &::after,
        &::before {
          position: absolute;

          top: 0;
          left: 0;
        }

        &::after {
          content: '';
          bottom: 0;
          border-left: 1px dashed ${theme.surfaceOpened};
        }

        ${showHighlight && highlight};
      `}
    >
      {status === CURRENT && pulse && (
        <PulsePip
          size={pipSize}
          themeColor={themeColor}
          css={`
            position: absolute;

            left: -${pipSize / 2}px;
            bottom: ${pipOffset}px;

            z-index: 2;
          `}
        />
      )}
    </div>
  )
}

function JourneyItem({
  app,
  title,
  children,
  status,
  isLastItem,
  pulse,
  themeColor,
}) {
  const theme = useTheme()
  const { appearance } = useClientTheme()

  const disabled = status === NEXT

  const disabledIconStyle =
    appearance === 'light'
      ? disabledLightIconStyle
      : appearance === 'dark'
      ? disabledDarkIconStyle
      : ''

  return (
    <li
      css={`
        display: flex;
      `}
    >
      <div
        css={`
          position: relative;
          margin-right: ${2 * GU}px;
        `}
      >
        {!isLastItem && (
          <ProgressLine status={status} pulse={pulse} themeColor={themeColor} />
        )}

        <div
          css={`
            position: relative;
            overflow: hidden;
            z-index: 1;
            border-radius: ${RADIUS}px;
            background-color: ${theme.surfaceUnder};
          `}
        >
          <div
            css={`
              ${disabled && disabledIconStyle};
            `}
          >
            <AppIcon app={app} radius={0} size={5 * GU} />
          </div>
        </div>
      </div>
      <div
        css={`
          ${!isLastItem && `padding-bottom: ${ITEM_SPACING}px;`}
          color: ${disabled ? theme.contentSecondary : theme.content};
        `}
      >
        <h2
          css={`
            margin-top: ${-0.25 * GU}px;

            ${textStyle('body2')};
            font-weight: 600;
          `}
        >
          {title}
        </h2>

        {children}
      </div>
    </li>
  )
}

/* eslint-enable react/prop-types */

const disabledIconStyle = css`
  filter: grayscale(100%);
  mix-blend-mode: luminosity;
`

const disabledLightIconStyle = css`
  ${disabledIconStyle}
  opacity: 0.4;
`

const disabledDarkIconStyle = css`
  ${disabledIconStyle}
  opacity: 0.6;
`

export default TransactionJourney
