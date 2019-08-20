import React, { useCallback, useState } from 'react'
import PropTypes from 'prop-types'
import { useTheme } from '@aragon/ui'
import ConnectModal from '../../components/ConnectModal/ConnectModal'
import OnboardingTopBar from './OnboardingTopBar'
import Welcome from '../Welcome/Welcome'
import Create from '../Create/Create'

function Onboarding({ status, selectorNetworks }) {
  const theme = useTheme()
  const [connectModalOpened, setConnectModalOpened] = useState(false)

  const goToHome = useCallback(() => {
    window.location.hash = '/'
  }, [])

  const goToOpen = useCallback(() => {
    window.location.hash = '/open'
  }, [])

  const openConnectModal = useCallback(() => {
    setConnectModalOpened(true)
  }, [])

  const closeConnectModal = useCallback(provider => {
    setConnectModalOpened(false)
  }, [])

  const connectProvider = useCallback(
    provider => {
      closeConnectModal()
      window.location.hash = '/create'
    },
    [closeConnectModal]
  )

  if (status === 'none') {
    return null
  }

  return (
    <div
      css={`
        position: relative;
        background: ${theme.background};
        height: 100vh;
        overflow-y: auto;
      `}
    >
      <OnboardingTopBar />
      {(status === 'welcome' || status === 'open') && (
        <Welcome
          onBack={goToHome}
          onOpen={goToOpen}
          onCreate={openConnectModal}
          openMode={status === 'open'}
          selectorNetworks={selectorNetworks}
        />
      )}
      {status === 'create' && <Create />}
      <ConnectModal
        onClose={closeConnectModal}
        visible={connectModalOpened}
        onConnect={connectProvider}
      />
    </div>
  )
}

Onboarding.propTypes = {
  status: PropTypes.string.isRequired,
  selectorNetworks: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.string))
    .isRequired,
}

export default Onboarding
