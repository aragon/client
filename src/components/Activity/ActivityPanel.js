import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Spring, animated } from 'react-spring'
import { Button } from '@aragon/ui'
import { ActivityContext } from '../../contexts/ActivityContext'
import ActivityList from './ActivityList'
import springs from '../../springs'

const ActivityPanel = ({ getAppByProxyAddress, open, onBlur, onClearAll }) => {
  const frameRef = React.createRef()
  const { activities, clearActivity } = React.useContext(ActivityContext)

  useEffect(() => {
    frameRef.current[open ? 'focus' : 'blur']()
  }, [frameRef.current, open])

  const handleBlur = e => {
    let _handler
    const currentTarget = e.currentTarget
    setTimeout(() => {
      if (!currentTarget.contains(document.activeElement)) {
        if (_handler) clearTimeout(_handler)
        _handler = setTimeout(() => open && onBlur(), 200)
      }
    }, 0)
  }

  return (
    <Spring
      native
      from={{ x: -300 }}
      to={{ x: open ? 0 : -300 }}
      config={springs.lazy}
    >
      {({ x }) => (
        <ActivityFrame
          ref={frameRef}
          onBlur={handleBlur}
          tabIndex="0"
          style={{
            transform: x.interpolate(x => `translate3d(${x}px,0,0)`),
          }}
        >
          <ActivityHeader>
            <div
              css={`
                display: flex;
                align-items: center;
              `}
            >
              <ActivityHeaderTitle>Activity</ActivityHeaderTitle>
            </div>
            <Button mode="text" onClick={onClearAll} css="margin-right: -15px">
              Clear all
            </Button>
          </ActivityHeader>
          <ActivityContent>
            <ActivityList
              activities={activities}
              keys={activity => activity.transactionHash}
              clearActivity={clearActivity}
              getAppByProxyAddress={getAppByProxyAddress}
            />
          </ActivityContent>
        </ActivityFrame>
      )}
    </Spring>
  )
}

ActivityPanel.propTypes = {
  open: PropTypes.bool,
  onBlur: PropTypes.func.isRequired,
  onClearAll: PropTypes.func.isRequired,
  getAppByProxyAddress: PropTypes.func.isRequired,
}

const ActivityFrame = styled(animated.div)`
  display: flex;
  flex-direction: column;
  position: absolute;
  width: 300px;
  height: 100%;
  background: #f1f6f8;
  box-shadow: 1px 0 15px 0 #e8e8e8;
  border-right: 1px solid #e8e8e8;
  z-index: 1000;
  outline: 0;
`

const ActivityHeader = styled.div`
  flex-shrink: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  height: 64px;
  border-bottom: 1px solid #e8e8e8;
`

const ActivityContent = styled.div`
  width: 100%;
  flex-grow: 1;
  overflow: auto;
`

const ActivityHeaderTitle = styled.h1`
  opacity: 0.7;
  font-size: 12px;
  color: #6d777b;
  letter-spacing: 0;
  line-height: 16px;
  text-align: left;
  text-transform: uppercase;
`

export default ActivityPanel
