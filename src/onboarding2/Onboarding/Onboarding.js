import React, { useCallback, useState } from 'react'
import PropTypes from 'prop-types'
import { useTheme } from '@aragon/ui'
import ConnectModal from '../../components/ConnectModal/ConnectModal'
import { saveTemplateState } from '../create-utils'
import Welcome from '../Welcome/Welcome'
import Create from '../Create/Create'
import OnboardingTopBar from './OnboardingTopBar'

function Onboarding({ status, selectorNetworks }) {
  const theme = useTheme()
  const [connectModalOpened, setConnectModalOpened] = useState(false)

  const goToHome = useCallback(() => {
    window.location.hash = '/'
  }, [])

  const goToOpen = useCallback(() => {
    window.location.hash = '/open'
  }, [])

  const handleCreate = useCallback(() => {
    // reset the creation state
    saveTemplateState({})

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
        z-index: 1;
        background: ${theme.background};
        height: 100vh;
        overflow-y: auto;
      `}
    >
      <OnboardingTopBar onHome={goToHome} />
      <div
        css={`
          position: relative;
          z-index: 1;
          height: 100%;
        `}
      >
        {(status === 'welcome' || status === 'open') && (
          <Welcome
            onBack={goToHome}
            onOpen={goToOpen}
            onCreate={handleCreate}
            openMode={status === 'open'}
            selectorNetworks={selectorNetworks}
          />
        )}
        {status === 'create' && <Create />}
      </div>
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
