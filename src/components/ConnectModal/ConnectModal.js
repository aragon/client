import React, { useCallback, useEffect } from 'react'
import PropTypes from 'prop-types'
import {
  Button,
  GU,
  IconConnect,
  Link,
  Modal,
  textStyle,
  useTheme,
  useViewport,
} from '@aragon/ui'
import providers from '../../ethereum-providers'
import { enableWallet } from '../../wallet-utils'
import ProviderCard from './ProviderCard'

function ConnectModal({
  account,
  onClose,
  onConnect,
  onConnectError,
  visible,
}) {
  const theme = useTheme()
  const { above, below } = useViewport()

  const modalWidth = useCallback(({ width }) => {
    return Math.min(130 * GU, width - 8 * GU)
  }, [])

  useEffect(() => {
    if (account) {
      onConnect()
    }
  }, [account, onConnect])

  const largeMode = above('large')
  const smallMode = below('medium')

  return (
    <Modal visible={visible} width={modalWidth} onClose={onClose}>
      <section
        css={`
          display: flex;
          flex-direction: column;
          align-items: center;
        `}
      >
        <header
          css={`
            padding-top: ${4 * GU}px;
            text-align: center;
          `}
        >
          <h1
            css={`
              // Not in aragonUI - exceptionally used here
              font-size: ${smallMode ? '30px' : '40px'};
              font-weight: 600;
              padding-bottom: ${1 * GU}px;
            `}
          >
            Enable your Ethereum provider
          </h1>
          <p
            css={`
              ${textStyle('title4')};
              color: ${theme.contentSecondary};
            `}
          >
            You need to enable your Ethereum provider in order to create an
            organization.
          </p>
          <p
            css={`
              padding: ${2 * GU}px 0 ${4 * GU}px;
              text-align: center;
              color: ${theme.contentSecondary};
            `}
          >
            <Link href="https://www.ethereum.org/use/#_3-what-is-a-wallet-and-which-one-should-i-use">
              What is an Ethereum provider?
            </Link>
          </p>
        </header>
        {largeMode && (
          <div
            css={`
              display: flex;
              justify-content: space-between;
              padding-bottom: ${4 * GU}px;
            `}
          >
            {[...providers.values()].map(provider => (
              <ProviderCard
                key={provider.name}
                provider={provider}
                onConnect={onConnect}
                onConnectError={onConnectError}
              />
            ))}
          </div>
        )}
        <Button
          icon={<IconConnect />}
          label="Enable account"
          mode="strong"
          onClick={enableWallet}
        />
      </section>
    </Modal>
  )
}

ConnectModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  onConnect: PropTypes.func.isRequired,
  onConnectError: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  account: PropTypes.string,
}

export default ConnectModal
