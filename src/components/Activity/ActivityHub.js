import React, { useMemo } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Transition, animated } from 'react-spring'
import {
  IconAttention,
  IconCheck,
  IconClose,
  IconError,
  SafeLink,
  blockExplorerUrl,
  theme,
} from '@aragon/ui'
import { activityStatusTypes } from '../../contexts/ActivityContext'
import { network } from '../../environment'
import TimeTag from './TimeTag'
import AppIcon from '../AppIcon/AppIcon'

const spring = { tension: 1900, friction: 200, precision: 0.0001, clamp: true }

function ActivityHub({
  activities,
  keys,
  clearActivity,
  getAppByProxyAddress,
}) {
  const [activitiesReady, setActivitiesReady] = React.useState({})

  const activityItems = useMemo(
    () => activities.sort((a, b) => b.createdAt - a.createdAt),
    [activities, getAppByProxyAddress]
  )

  return (
    <div>
      <Transition
        native
        items={activityItems}
        keys={keys}
        trail={100}
        from={{ opacity: 0, height: 0, transform: 'translate3d(-100%,0,0)' }}
        enter={item => async next => {
          await next({ height: 'auto' })
          await next({ opacity: 1, transform: 'translate3d(0%,0,0)' }, true)

          const activityKey = keys(item)
          setActivitiesReady({ ...activitiesReady, [activityKey]: true })
        }}
        leave={[{ opacity: 1 }, { height: 0 }]}
        config={[{ ...spring, precision: 1 }, spring]}
      >
        {(activity, state) => props => (
          <InnerContainer style={props} read={activity.read}>
            <CloseButton
              role="button"
              onClick={() => clearActivity(activity.transactionHash)}
            >
              <IconClose />
            </CloseButton>
            <ActivityItem
              activity={activity}
              getAppByProxyAddress={getAppByProxyAddress}
            />
          </InnerContainer>
        )}
      </Transition>
    </div>
  )
}

ActivityHub.propTypes = {
  activities: PropTypes.arrayOf(PropTypes.object).isRequired,
  keys: PropTypes.func.isRequired,
  clearActivity: PropTypes.func.isRequired,
  getAppByProxyAddress: PropTypes.func.isRequired,
}

function ActivityItem({ activity, getAppByProxyAddress, ready }) {
  // const [showPayload, setShowPayload] = React.useState(true)
  // eslint-disable-next-line react/prop-types
  // const isDone = props => props.p === 1 && setShowPayload(false)

  const app = getAppByProxyAddress(activity.targetAppProxyAddress)

  return (
    <Frame>
      <h1>
        <span css="flex-shrink: 0">
          <AppIcon app={app} />
        </span>
        <span
          css={`
            margin-left: 5px;
            white-space: nowrap;
          `}
        >
          {app ? app.name : 'Unknown'}
        </span>
      </h1>
      <h2>
        <TimeTag date={activity.createdAt} style={{ marginRight: 10 }} />
      </h2>
      <div>
        <p>{activity.description}</p>
        <StatusMessage activity={activity} />
      </div>
    </Frame>
  )
}

ActivityItem.propTypes = {
  activity: PropTypes.object.isRequired,
  ready: PropTypes.bool,
  getAppByProxyAddress: PropTypes.func.isRequired,
}

function getStatusData(activity) {
  const txLink = (
    <SafeLink
      target="_blank"
      href={blockExplorerUrl('transaction', activity.transactionHash, {
        networkType: network.type,
      })}
    >
      transaction
    </SafeLink>
  )
  if (activity.status === activityStatusTypes.CONFIRMED) {
    return [<IconCheck />, <span>Your {txLink} is confirmed.</span>]
  }
  if (activity.status === activityStatusTypes.FAILED) {
    return [<IconError />, <span>Your {txLink} failed.</span>]
  }
  if (activity.status === activityStatusTypes.TIMED_OUT) {
    return [<IconError />, <span>Your {txLink} timed out.</span>]
  }
  return [<IconAttention />, <span>Your {txLink} is pending.</span>]
}

const StatusMessage = ({ activity }) => {
  const [icon, content] = getStatusData(activity)
  return (
    <div
      css={`
        margin-top: 10px;
        a {
          color: ${theme.accent};
        }
      `}
    >
      {icon} {content}
    </div>
  )
}

StatusMessage.propTypes = {
  activity: PropTypes.object.isRequired,
}

const InnerContainer = styled(animated.div)`
  width: 100%;
  overflow: hidden;
  position: relative;
  transition: background 0.5s;
  background: ${p => (p.read ? 'transparent' : 'rgba(255, 255, 255, 0.6)')};
  &:after {
    content: '';
    position: absolute;
    width: 100%;
    height: 1px;
    bottom: 0;
    left: 0;
    background: ${theme.contentBorder};
  }
`

const Frame = styled.div`
  position: relative;
  width: 100%;
  padding: 20px;
  display: grid;
  grid-template-rows: 1fr;
  grid-template-areas:
    'title time'
    'content content';

  & > h1 {
    grid-area: title;
    display: flex;
    align-items: center;
    font-size: 16px;
    color: #000000;
    line-height: 22px;
  }
  & > h2 {
    grid-area: time;
    opacity: 0.7;
    font-size: 12px;
    font-weight: 600;
    color: #6d777b;
    letter-spacing: 0;
    text-align: right;
    line-height: 16px;
    white-space: nowrap;
    & > span {
      vertical-align: sub;
    }
  }
  & > div {
    grid-area: content;
    position: relative;
    margin-top: 10px;
    margin-bottom: 0;
    line-height: 22px;
    font-size: 15px;
    color: #000000;
    letter-spacing: 0;
    line-height: 22px;
  }
`

const CloseButton = styled('div')`
  position: absolute;
  right: 10px;
  top: 10px;
  transform: scale(0.9);
  cursor: pointer;
  z-index: 1;
`

export default ActivityHub
