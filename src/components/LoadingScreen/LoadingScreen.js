import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { springs, useTheme } from '@aragon/ui'
import { Transition, animated } from 'react-spring'
import AnimatedLogo from './AnimatedLogo'

const HIDE_DELAY = 500

const LoadingScreen = React.memo(function LoadingScreen({
  title,
  progress,
  ...props
}) {
  const [visible, setVisible] = useState(true)
  const theme = useTheme()

  // Update `visible` based on the current progress
  useEffect(() => {
    let timer = null
    if (progress === 1 && visible) {
      timer = setTimeout(() => setVisible(false), HIDE_DELAY)
    } else if (progress !== 1 && !visible) {
      setVisible(true)
    }
    return () => clearTimeout(timer)
  }, [progress, visible])

  return (
    <Transition
      items={visible}
      initial={{ opacity: 1 }}
      from={{ opacity: 0 }}
      enter={{ opacity: 1 }}
      leave={{ opacity: 0 }}
      config={springs.instant}
      native
    >
      {visible =>
        visible &&
        /* eslint-disable react/prop-types */
        (({ opacity }) => (
          <animated.div
            style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              opacity,
            }}
            {...props}
          >
            <div
              aria-busy="true"
              aria-live="polite"
              css={`
                display: flex;
                justify-content: center;
                align-items: center;
                flex-direction: column;
                width: 100%;
                height: 100%;
                background: ${theme.background};
              `}
            >
              <AnimatedLogo done={progress === 1} />
              <div
                css={`
                  font-size: 18px;
                `}
              >
                {title}
              </div>
            </div>
          </animated.div>
        ))
      /* eslint-enable react/prop-types */
      }
    </Transition>
  )
})

LoadingScreen.propTypes = {
  progress: PropTypes.number,
  title: PropTypes.string,
}

LoadingScreen.defaultProps = {
  progress: -1,
  title: 'Loading…',
}

export default LoadingScreen
