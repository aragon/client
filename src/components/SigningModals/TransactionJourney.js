import React, { useCallback } from 'react'
import PropTypes from 'prop-types'
import { keyframes, css } from 'styled-components'
import { useTheme, textStyle, RADIUS, GU } from '@aragon/ui'

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

function TransactionJourney({ items, activeItem, pulse, themeColor }) {
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
    <ul
      css={`
        list-style: none;
      `}
    >
      {items.map(([title, { icon, content }], i) => {
        const status = getItemPosition(i)

        return (
          <JourneyItem
            key={i}
            title={title}
            icon={icon}
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
  )
}

TransactionJourney.defaultProps = {
  activeItem: 0,
  pulse: false,
}

TransactionJourney.propTypes = {
  items: PropTypes.arrayOf(PropTypes.array).isRequired,
  activeItem: PropTypes.number,
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

        ${status !== NEXT && highlight}
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
  icon,
  title,
  children,
  status,
  isLastItem,
  pulse,
  themeColor,
}) {
  const theme = useTheme()

  return (
    <li
      css={`
        display: flex;
      `}
    >
      <div
        css={`
          position: relative;
          margin-right: ${2.5 * GU}px;
        `}
      >
        {!isLastItem && (
          <ProgressLine status={status} pulse={pulse} themeColor={themeColor} />
        )}
        <div
          css={`
            position: relative;
            display: flex;

            overflow: hidden;

            width: ${5 * GU}px;
            height: ${5 * GU}px;

            background-color: ${theme.badge};
            border-radius: ${RADIUS}px;
            z-index: 1;

            &::after {
              content: '';

              background-image: url(${icon});
              flex: 1;

              ${status === NEXT &&
                `filter: grayscale(97%);
                mix-blend-mode: hard-light;
                opacity: 0.8;
              `}
            }
          `}
        />
      </div>
      <div
        css={`
          ${!isLastItem && `padding-bottom: ${ITEM_SPACING}px;`}
          color: ${status === NEXT ? theme.contentSecondary : theme.content};
        `}
      >
        <h2
          css={`
            margin-bottom: ${0.5 * GU}px;

            ${textStyle('body1')};
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

export default TransactionJourney
