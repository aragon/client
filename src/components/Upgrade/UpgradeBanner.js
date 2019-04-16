import React, { useCallback, useState } from 'react'
import { Button, Viewport } from '@aragon/ui'
import Banner from '../Banner/Banner'
import UpgradeModal from './UpgradeModal'
import { banner } from './content'

const UpgradeBanner = () => {
  const [showModal, setShowModal] = useState(false)
  const handleClick = useCallback(() => {
    setShowModal(true)
  }, [setShowModal])
  return (
    <React.Fragment>
      <Viewport>
        {({ width }) => (
          <Banner
            text={width > 500 ? banner.text.large : banner.text.small}
            button={
              <Button onClick={handleClick} mode="normal" size="mini">
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
        onClose={() => {
          setShowModal(false)
        }}
        onUpgrade={() => {
          setShowModal(false)
        }}
      />
    </React.Fragment>
  )
}

export default UpgradeBanner
