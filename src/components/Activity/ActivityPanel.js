import React, { useCallback, useEffect } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Button, ButtonIcon, theme, unselectable } from '@aragon/ui'
import { ActivityContext } from '../../contexts/ActivityContext'
import { AppType } from '../../prop-types'
import ActivityList from './ActivityList'
import IconArrowLeft from './IconArrowLeft'

export const ACTIVITY_PANEL_SHADOW_WIDTH = 15
export const ACTIVITY_PANEL_WIDTH = 300

export const ActivityPanelReadyContext = React.createContext(false)

const ActivityPanel = React.memo(
  ({ apps, displayBackButton, onClearAll, onClose, open, shouldClose }) => {
    const frameRef = React.createRef()
    const { activities, clearActivity } = React.useContext(ActivityContext)

    useEffect(() => {
      if (open) {
        frameRef.current.focus()
      }
    }, [frameRef, open])

    const handleBlur = useCallback(
      event => {
        const target = event.relatedTarget
        if (
          !frameRef.current.contains(target) &&
          shouldClose({ focusedElement: target })
        ) {
          onClose()
        }
      },
      [frameRef, onClose, shouldClose]
    )

    return (
      <ActivityPanelReadyContext.Provider value={open}>
        <ActivityFrame ref={frameRef} onBlur={handleBlur} tabIndex="0">
          <ActivityHeader>
            <div
              css={`
                display: flex;
                align-items: center;
              `}
            >
              {displayBackButton && (
                <ButtonIcon
                  onClick={onClose}
                  label="Close"
                  css={`
                    margin-left: -5px;
                    margin-right: 5px;
                    color: ${theme.accent};
                  `}
                >
                  <IconArrowLeft />
                </ButtonIcon>
              )}
              <ActivityHeaderTitle>Activity</ActivityHeaderTitle>
            </div>
            <Button mode="text" onClick={onClearAll} css="margin-right: -15px">
              Clear all
            </Button>
          </ActivityHeader>
          <ActivityContent>
            <ActivityList
              activities={activities}
              apps={apps}
              clearActivity={clearActivity}
            />
          </ActivityContent>
        </ActivityFrame>
      </ActivityPanelReadyContext.Provider>
    )
  }
)

ActivityPanel.propTypes = {
  apps: PropTypes.arrayOf(AppType).isRequired,
  displayBackButton: PropTypes.bool,
  onClearAll: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool,
  shouldClose: PropTypes.func.isRequired,
}

const ActivityFrame = styled.div`
  display: flex;
  flex-direction: column;
  position: absolute;
  width: 100%;
  height: 100%;
  background: ${theme.mainBackground};
  box-shadow: 1px 0 ${ACTIVITY_PANEL_SHADOW_WIDTH}px rgba(0, 0, 0, 0.1);
  border-right: 1px solid ${theme.contentBorder};
  z-index: 1000;
  outline: 0;
  ${unselectable};
`

const ActivityHeader = styled.div`
  flex-shrink: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  height: 64px;
  border-bottom: 1px solid ${theme.contentBorder};
`

const ActivityContent = styled.div`
  width: 100%;
  flex-grow: 1;
  overflow: auto;
`

const ActivityHeaderTitle = styled.h1`
  margin-top: 5px;
  color: ${theme.textSecondary};
  font-size: 12px;
  text-transform: uppercase;
`

export default ActivityPanel
