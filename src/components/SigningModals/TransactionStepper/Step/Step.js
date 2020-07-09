import React, { useCallback, useState, useMemo } from 'react'
import PropTypes from 'prop-types'
import { Transition, animated } from 'react-spring'
import { GU, TransactionBadge, springs, textStyle, useTheme } from '@aragon/ui'
import {
  STEP_ERROR,
  STEP_PROMPTING,
  STEP_SUCCESS,
  STEP_WAITING,
  STEP_WORKING,
} from '../stepper-statuses'

import Divider from './Divider'
import StatusVisual from './StatusVisual'

const BADGE_OFFSET = 4.5 * GU

const AnimatedSpan = animated.span

function Step({
  title,
  status,
  number,
  className,
  transactionHash,
  showDivider,
}) {
  const theme = useTheme()
  const [firstStart, setFirstStart] = useState(true)

  const { desc, visualColor, descColor } = useMemo(() => {
    const appearance = {
      [STEP_WAITING]: {
        desc: 'Waiting for signature',
        visualColor: theme.accent,
        descColor: theme.contentSecondary,
      },
      [STEP_PROMPTING]: {
        desc: 'Waiting for signature',
        visualColor: theme.accent,
        descColor: theme.contentSecondary,
      },
      [STEP_WORKING]: {
        desc: 'Transaction being mined',
        visualColor: theme.accent,
        descColor: theme.accent,
      },
      [STEP_SUCCESS]: {
        desc: 'Transaction confirmed',
        visualColor: theme.positive,
        descColor: theme.positive,
      },
      [STEP_ERROR]: {
        desc: 'An error has occured',
        visualColor: theme.negative,
        descColor: theme.negative,
      },
    }

    const { desc, descColor, visualColor } = appearance[status]

    return {
      desc,
      visualColor: `${visualColor}`,
      descColor: `${descColor}`,
    }
  }, [status, theme])

  const onStart = useCallback(() => {
    // Don’t animate on first render
    if (firstStart) {
      setFirstStart(false)
    }
  }, [firstStart])

  return (
    <React.Fragment>
      <div
        className={className}
        css={`
          display: flex;
          flex-direction: column;
          align-items: center;

          padding-top: ${BADGE_OFFSET}px;

          width: ${23 * GU}px;
        `}
      >
        <StatusVisual
          status={status}
          color={visualColor}
          number={number}
          css={`
            margin-bottom: ${3 * GU}px;
          `}
        />
        <h2
          css={`
            ${textStyle('title4')}

            line-height: 1.2;
            text-align: center;
            margin-bottom: ${1 * GU}px;
          `}
        >
          {status === STEP_ERROR ? 'Transaction failed' : title}
        </h2>

        <p
          css={`
            width: 100%;
            position: relative;
            text-align: center;
            color: ${theme.contentSecondary};
            line-height: 1.2;
          `}
        >
          <Transition
            config={springs.smooth}
            items={desc}
            onStart={onStart}
            immediate={status === STEP_PROMPTING || firstStart}
            from={{
              opacity: 0,
              transform: `translate3d(0, ${2 * GU}px, 0)`,
            }}
            enter={{
              opacity: 1,
              transform: 'translate3d(0, 0, 0)',
              color: descColor,
            }}
            leave={{
              position: 'absolute',
              opacity: 0,
              transform: `translate3d(0, -${2 * GU}px, 0)`,
            }}
            native
          >
            {description =>
              description &&
              (props => (
                <AnimatedSpan
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    left: 0,
                    top: 0,
                    width: '100%',
                    ...props,
                  }}
                >
                  {description}
                </AnimatedSpan>
              ))
            }
          </Transition>
        </p>
        <div
          css={`
            display: flex;
            position: relative;

            width: 100%;

            /* Avoid visual jump when showing tx by pre-filling space */
            height: ${BADGE_OFFSET}px;
          `}
        >
          {transactionHash && (
            <div
              css={`
                display: flex;

                flex: 1;
                align-items: center;
                justify-content: flex-end;
                flex-direction: column;

                width: 100%;
              `}
            >
              <Transition
                config={springs.smooth}
                items={transactionHash}
                onStart={onStart}
                immediate={firstStart}
                from={{
                  opacity: 0,
                  transform: `translate3d(0, ${1 * GU}px, 0)`,
                }}
                enter={{
                  opacity: 1,
                  transform: 'translate3d(0, 0, 0)',
                }}
                leave={{
                  opacity: 0,
                  transform: `translate3d(0, -${1 * GU}px, 0)`,
                }}
                native
              >
                {currentHash => animProps => (
                  <AnimatedSpan
                    style={{
                      position: 'absolute',
                      left: 0,
                      bottom: 0,
                      display: 'flex',
                      justifyContent: 'center',
                      width: '100%',
                      ...animProps,
                    }}
                  >
                    <TransactionBadge transaction={currentHash} />
                  </AnimatedSpan>
                )}
              </Transition>
            </div>
          )}
        </div>
      </div>
      {showDivider && (
        <Divider
          color={visualColor}
          css={`
            position: relative;
            top: ${BADGE_OFFSET + 6 * GU}px;
          `}
        />
      )}
    </React.Fragment>
  )
}

Step.propTypes = {
  title: PropTypes.string,
  transactionHash: PropTypes.string,
  className: PropTypes.string,
  number: PropTypes.number,
  status: PropTypes.oneOf([
    STEP_WAITING,
    STEP_PROMPTING,
    STEP_WORKING,
    STEP_SUCCESS,
    STEP_ERROR,
  ]).isRequired,
  showDivider: PropTypes.bool,
}

export default Step
