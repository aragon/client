import React, { useContext, useMemo } from 'react'
import PropTypes from 'prop-types'
import { Transition, animated } from 'react-spring'
import {
  ButtonText,
  GU,
  textStyle,
  springs,
  useTheme,
  useViewport,
} from '@aragon/ui'
import activityNoResults from '../../assets/activity-no-results.png'
import { ActivityContext } from '../../contexts/ActivityContext'
import { AppType } from '../../prop-types'
import { ACTIVITY_STATUS_PENDING } from '../../symbols'
import { addressesEqual } from '../../web3-utils'
import ActivityItem from './ActivityItem'

const MIN_HEIGHT_CLAMP = 57.5 * GU
const MAX_HEIGHT_CLAMP = 96 * GU
const MAX_HEIGHT_WINDOW_SCALE = 0.8
const HEADER_HEIGHT = 4 * GU

const getAppByProxyAddress = (proxyAddress, apps) =>
  apps.find(app => addressesEqual(app.proxyAddress, proxyAddress)) || null

function ActivityList({ apps }) {
  const theme = useTheme()
  const { height } = useViewport()
  const { activities, clearActivities } = useContext(ActivityContext)
  const activityItems = useMemo(
    () =>
      activities
        .sort((a, b) => b.createdAt - a.createdAt)
        .map(activity => ({
          ...activity,
          app: getAppByProxyAddress(activity.targetAppProxyAddress, apps),
        })),
    [activities, apps]
  )

  const canClear = useMemo(
    () =>
      activityItems.some(({ status }) => status !== ACTIVITY_STATUS_PENDING),
    [activityItems]
  )
  const maxHeight = Math.max(
    MIN_HEIGHT_CLAMP,
    Math.min(
      MAX_HEIGHT_CLAMP,
      Math.ceil(MAX_HEIGHT_WINDOW_SCALE * height - HEADER_HEIGHT)
    )
  )

  return (
    <div
      css={`
        width: ${42 * GU}px;
      `}
    >
      <div
        css={`
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: ${HEADER_HEIGHT}px;
          padding: 0 ${2 * GU}px;
          border-bottom: 1px solid ${theme.border};
        `}
      >
        <label
          css={`
            ${textStyle('label2')}
            color: ${theme.surfaceContentSecondary};
          `}
        >
          Activity
        </label>
        <ButtonText
          onClick={clearActivities}
          css={`
            padding: 0;
            ${textStyle('label2')}
          `}
        >
          Clear all
        </ButtonText>
      </div>
      {activityItems.length > 0 ? (
        <div
          css={`
            max-height: ${maxHeight}px;
            overflow-x: hidden;
            overflow-y: scroll;
          `}
        >
          <Transition
            native
            items={activityItems}
            keys={activity => activity.transactionHash}
            trail={50}
            enter={{
              opacity: 1,
              transform: 'translate3d(0px, 0, 0)',
            }}
            leave={{
              opacity: 0,
              transform: 'translate3d(20px, 0, 0)',
            }}
            config={springs.smooth}
          >
            {activity => transitionStyles => (
              <div
                css={`
                  & + & {
                    border-top: 1px solid ${theme.border};
                  }
                `}
              >
                <animated.div
                  style={{ ...transitionStyles, overflow: 'hidden' }}
                >
                  <ActivityItem activity={activity} />
                </animated.div>
              </div>
            )}
          </Transition>
        </div>
      ) : (
        <div
          css={`
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: ${28.5 * GU}px;
          `}
        >
          <img
            src={activityNoResults}
            alt="No results"
            height="125px"
            width="125px"
          />
          <span
            css={`
              margin-top: ${2 * GU}px;
              ${textStyle('body2')}
            `}
          >
            No activity yet!
          </span>
        </div>
      )}
    </div>
  )
}
ActivityList.propTypes = {
  apps: PropTypes.arrayOf(AppType).isRequired,
}

export default ActivityList
