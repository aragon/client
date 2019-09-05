import React, { useCallback, useContext, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import { Spring, animated } from 'react-spring'
import {
  ButtonIcon,
  IconAlert,
  Popover,
  GU,
  Tag,
  springs,
  useTheme,
} from '@aragon/ui'
import ActivityList from '../../../components/Activity/ActivityList'
import { ActivityContext } from '../../../contexts/ActivityContext'
import { AppType } from '../../../prop-types'

const { div: AnimDiv } = animated

const ActivityButton = React.memo(function ActivityButton({ apps }) {
  const theme = useTheme()
  const [opened, setOpened] = useState(false)
  const { markActivitiesRead, unreadActivityCount } = useContext(
    ActivityContext
  )
  const containerRef = useRef()

  const handleToggle = useCallback(
    () =>
      setOpened(opened => {
        if (opened) {
          markActivitiesRead()
        }
        return !opened
      }),
    [markActivitiesRead]
  )
  const handleClose = useCallback(() => {
    markActivitiesRead()
    setOpened(false)
  }, [markActivitiesRead])

  return (
    <React.Fragment>
      <div ref={containerRef} css="width: 58px">
        <ButtonIcon
          element="div"
          onClick={handleToggle}
          css={`
            height: 100%;
            width: 100%;
            border-radius: 0;
            padding-left: ${0.5 * GU}px;
            justify-content: space-between;

            /* This is a bit of a hack to get the focus ring to appear only
             * around the button and not the spacer
             */
            &:focus:after {
              right: ${3 * GU}px;
            }
          `}
          label="Transaction activity"
        >
          <div
            css={`
              position: relative;
              line-height: 0;
            `}
          >
            <IconAlert
              css={`
                color: ${theme.hint};
              `}
            />
            <Spring
              native
              from={{ opacity: 0, size: 0 }}
              to={{
                opacity: unreadActivityCount > 0 ? 1 : 0,
                size: 1,
              }}
              config={springs.lazy}
            >
              {({ opacity, size }) => (
                <AnimDiv
                  css={`
                    position: absolute;
                    top: -${0.5 * GU}px;
                    right: -${0.5 * GU}px;
                  `}
                  style={{
                    opacity,
                    transform: size
                      .interpolate(
                        [0, 0.2, 0.4, 0.6, 0.8, 1],
                        [1.5, 1, 1.5, 1, 1.5, 1]
                      )
                      .interpolate(s => `scale(${s})`),
                  }}
                >
                  <Tag
                    limitDigits
                    mode="activity"
                    label={unreadActivityCount}
                  />
                </AnimDiv>
              )}
            </Spring>
          </div>
          {/* Spacer to extend the width of the button to the edge of the top bar */}
          <div
            css={`
              height: 100%;
              width: ${3 * GU}px;
              background: ${theme.surface};
            `}
          />
        </ButtonIcon>
      </div>
      <Popover
        closeOnOpenerFocus
        placement="bottom-end"
        onClose={handleClose}
        visible={opened}
        opener={containerRef.current}
      >
        <ActivityList apps={apps} />
      </Popover>
    </React.Fragment>
  )
})

ActivityButton.propTypes = {
  apps: PropTypes.arrayOf(AppType).isRequired,
}

export default ActivityButton
