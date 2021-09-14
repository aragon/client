import React from 'react'
import PropTypes from 'prop-types'
import { ProgressBar, GU } from '@aragon/ui'
import { Transition, animated } from 'react-spring'
import { ActivityStatusType } from '../../prop-types'
import { norm } from '../../util/math'
import { useNow } from '../../hooks'
import TimeTag from './TimeTag'
import {
  ACTIVITY_STATUS_CONFIRMED,
  ACTIVITY_STATUS_PENDING,
} from '../../symbols'

const MINUTE = 60 * 1000
const DELAY_BEFORE_HIDE = 1000

const TX_DURATION_AVERAGE = 3 * MINUTE
// threshold at which point we switch to displaying the indeterminate progress
// bar, so that the user doesn’t get confused by a completed progress bar.
const TX_DURATION_THRESHOLD = TX_DURATION_AVERAGE - MINUTE / 2

function getProgress(status, createdAt, estimate, threshold, now) {
  if (status === ACTIVITY_STATUS_CONFIRMED) {
    return 1
  }
  return now > threshold ? -1 : norm(now, createdAt, estimate)
}

const TransactionProgress = React.memo(function TransactionProgress({
  createdAt,
  minedAtEstimate,
  status,
}) {
  const now = useNow().getTime()

  // Only animate things if the panel is ready (opened).
  const estimate = createdAt + TX_DURATION_AVERAGE
  const threshold = createdAt + TX_DURATION_THRESHOLD

  const progress = getProgress(status, createdAt, estimate, threshold, now)
  const showConfirmed = status === ACTIVITY_STATUS_CONFIRMED
  const showTimer =
    !showConfirmed && now < threshold && status === ACTIVITY_STATUS_PENDING

  return (
    <Transition
      native
      delay={DELAY_BEFORE_HIDE}
      items={status === ACTIVITY_STATUS_PENDING}
      enter={{ height: 28, opacity: 1 }}
      leave={{ height: 0, opacity: 0 }}
    >
      {show =>
        show &&
        (transition => (
          <animated.div
            style={{
              display: 'flex',
              alignItems: 'center',
              paddingTop: `${1 * GU}px`,
              ...transition,
            }}
          >
            <div css="flex-grow: 1">
              <ProgressBar animate value={showConfirmed ? 1 : progress} />
            </div>
            {(showTimer || showConfirmed) && (
              <TimeTag
                date={estimate}
                label={showConfirmed ? 'confirmed' : null}
                css={`
                  margin-left: ${2 * GU}px;
                `}
              />
            )}
          </animated.div>
        ))
      }
    </Transition>
  )
})

TransactionProgress.propTypes = {
  // unix timestamps
  createdAt: PropTypes.number.isRequired,
  minedAtEstimate: PropTypes.number,
  status: ActivityStatusType.isRequired,
}

TransactionProgress.defaultProps = {
  minedAtEstimate: -1,
}

export default TransactionProgress
