import React, { useCallback, useState } from 'react'
import PropTypes from 'prop-types'
import { Transition, animated } from 'react-spring'
import { Button, Viewport, springs } from '@aragon/ui'
import Banner, { BANNER_HEIGHT } from '../Banner/Banner'
import UpgradeModal from './UpgradeModal'
import { banner } from './content'

const UpgradeBanner = React.memo(({ visible, onUpgrade }) => {
  const [showModal, setShowModal] = useState(false)

  const handleMoreInfo = useCallback(() => {
    setShowModal(true)
  }, [setShowModal])

  const handleModalClose = useCallback(() => {
    setShowModal(false)
  }, [setShowModal])

  const handleUpgrade = useCallback(() => {
    setShowModal(false)
    onUpgrade()
  }, [setShowModal, onUpgrade])

  return (
    <React.Fragment>
      <Viewport>
        {({ width }) => (
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
                      <Button
                        onClick={handleMoreInfo}
                        mode="normal"
                        size="mini"
                      >
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
        )}
      </Viewport>
      <UpgradeModal
        visible={showModal}
        onClose={handleModalClose}
        onUpgrade={handleUpgrade}
      />
    </React.Fragment>
  )
})

UpgradeBanner.propTypes = {
  onUpgrade: PropTypes.func.isRequired,
  visible: PropTypes.bool,
}

export default UpgradeBanner
