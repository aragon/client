import React, { useMemo } from 'react'
import PropTypes from 'prop-types'
import { springs, theme } from '@aragon/ui'
import { Transition, animated } from 'react-spring'
import { AppType } from '../../prop-types'
import { addressesEqual } from '../../web3-utils'
import ActivityItem from './ActivityItem'
import IconEmptyState from './IconEmptyState'

const getAppByProxyAddress = (proxyAddress, apps) =>
  apps.find(app => addressesEqual(app.proxyAddress, proxyAddress)) || null

const ActivityList = ({ apps, activities, keys, clearActivity }) => {
  const [activitiesReady, setActivitiesReady] = React.useState({})

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
              <animated.div style={{ ...props, overflow: 'hidden' }}>
                <ActivityItem
                  activity={activity}
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
  apps: PropTypes.arrayOf(AppType).isRequired,
  activities: PropTypes.arrayOf(PropTypes.object).isRequired,
  keys: PropTypes.func.isRequired,
  clearActivity: PropTypes.func.isRequired,
}

export default ActivityList
