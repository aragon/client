import React, { useCallback, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { useTheme, BREAKPOINTS } from '@aragon/ui'
import throttle from 'lodash.throttle'
import { resolveEnsDomain } from '../../aragonjs-wrapper'
import { log } from '../../utils'
import embeddedTemplates from '../../templates'
import ConnectModal from '../../components/ConnectModal/ConnectModal'

import { saveTemplateState } from '../create-utils'
import {
  TEMPLATE_LOADING,
  TEMPLATE_AVAILABLE,
  TEMPLATE_UNAVAILABLE,
} from '../symbols'
import { useAccount } from '../../account'
import Welcome from '../Welcome/Welcome'
import Create from '../Create/Create'
import validateCreationRequirements from '../validate-requirements'
import OnboardingTopBar from './OnboardingTopBar'

const sortedEmbeddedTemplates = Array.from(embeddedTemplates).sort(
  (first, second) => {
    // Put new templates first and disabled templates last
    first = first.disabled ? -1 : first.new ? 1 : 0
    second = second.disabled ? -1 : second.new ? 1 : 0
    return second - first
  }
)

const initialEmbeddedTemplates = sortedEmbeddedTemplates.map(template => ({
  ...template,
  status: TEMPLATE_LOADING,
}))

function Onboarding({ status, selectorNetworks, walletWeb3, web3 }) {
  const theme = useTheme()
  const {
    balance,
    address: account,
    isContract: isContractAccount,
  } = useAccount()

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
      balance,
      isContractAccount
    )

    if (
      requirementsError[0] !== null &&
      requirementsError[0] !== requirementsErrorUpdated[0]
    ) {
      setRequirementsError(requirementsErrorUpdated)
    }
  }, [account, balance, isContractAccount, requirementsError])

  const handleCreate = useCallback(() => {
    // reset the creation state
    saveTemplateState({})

    const requirementsError = validateCreationRequirements(
      account,
      balance,
      isContractAccount
    )
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
  }, [account, balance, isContractAccount])

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
        sortedEmbeddedTemplates.map(async template => {
          let repoAddress
          try {
            repoAddress = await resolveEnsDomain(template.id)
          } catch (_) {}

          return repoAddress
            ? {
                repoAddress,
                status: TEMPLATE_AVAILABLE,
                ...template,
              }
            : {
                status: TEMPLATE_UNAVAILABLE,
                ...template,
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

  const [solidTopBar, setSolidTopBar] = useState(false)

  const updateSolidScrollBar = useCallback(
    throttle(solid => {
      setSolidTopBar(solid)
    }, 50),
    []
  )

  const handleOnBoardingScroll = useCallback(
    event => {
      updateSolidScrollBar(event.target.scrollTop > 0)
    },
    [updateSolidScrollBar]
  )

  if (status === 'none') {
    return null
  }

  return (
    <div css="position: relative; z-index: 1">
      <OnboardingTopBar status={status} solid={solidTopBar} />
      <div
        onScroll={handleOnBoardingScroll}
        css={`
          position: relative;
          z-index: 1;
          background: ${theme.background};
          height: 100vh;
          min-width: ${BREAKPOINTS.min}px;
          overflow-y: auto;
        `}
      >
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
    </div>
  )
}

Onboarding.propTypes = {
  status: PropTypes.oneOf(['none', 'welcome', 'open', 'create']).isRequired,
  selectorNetworks: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.string))
    .isRequired,
  walletWeb3: PropTypes.object,
  web3: PropTypes.object,
}

export default Onboarding
