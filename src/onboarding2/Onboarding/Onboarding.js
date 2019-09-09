import React, { useCallback, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { useTheme, BREAKPOINTS } from '@aragon/ui'
import { resolveEnsDomain } from '../../aragonjs-wrapper'
import ConnectModal from '../../components/ConnectModal/ConnectModal'
import { EthereumAddressType } from '../../prop-types'
import { saveTemplateState } from '../create-utils'
import templates from '../../templates'
import Welcome from '../Welcome/Welcome'
import Create from '../Create/Create'
import OnboardingTopBar from './OnboardingTopBar'

function Onboarding({ account, status, selectorNetworks, walletWeb3, web3 }) {
  const theme = useTheme()
  const [connectModalOpened, setConnectModalOpened] = useState(false)
  const [availableTemplates, setAvailableTemplates] = useState([])
  const [fetchingAvailableTemplates, setFetchingAvailableTemplates] = useState(
    false
  )

  const goToHome = useCallback(() => {
    window.location.hash = '/'
  }, [])

  const goToOpen = useCallback(() => {
    window.location.hash = '/open'
  }, [])

  const goToOrg = useCallback(domain => {
    window.location.hash = `/${domain}`
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

  const connectProviderError = useCallback(
    (provider, err) => {
      closeConnectModal()
      // TODO
    },
    [closeConnectModal]
  )

  useEffect(() => {
    let cancelled = false
    if (status === 'create') {
      setFetchingAvailableTemplates(true)
      Promise.all(
        templates.map(async template => {
          try {
            const repoAddress = await resolveEnsDomain(template.id)
            return {
              repoAddress,
              ...template,
            }
          } catch (_) {}

          // Only remove non-disabled ones
          return template.disabled ? template : null
        })
      )
        .then(templatesWithRepoAddress => {
          if (!cancelled) {
            const availableTemplates = templatesWithRepoAddress.filter(Boolean)
            setAvailableTemplates(availableTemplates)
            setFetchingAvailableTemplates(false)
          }
          return null
        })
        .catch(() => {
          if (!cancelled) {
            setAvailableTemplates(null)
            setFetchingAvailableTemplates(false)
          }
        })
    }
    return () => {
      cancelled = true
    }
  }, [status])

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
        min-width: ${BREAKPOINTS.min}px;
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
            fetchingTemplates={fetchingAvailableTemplates}
            noAvailableTemplates={availableTemplates == null}
            onBack={goToHome}
            onOpen={goToOpen}
            onOpenOrg={goToOrg}
            onCreate={handleCreate}
            openMode={status === 'open'}
            selectorNetworks={selectorNetworks}
          />
        )}
        {status === 'create' && Array.isArray(availableTemplates) && (
          <Create
            account={account}
            templates={availableTemplates}
            walletWeb3={walletWeb3}
            web3={web3}
          />
        )}
      </div>
      <ConnectModal
        onClose={closeConnectModal}
        visible={connectModalOpened}
        onConnect={connectProvider}
        onConnectError={connectProviderError}
      />
    </div>
  )
}

Onboarding.propTypes = {
  account: EthereumAddressType,
  status: PropTypes.string.isRequired,
  selectorNetworks: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.string))
    .isRequired,
  walletWeb3: PropTypes.object,
  web3: PropTypes.object,
}

export default Onboarding
