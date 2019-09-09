import React, { useCallback, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { useTheme, BREAKPOINTS } from '@aragon/ui'
import { resolveEnsDomain } from '../../aragonjs-wrapper'
import ConnectModal from '../../components/ConnectModal/ConnectModal'
import { EthereumAddressType } from '../../prop-types'
import { log } from '../../utils'
import { saveTemplateState } from '../create-utils'
import {
  TEMPLATE_LOADING,
  TEMPLATE_AVAILABLE,
  TEMPLATE_UNAVAILABLE,
} from '../symbols'
import embeddedTemplates from '../../templates'
import Welcome from '../Welcome/Welcome'
import Create from '../Create/Create'
import OnboardingTopBar from './OnboardingTopBar'

const initialEmbeddedTemplates = embeddedTemplates.map(template => ({
  ...template,
  status: TEMPLATE_LOADING,
}))

function Onboarding({ account, status, selectorNetworks, walletWeb3, web3 }) {
  const theme = useTheme()
  const [connectModalOpened, setConnectModalOpened] = useState(false)
  const [templates, setTemplates] = useState(initialEmbeddedTemplates)
  const [templatesResolved, setTemplatesResolved] = useState(false)

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
    if (status === 'create' && !templatesResolved) {
      Promise.all(
        embeddedTemplates.map(async template => {
          try {
            const repoAddress = await resolveEnsDomain(template.id)
            return {
              repoAddress,
              status: TEMPLATE_AVAILABLE,
              ...template,
            }
          } catch (_) {
            return {
              status: TEMPLATE_UNAVAILABLE,
              ...template,
            }
          }
        })
      )
        .then(templatesWithRepoAddress => {
          if (!cancelled) {
            setTemplates(templatesWithRepoAddress)
            setTemplatesResolved(true)
          }
          return null
        })
        .catch(err => {
          log('Failed to resolve templates through ENS', err)
        })
    }
    return () => {
      cancelled = true
    }
  }, [status, templatesResolved])

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
            onBack={goToHome}
            onOpen={goToOpen}
            onOpenOrg={goToOrg}
            onCreate={handleCreate}
            openMode={status === 'open'}
            selectorNetworks={selectorNetworks}
          />
        )}
        {status === 'create' && Array.isArray(templates) && (
          <Create
            account={account}
            templates={templates}
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
  status: PropTypes.oneOf(['none', 'welcome', 'open', 'create']).isRequired,
  selectorNetworks: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.string))
    .isRequired,
  walletWeb3: PropTypes.object,
  web3: PropTypes.object,
}

export default Onboarding
