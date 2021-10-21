import React, { useCallback, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import throttle from 'lodash.throttle'
import { BREAKPOINTS, useTheme } from '@aragon/ui'
import {
  TEMPLATE_AVAILABLE,
  TEMPLATE_LOADING,
  TEMPLATE_UNAVAILABLE,
} from '../symbols'
import Create from '../Create/Create'
import OnboardingTopBar from './OnboardingTopBar'
import Welcome from '../Welcome/Welcome'
import embeddedTemplates from '../../templates'
import { log } from '../../util/utils'
import { resolveEnsDomain } from '../../aragonjs-wrapper'
import { saveTemplateState } from '../create-utils'
import { useRouting } from '../../routing'
import { useWallet } from '../../contexts/wallet'
import { chains } from 'use-wallet'
import validateCreationRequirements from '../validate-requirements'
import { getWeb3 } from '../../util/web3'
import styled from 'styled-components'
import { NetworkSwitchModal, ConnectModal } from '../../components/Modals'
import { trackEvent, events } from '../../analytics'

const initialEmbeddedTemplates = embeddedTemplates.map(template => ({
  ...template,
  status: TEMPLATE_LOADING,
}))

function Onboarding({ web3 }) {
  const theme = useTheme()
  const routing = useRouting()

  const {
    networkType,
    account,
    balance,
    chainId,
    isContract: isContractAccount,
    web3: walletWeb3,
  } = useWallet()

  const [connectModalOpened, setConnectModalOpened] = useState(false)
  const [networkModalOpened, setNetworkModalOpened] = useState(false)
  const [templates, setTemplates] = useState(initialEmbeddedTemplates)
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

    // analytics
    trackEvent(events.OPEN_ORGANIZATION_CLICKED, {
      network: networkType,
    })
  }, [routing, networkType])

  const goToCreate = useCallback(() => {
    routing.update(locator => ({
      ...locator,
      mode: { name: 'onboarding', status: 'create' },
    }))

    // analytics
    trackEvent(events.CREATE_ORGANIZATION_CLICKED, {
      network: networkType,
    })
  }, [routing, networkType])

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
      isContractAccount,
      chains.getChainInformation(chainId)?.nativeCurrency.symbol
    )

    if (
      requirementsError[0] !== null &&
      requirementsError[0] !== requirementsErrorUpdated[0]
    ) {
      setRequirementsError(requirementsErrorUpdated)
    }
  }, [account, balance, chainId, isContractAccount, requirementsError])

  const handleCreate = useCallback(() => {
    // reset the creation state
    saveTemplateState({ networkType })

    const requirementsError = validateCreationRequirements(
      account,
      balance,
      isContractAccount,
      chains.getChainInformation(chainId)?.nativeCurrency.symbol
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
  }, [account, balance, chainId, goToCreate, isContractAccount, networkType])

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

  const closeNetworkSwitchModal = useCallback(
    () => setNetworkModalOpened(false),
    []
  )
  const openNetworkSwitchModal = useCallback(
    () => setNetworkModalOpened(true),
    []
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
    if (status === 'create') {
      Promise.all(
        embeddedTemplates.map(async template => {
          let repoAddress
          try {
            repoAddress = await resolveEnsDomain(networkType, web3, template.id)
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
            const availableTemplates = templatesWithRepoAddress.filter(
              item => item.status === TEMPLATE_AVAILABLE
            )
            setTemplates(availableTemplates)
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
  }, [status, web3, networkType])

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
      <OnboardingTopBar
        status={status}
        solid={solidTopBar}
        modalOpener={openNetworkSwitchModal}
      />
      <OnboardingMain
        backgroundColor={theme.background}
        onScroll={handleOnBoardingScroll}
      >
        {(status === 'welcome' || status === 'open') && (
          <Welcome
            createError={requirementsError}
            onBack={goToHome}
            onOpen={goToOpen}
            onOpenOrg={goToOrg}
            onCreate={handleCreate}
            openMode={status === 'open'}
          />
        )}
        {status === 'create' && Array.isArray(templates) && (
          <Create
            account={account}
            onOpenOrg={goToOrg}
            goToHome={goToHome}
            templates={templates}
            walletWeb3={walletWeb3}
            web3={getWeb3(web3)}
          />
        )}

        <ConnectModal
          account={account}
          onClose={closeConnectModal}
          visible={connectModalOpened}
          onConnect={handleProviderConnect}
          onConnectError={connectProviderError}
        />
        <NetworkSwitchModal
          visible={networkModalOpened}
          onClose={closeNetworkSwitchModal}
        />
      </OnboardingMain>
    </div>
  )
}

const OnboardingMain = styled.div`
  position: relative;
  z-index: 1;
  background: ${props => props.backgroundColor};
  height: 100vh;
  min-width: ${BREAKPOINTS.min}px;
  overflow-y: auto;
`

Onboarding.propTypes = {
  web3: PropTypes.object,
}

export default Onboarding
