import React from 'react'
import PropTypes from 'prop-types'
import { useTheme, textStyle, RADIUS, GU } from '@aragon/ui'
import { keyframes, css } from 'styled-components'

const STATUS_DISABLED = 'STATUS_DISABLED'
const STATUS_ACTIVE = 'STATUS_ACTIVE'
const STATUS_PREVIOUS = 'STATUS_PREVIOUS'

const ITEM_SPACING = 3.5 * GU

const pipPulseAnimation = css`
  animation: ${keyframes`
    from {
      transform: scale3d(0.25, 0.25, 1);
      opacity: 0.5;
    }

    to {
      transform: scale3d(1.25, 1.25, 1);
      opacity: 0;
    }
  `} 2s ease infinite;
`

function getItemStatus(i, activeIndex) {
  if (i < activeIndex) {
    return STATUS_PREVIOUS
  }

  if (i === activeIndex) {
    return STATUS_ACTIVE
  }

  if (i > activeIndex) {
    return STATUS_DISABLED
  }
}

function TransactionJourney({ items }) {
  // The active item is always second from last
  const activeIndex = items.length - 2

  const renderItems = () =>
    items.map(([title, { icon, content }], i) => {
      const status = getItemStatus(i, activeIndex)

      return (
        <JourneyItem key={i} title={title} icon={icon} status={status}>
          {content}
        </JourneyItem>
      )
    })

  return (
    <ul
      css={`
        list-style: none;
      `}
    >
      {renderItems()}
    </ul>
  )
}

/* eslint-disable react/prop-types */
function ProgressBorder({ currentlyActive }) {
  const theme = useTheme()

  const PIP_OFFSET = ITEM_SPACING + 1.25 * GU

  // Offset GU by a pixel to align border perfectly center against pip
  const PIP_SIZE = 1 * GU - 1

  return (
    <div
      css={`
        position: absolute;

        bottom: ${currentlyActive ? PIP_OFFSET : -PIP_OFFSET}px;
        top: 0;
        left: 50%;

        &::after,
        &::before {
          position: absolute;

          content: '';
          top: 0;
          left: 0;
        }

        &::after {
          bottom: 0;
          border-left: 1px solid ${theme.accent};
        }

        ${currentlyActive &&
          `&::before {
            bottom: -${PIP_OFFSET}px;
            border-left: 1px dashed ${theme.surfaceOpened};
          }`}
      `}
    >
      {currentlyActive && (
        <div
          css={`
            position: absolute;

            left: -${PIP_SIZE / 2}px;
            bottom: 0;

            width: ${PIP_SIZE}px;
            height: ${PIP_SIZE}px;

            z-index: 5;

            &:after,
            &:before {
              content: '';
              position: absolute;
              background-color: ${theme.accent};
              border-radius: 100%;
            }

            {/* Pulsing element */}
            &:after {
              ${pipPulseAnimation}

              top: -${PIP_SIZE}px;
              bottom: -${PIP_SIZE}px;
              left: -${PIP_SIZE}px;
              right: -${PIP_SIZE}px;

              opacity: 0.2;
            }

            {/* Pip */}
            &:before {
              top: 0;
              left: 0;
              right: 0;
              bottom: 0;
            }
          `}
        />
      )}
    </div>
  )
}

function JourneyItem({ icon, title, children, status }) {
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
        {status !== STATUS_DISABLED && (
          <ProgressBorder currentlyActive={status === STATUS_ACTIVE} />
        )}
        <div
          css={`
            position: relative;

            overflow: hidden;

            z-index: 1;
            width: ${5 * GU}px;
            height: ${5 * GU}px;

            background-color: ${theme.badge};

            border-radius: ${RADIUS}px;

            opacity: ${status === STATUS_DISABLED ? 0.75 : 1};

            &::after {
              content: '';
              position: absolute;

              top: 0;
              left: 0;
              right: 0;
              bottom: 0;

              background-image: url(${icon});

              ${status === STATUS_DISABLED &&
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
          ${status !== STATUS_DISABLED && `padding-bottom: ${ITEM_SPACING}px;`}
        `}
      >
        <h2
          css={`
            ${textStyle('body1')};

            line-height: 1.2;
            margin-top: ${0.5 * GU}px;
            margin-bottom: ${0.5 * GU}px;

            color: ${status === STATUS_DISABLED
              ? theme.contentSecondary
              : theme.content};
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

TransactionJourney.propTypes = {
  items: PropTypes.arrayOf(PropTypes.array),
}

export default TransactionJourney
