import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { Transition, animated } from 'react-spring'
import { Button, springs, useViewport } from '@aragon/ui'
import Banner, { BANNER_HEIGHT } from '../Banner/Banner'
import { banner } from './content'

const SHOW_UPGRADE_MODAL_KEY = 'SHOW_UPGRADE_MODAL_FIRST_TIME'
const OCTOBER_1ST_2019 = new Date('October 1 2019 00:00').getTime()

const UpgradeBanner = React.memo(({ visible, onMoreInfo }) => {
  const { width } = useViewport()

  useEffect(() => {
    if (
      visible &&
      localStorage.getItem(SHOW_UPGRADE_MODAL_KEY) !== 'false' &&
      Date.now() < OCTOBER_1ST_2019
    ) {
      localStorage.setItem(SHOW_UPGRADE_MODAL_KEY, 'false')
      onMoreInfo()
    }
  }, [onMoreInfo, visible])

  return (
    <React.Fragment>
      <Transition
        items={visible}
        from={{ height: 0 }}
        enter={{ height: BANNER_HEIGHT }}
        leave={{ height: 0 }}
        config={springs.smooth}
        native
      >
        {visible =>
          visible &&
          /* eslint-disable react/prop-types */
          (({ height }) => (
            <animated.div style={{ overflow: 'hidden', height }}>
              <Banner
                text={width > 500 ? banner.text.large : banner.text.small}
                button={
                  <Button onClick={onMoreInfo} mode="normal" size="mini">
                    More info
                  </Button>
                }
                color="rgba(37, 49, 77, .75)"
                textColor="#FFFFFF"
              />
            </animated.div>
          ))
        /* eslint-enable react/prop-types */
        }
      </Transition>
    </React.Fragment>
  )
})

UpgradeBanner.propTypes = {
  onMoreInfo: PropTypes.func.isRequired,
  visible: PropTypes.bool,
}

export default UpgradeBanner
