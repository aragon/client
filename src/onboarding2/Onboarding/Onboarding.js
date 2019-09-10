import React, { useCallback, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { Button, useTheme, BREAKPOINTS } from '@aragon/ui'
import { resolveEnsDomain } from '../../aragonjs-wrapper'
import { EthereumAddressType } from '../../prop-types'
import { log } from '../../utils'
import embeddedTemplates from '../../templates'
import ConnectModal from '../../components/ConnectModal/ConnectModal'

import { saveTemplateState } from '../create-utils'
import {
  TEMPLATE_LOADING,
  TEMPLATE_AVAILABLE,
  TEMPLATE_UNAVAILABLE,
} from '../symbols'
import Welcome from '../Welcome/Welcome'
import Create from '../Create/Create'
import OnboardingTopBar from './OnboardingTopBar'
import validateCreationRequirements from '../validate-requirements'

const initialEmbeddedTemplates = embeddedTemplates.map(template => ({
  ...template,
  status: TEMPLATE_LOADING,
}))

function Onboarding({
  account,
  balance,
  status,
  selectorNetworks,
  walletWeb3,
  web3,
}) {
  const theme = useTheme()
  const [connectModalOpened, setConnectModalOpened] = useState(false)
  const [templates, setTemplates] = useState(initialEmbeddedTemplates)
  const [templatesResolved, setTemplatesResolved] = useState(false)
  const [connectIntent, setConnectIntent] = useState('')
  const [requirementsError, setRequirementsError] = useState([null])

  const goToHome = useCallback(() => {
    window.location.hash = '/'
  }, [])

  const goToOpen = useCallback(() => {
    window.location.hash = '/open'
  }, [])

  const goToOrg = useCallback(domain => {
    window.location.hash = `/${domain}`
  }, [])

  // Update the requirements live if an error is being displayed,
  // on click otherwise (see handleCreate).
  useEffect(() => {
    const requirementsErrorUpdated = validateCreationRequirements(
      account,
      balance
    )

    if (
      requirementsError[0] !== null &&
      requirementsError[0] !== requirementsErrorUpdated[0]
    ) {
      setRequirementsError(requirementsErrorUpdated)
    }
  }, [account, balance, requirementsError])

  const handleCreate = useCallback(() => {
    // reset the creation state
    saveTemplateState({})

    const requirementsError = validateCreationRequirements(account, balance)
    setRequirementsError(requirementsError)

    // Account not connected
    if (requirementsError[0] === 'no-account') {
      setConnectIntent('create')
      setConnectModalOpened(true)
      return
    }

    // No error, we can go to create straight away
    if (requirementsError[0] === null) {
      window.location.hash = '/create'
    }
  }, [account, balance])

  const closeConnectModal = useCallback(
    provider => {
      setConnectModalOpened(false)
      setConnectIntent('')

      // Redirect to / if the modal get closed on /create
      // without having connected an account.
      if (status === 'create' && !account) {
        window.location.hash = '/'
      }
    },
    [account, status]
  )

  const handleProviderConnect = useCallback(
    provider => {
      closeConnectModal()

      // For now this is always true, but it may change in the future
      if (connectIntent === 'create') {
        window.location.hash = '/create'
      }
    },
    [closeConnectModal, connectIntent]
  )

  const connectProviderError = useCallback(
    (provider, err) => {
      closeConnectModal()
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

  useEffect(() => {
    if (status !== 'create') {
      return
    }

    // Even when connected, the account usually arrives after some delay.
    const id = setTimeout(() => {
      if (!account) {
        setConnectModalOpened(true)
      }
    }, 1000)

    return () => {
      clearTimeout(id)
    }
  }, [status, account])

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
            createError={requirementsError}
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
            onOpenOrg={goToOrg}
            templates={templates}
            walletWeb3={walletWeb3}
            web3={web3}
          />
        )}
      </div>
      <ConnectModal
        account={account}
        onClose={closeConnectModal}
        visible={connectModalOpened}
        onConnect={handleProviderConnect}
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
