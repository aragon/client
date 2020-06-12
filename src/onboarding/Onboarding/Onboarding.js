import React, { useCallback, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import throttle from 'lodash.throttle'
import { BREAKPOINTS, useTheme } from '@aragon/ui'
import {
  TEMPLATE_AVAILABLE,
  TEMPLATE_LOADING,
  TEMPLATE_UNAVAILABLE,
} from '../symbols'
import ConnectModal from '../../components/ConnectModal/ConnectModal'
import Create from '../Create/Create'
import OnboardingTopBar from './OnboardingTopBar'
import Welcome from '../Welcome/Welcome'
import embeddedTemplates from '../../templates'
import { log } from '../../utils'
import { resolveEnsDomain } from '../../aragonjs-wrapper'
import { saveTemplateState } from '../create-utils'
import { useRouting } from '../../routing'
import { useWallet } from '../../wallet'
import validateCreationRequirements from '../validate-requirements'

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

function Onboarding({ selectorNetworks, web3 }) {
  const theme = useTheme()
  const routing = useRouting()

  const {
    account,
    balance,
    isContract: isContractAccount,
    web3: walletWeb3,
  } = useWallet()

  const [connectModalOpened, setConnectModalOpened] = useState(false)
  const [templates, setTemplates] = useState(initialEmbeddedTemplates)
  const [templatesResolved, setTemplatesResolved] = useState(false)
  const [connectIntent, setConnectIntent] = useState('')
  const [requirementsError, setRequirementsError] = useState([null])

  const status =
    (routing.mode.name === 'onboarding' && routing.mode.status) || 'none'

  const goToHome = useCallback(() => {
    routing.update(locator => ({
      ...locator,
      mode: { name: 'onboarding', status: null },
    }))
  }, [routing])

  const goToOpen = useCallback(() => {
    routing.update(locator => ({
      ...locator,
      mode: { name: 'onboarding', status: 'open' },
    }))
  }, [routing])

  const goToCreate = useCallback(() => {
    routing.update(locator => ({
      ...locator,
      mode: { name: 'onboarding', status: 'create' },
    }))
  }, [routing])

  const goToOrg = useCallback(
    orgAddress => {
      routing.update(locator => ({
        ...locator,
        mode: { name: 'org', orgAddress },
      }))
    },
    [routing]
  )

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
      goToCreate()
    }
  }, [account, balance, goToCreate, isContractAccount])

  const closeConnectModal = useCallback(
    provider => {
      setConnectModalOpened(false)
      setConnectIntent('')

      // Redirect to / if the modal get closed on /create
      // without having connected an account.
      if (status === 'create' && !account) {
        goToHome()
      }
    },
    [account, goToHome, status]
  )

  const handleProviderConnect = useCallback(
    provider => {
      closeConnectModal()

      // For now this is always true, but it may change in the future
      if (connectIntent === 'create') {
        goToCreate()
      }
    },
    [closeConnectModal, connectIntent, goToCreate]
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
  selectorNetworks: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.string))
    .isRequired,
  web3: PropTypes.object,
}

export default Onboarding
