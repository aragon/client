import React, { useCallback, Fragment } from 'react'
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
import providersImage from './assets/providers.png'

function NetworkRedirectModal({
  error,
  selectorNetworks,
  onClose,
  onRedirect,
  visible,
}) {
  const theme = useTheme()
  const { below } = useViewport()
  const smallMode = below('medium')

  // eslint-disable-next-line no-unused-vars
  const [errorType, errorData] = error

  const { actual, expected, supported } = errorData

  const modalWidth = useCallback(
    ({ width }) => Math.min(55 * GU, width - 4 * GU),
    []
  )

  const targetNetwork = supported ? actual : 'main'

  // eslint-disable-next-line no-unused-vars
  const [type, targetName, targetUrl] = selectorNetworks.filter(
    ([type, name, url]) => type === targetNetwork
  )[0]

  return (
    <Modal visible={visible} width={modalWidth} onClose={onClose}>
      <section
        css={`
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: ${smallMode ? 0 : 3 * GU}px;
          padding-top: ${smallMode ? 5 * GU : 3 * GU}px;
          padding-bottom: ${smallMode ? 0 : 2 * GU}px;
        `}
      >
        <header
          css={`
            text-align: center;
          `}
        >
          <h1
            css={`
              max-width: ${35 * GU}px;
              margin: 0 auto ${1 * GU}px;
              ${textStyle('title1')};
              font-weight: 600;
            `}
          >
            {supported ? (
              <Fragment>Connect to the right Ethereum network</Fragment>
            ) : (
              <Fragment>Connect to a supported Ethereum network</Fragment>
            )}
          </h1>
          <p
            css={`
              max-width: ${35 * GU}px;
              ${textStyle('body1')};
              color: ${theme.contentSecondary};
            `}
          >
            This organisation is running on the {expected} Ethereum network.
            Your provider is connected to the {actual} network.
          </p>
          <p
            css={`
              max-width: ${35 * GU}px;
              ${textStyle('body1')};
              color: ${theme.contentSecondary};
            `}
          >
            Please connect your provider to {expected} network or try on
            <Link href={targetUrl}>{targetUrl}</Link>
          </p>
          <p
            css={`
              padding: ${3 * GU}px 0;
              text-align: center;
              color: ${theme.contentSecondary};
            `}
          >
            <Link href="https://www.ethereum.org/use/#_3-what-is-a-wallet-and-which-one-should-i-use">
              What is a Ethereum provider?
            </Link>
          </p>
        </header>
        <div>
          <img
            width="296"
            height="80"
            src={providersImage}
            alt=""
            css={`
              display: block;
              margin: 0 auto ${4 * GU}px;
              width: ${smallMode ? 222 : 296}px;
              height: auto;
            `}
          />
        </div>
        <Button
          icon={<IconConnect />}
          label={'Redirect to ' + targetName}
          mode="strong"
          onClick={() => onRedirect(actual)}
          wide
        />
      </section>
    </Modal>
  )
}

NetworkRedirectModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  onRedirect: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  error: PropTypes.array.isRequired,
  selectorNetworks: PropTypes.array.isRequired,
}

export default NetworkRedirectModal
