import React, { useMemo } from 'react'
import PropTypes from 'prop-types'
import { springs, theme } from '@aragon/ui'
import { Transition, animated } from 'react-spring'
import ActivityItem from './ActivityItem'
import IconEmptyState from './IconEmptyState'

const ActivityList = ({
  activities,
  keys,
  clearActivity,
  getAppByProxyAddress,
}) => {
  const [activitiesReady, setActivitiesReady] = React.useState({})

  const activityItems = useMemo(
    () => activities.sort((a, b) => b.createdAt - a.createdAt),
    [activities, getAppByProxyAddress]
  )

  return (
    <div>
      {activityItems.length > 0 ? (
        <Transition
          native
          items={activityItems}
          keys={keys}
          trail={100}
          from={{ opacity: 0, height: 0, transform: 'translate3d(-20px,0,0)' }}
          enter={item => async next => {
            await next({ height: 'auto' })
            await next({ opacity: 1, transform: 'translate3d(0px,0,0)' }, true)

            const activityKey = keys(item)
            setActivitiesReady({ ...activitiesReady, [activityKey]: true })
          }}
          leave={[{ opacity: 1 }, { height: 0 }]}
          config={[{ ...springs.swift, precision: 1 }, springs.swift]}
        >
          {(activity, state) => props => {
            return (
              <animated.div style={props}>
                <ActivityItem
                  activity={activity}
                  getAppByProxyAddress={getAppByProxyAddress}
                  onClose={() => {
                    clearActivity(activity.transactionHash)
                  }}
                />
              </animated.div>
            )
          }}
        </Transition>
      ) : (
        <div
          css={`
            display: flex;
            flex-direction: column;
            align-items: center;
            width: 100%;
            padding: 64px 32px 24px;
          `}
        >
          <IconEmptyState />
          <p
            css={`
              margin-top: 10px;
              font-size: 14px;
              color: ${theme.textSecondary};
            `}
          >
            No activity yet.
          </p>
        </div>
      )}
    </div>
  )
}

ActivityList.propTypes = {
  activities: PropTypes.arrayOf(PropTypes.object).isRequired,
  keys: PropTypes.func.isRequired,
  clearActivity: PropTypes.func.isRequired,
  getAppByProxyAddress: PropTypes.func.isRequired,
}

export default ActivityList
