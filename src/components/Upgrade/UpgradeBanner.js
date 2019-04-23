import React, { useCallback, useState } from 'react'
import PropTypes from 'prop-types'
import { Button, Viewport } from '@aragon/ui'
import Banner from '../Banner/Banner'
import UpgradeModal from './UpgradeModal'
import { banner } from './content'

const UpgradeBanner = React.memo(({ onUpgrade }) => {
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
          <Banner
            text={width > 500 ? banner.text.large : banner.text.small}
            button={
              <Button onClick={handleMoreInfo} mode="normal" size="mini">
                More info
              </Button>
            }
            color="rgba(37, 49, 77, .75)"
            textColor="#FFFFFF"
          />
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
}

export default UpgradeBanner
