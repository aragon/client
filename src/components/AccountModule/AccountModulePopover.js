import React, { useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import { GU, Popover, springs, textStyle, useTheme } from '@aragon/ui'
import { Spring, animated } from 'react-spring'

const AnimatedSection = animated.section

function AccountModulePopover({
  animateHeight,
  children,
  height,
  heading,
  onClose,
  opener,
  visible,
  screenId,
  onOpen,
}) {
  const theme = useTheme()

  // TODO (min width)
  // const { width: vw } = useViewport()
  // maxWidth: `${Math.max(vw, 43 * GU)}px`,

  return (
    <Popover
      closeOnOpenerFocus
      onClose={onClose}
      opener={opener}
      placement="bottom-end"
      visible={visible}
      css={`
        width: ${51 * GU}px;
      `}
    >
      <Spring
        config={springs.smooth}
        from={{ height: `${38 * GU}px` }}
        to={{ height: `${height}px` }}
        immediate={!animateHeight}
        native
      >
        {({ height }) => (
          <AnimatedSection
            style={{ height }}
            css={`
              display: flex;
              flex-direction: column;
              overflow: hidden;
            `}
          >
            <h1
              css={`
                display: flex;
                flex-grow: 0;
                flex-shrink: 0;
                align-items: center;
                height: ${4 * GU}px;
                padding-left: ${2 * GU}px;
                border-bottom: 1px solid ${theme.border};
                color: ${theme.contentSecondary};
                ${textStyle('label2')};
              `}
            >
              {heading}
            </h1>
            <div
              css={`
                position: relative;
                flex-grow: 1;
                width: 100%;
              `}
            >
              {children}
            </div>
          </AnimatedSection>
        )}
      </Spring>
    </Popover>
  )
}

AccountModulePopover.propTypes = {
  animateHeight: PropTypes.bool.isRequired,
  children: PropTypes.node.isRequired,
  heading: PropTypes.node.isRequired,
  height: PropTypes.number.isRequired,
  onClose: PropTypes.func.isRequired,
  onOpen: PropTypes.func.isRequired,
  opener: PropTypes.any.isRequired,
  screenId: PropTypes.string.isRequired,
  visible: PropTypes.bool.isRequired,
}

export default AccountModulePopover
