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
  const { unreadActivityCount } = useContext(ActivityContext)
  const containerRef = useRef()

  const handleToggle = useCallback(() => setOpened(opened => !opened), [])
  const handleClose = useCallback(() => setOpened(false), [])

  return (
    <React.Fragment>
      <div ref={containerRef}>
        <ButtonIcon
          onClick={handleToggle}
          css={`
            height: 100%;
            border-radius: 0;
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
