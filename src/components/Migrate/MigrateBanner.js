import React, { useMemo, useCallback } from 'react'
import PropTypes from 'prop-types'
import { Transition, animated } from 'react-spring'
import { Button, springs, useViewport } from '@aragon/ui'
import Banner, { BANNER_HEIGHT } from '../Banner/Banner'
import { useRouting } from '../../routing'

const BANNER_TEXT = {
  large: 'Your DAO is eligible for the migration reward program.',
  compact: 'Migration Reward Program.',
}

const MigrateBanner = React.memo(({ visible, onClose }) => {
  const { width } = useViewport()
  const compact = useMemo(() => width < 570, [width])
  const bannerHeight = useMemo(() => (compact ? 70 : BANNER_HEIGHT), [compact])
  const routing = useRouting()

  const goToMigration = useCallback(() => {
    routing.update(({ mode }) => ({
      mode: {
        name: 'org',
        orgAddress: mode.orgAddress,
        instanceId: 'govern-migration',
      },
    }))
  }, [routing])

  return (
    <React.Fragment>
      <Transition
        items={visible}
        from={{ opacity: 0 }}
        enter={{ opacity: 1 }}
        leave={{ opacity: 0 }}
        config={springs.smooth}
        native
      >
        {visible =>
          visible &&
          /* eslint-disable react/prop-types */
          (({ opacity }) => (
            <animated.div style={{ opacity }}>
              <Banner
                text={compact ? BANNER_TEXT.compact : BANNER_TEXT.large}
                button={
                  <Button mode="normal" size="small" onClick={goToMigration}>
                    <span style={{ color: '#00C2FF', fontWeight: 'bold' }}>
                      Migrate!
                    </span>
                  </Button>
                }
                color="linear-gradient(107.79deg, #00ace2 1.46%, #02dfed 100%)"
                textColor="#FFFFFF"
                compact={compact}
                height={bannerHeight}
                onClose={onClose}
              />
            </animated.div>
          ))
        /* eslint-enable react/prop-types */
        }
      </Transition>
    </React.Fragment>
  )
})

MigrateBanner.propTypes = {
  onClose: PropTypes.func.isRequired,
  visible: PropTypes.bool,
}

export default MigrateBanner
