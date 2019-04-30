import React, { useContext } from 'react'
import PropTypes from 'prop-types'
import { ProgressBar } from '@aragon/ui'
import { Transition, animated } from 'react-spring'
import { ActivityStatusType } from '../../prop-types'
import { norm } from '../../math-utils'
import { activityStatusTypes } from '../../contexts/ActivityContext'
import { useNow } from '../../hooks'
import { ActivityPanelReadyContext } from './ActivityPanel'
import TimeTag from './TimeTag'

const MINUTE = 60 * 1000
const DELAY_BEFORE_HIDE = 1000

const TX_DURATION_AVERAGE = 3 * MINUTE
// threshold at which point we switch to displaying the indeterminate progress
// bar, so that the user doesn’t get confused by a completed progress bar.
const TX_DURATION_THRESHOLD = TX_DURATION_AVERAGE - MINUTE / 2

function getProgress(status, createdAt, estimate, threshold, now) {
  if (status === activityStatusTypes.CONFIRMED) {
    return 1
  }
  return now > threshold ? -1 : norm(now, createdAt, estimate)
}

const TransactionProgress = React.memo(
  ({ createdAt, minedAtEstimate, status }) => {
    const now = useNow().getTime()

    // Only animate things if the panel is ready (opened).
    const animate = useContext(ActivityPanelReadyContext)
    const estimate = createdAt + TX_DURATION_AVERAGE
    const threshold = createdAt + TX_DURATION_THRESHOLD

    const progress = getProgress(status, createdAt, estimate, threshold, now)
    const showConfirmed = status === activityStatusTypes.CONFIRMED
    const showTimer =
      !showConfirmed &&
      (now < threshold && status === activityStatusTypes.PENDING)

    return (
      <Transition
        native
        delay={DELAY_BEFORE_HIDE}
        items={status === activityStatusTypes.PENDING}
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
                paddingTop: '10px',
                ...transition,
              }}
            >
              <div css="flex-grow: 1">
                <ProgressBar
                  value={showConfirmed ? 1 : progress}
                  animate={animate}
                />
              </div>
              {(showTimer || showConfirmed) && (
                <TimeTag
                  date={estimate}
                  label={showConfirmed && 'confirmed'}
                  css="margin-left: 8px"
                />
              )}
            </animated.div>
          ))
        }
      </Transition>
    )
  }
)

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
