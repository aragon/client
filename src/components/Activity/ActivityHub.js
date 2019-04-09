import React from 'react'
import PropTypes from 'prop-types'
import { Spring, Transition, animated } from 'react-spring'
import styled from 'styled-components'
import { theme, IconClose } from '@aragon/ui'
import TimeTag from './TimeTag'
import { activityStatusTypes } from '../../contexts/ActivityContext'

const spring = { tension: 1900, friction: 200, precision: 0.0001, clamp: true }

function ActivityHub({ activities, keys, clearActivity }) {
  const [activitiesReady, setActivitiesReady] = React.useState({})

  return (
    <div>
      <Transition
        native
        items={activities}
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
          <InnerContainer style={props}>
            <CloseButton
              role="button"
              onClick={() => clearActivity(activity.transactionHash)}
            >
              <IconClose />
            </CloseButton>
            <ActivityItem activity={activity} />
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
}

function ActivityItem({ ready, activity }) {
  const [showPayload, setShowPayload] = React.useState(true)
  // eslint-disable-next-line react/prop-types
  const isDone = props => props.p === 1 && setShowPayload(false)

  return (
    <Frame>
      <h1>
        <span>{activity.description}</span>
      </h1>
      <h2 />
      <div>
        {' '}
        <TimeTag date={activity.createdAt} style={{ marginRight: 10 }} />
        Status {activity.status}
      </div>
      {activity.status === activityStatusTypes.PENDING && (
        <Spring
          native
          delay={400}
          from={{ opacity: 1 }}
          to={{ opacity: showPayload ? 1 : 0.5 }}
        >
          {props => (
            <Progress style={props}>
              <ProgressTrack>
                <Spring
                  native
                  delay={ready ? 500 : 0}
                  from={{ p: 0 }}
                  to={{ p: ready ? 1 : 0 }}
                  onRest={isDone}
                >
                  {p => (
                    <ProgressBar
                      style={{
                        background: theme.accent,
                        width: p.p.interpolate(p => `${p * 100}%`),
                      }}
                    />
                  )}
                </Spring>
              </ProgressTrack>
              <span>Estimated:</span>
              <span>- min -- sec</span>
            </Progress>
          )}
        </Spring>
      )}
    </Frame>
  )
}

ActivityItem.propTypes = {
  activity: PropTypes.object.isRequired,
  ready: PropTypes.bool,
}

const InnerContainer = styled(animated.div)`
  width: 100%;
  overflow: hidden;
  font-family: MaisonNeue-Demi;
  position: relative;
  transition: background 0.5s;
  &:first-of-type {
    background: white;
  }
  &:after {
    content: '';
    position: absolute;
    width: 100%;
    height: 1px;
    bottom: 0;
    left: 0;
    background: #e8e8e8;
  }
`

const Frame = styled('div')`
  position: relative;
  width: 100%;
  padding: 20px;
  display: grid;
  grid-template-rows: 1fr;
  grid-template-areas:
    'title time'
    'content content';

  & > h1 {
    margin-top: 0;
    grid-area: title;
    font-size: 14px;
    color: #000000;
    line-height: 22px;
  }
  & > h2 {
    margin-top: 0;
    grid-area: time;
    opacity: 0.7;
    font-size: 12px;
    color: #6d777b;
    letter-spacing: 0;
    text-align: right;
    line-height: 16px;
    & > span {
      vertical-align: sub;
    }
  }
  & > div {
    position: relative;
    grid-area: content;
    margin-top: 0;
    margin-bottom: 0;
    line-height: 22px;
    font-family: MaisonNeue-Book;
    font-size: 15px;
    color: #000000;
    letter-spacing: 0;
    line-height: 22px;

    & p {
      margin-block-start: 1em;
      margin-block-end: 1em;
      margin-inline-start: 0px;
      margin-inline-end: 0px;
    }
  }
`

const Progress = styled(animated.div)`
  overflow: hidden;
  display: grid;
  grid-template-areas:
    'progress progress'
    'label time';
  & > span {
    opacity: 0.7;
    font-size: 12px;
    color: #6d777b;
    letter-spacing: 0;
    text-align: right;
    line-height: 16px;
    padding-top: 10px;
    padding-bottom: 0px;
  }
  & > span:nth-of-type(1) {
    grid-area: label;
    text-align: left;
  }
  & > span:nth-of-type(2) {
    grid-area: time;
    text-align: right;
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

const ProgressTrack = styled('div')`
  width: 100%;
  background: #edf3f6;
  border-radius: 2px;
  height: 6px;
  grid-area: progress;
`

const ProgressBar = styled(animated.div)`
  background: #21d48e;
  border-radius: 2px;
  height: 6px;
`

export default ActivityHub
