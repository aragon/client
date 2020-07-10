import React, { useEffect, useState, useCallback } from 'react'
import styled from 'styled-components'
import { AragonType } from '../../../prop-types'
import {
  Box,
  Button,
  Info,
  GU,
  TextInput,
  textStyle,
  useLayout,
  useTheme,
} from '@aragon/ui'
import { ipfsDefaultConf, network } from '../../../environment'
import { InvalidChainId, InvalidURI, NoConnection } from '../../../errors'
import { setEthEndpoint, setIpfsGateway } from '../../../local-settings'
import keycodes from '../../../keycodes'
import { checkValidEthEndpoint } from '../../../web3-utils'

function Network({ wrapper }) {
  const {
    ethEndpoint,
    ipfsGateway,
    handleNetworkChange,
    handleClearCache,
    networkError,
    handleEthEndpointChange,
    handleIpfsGatewayChange,
  } = useNetwork(wrapper)
  const theme = useTheme()
  const { layoutName } = useLayout()
  const compact = layoutName === 'small'

  return (
    <React.Fragment>
      <Box heading="Connection settings">
        <Label theme={theme}>
          Ethereum JSON-RPC Endpoint
          <TextInput
            value={ethEndpoint}
            wide
            onChange={handleEthEndpointChange}
            css={`
              ${textStyle('body2')};
              color: ${theme.contentSecondary};
              ${networkError ? `border-color: ${theme.negative};` : ''}
            `}
          />
          {networkError && (
            <span
              css={`
                ${textStyle('body4')};
                color: ${theme.negative};
              `}
            >
              {(() => {
                if (networkError instanceof InvalidChainId) {
                  return `Endpoint must be connected to the ${network.name} network`
                }
                if (networkError instanceof InvalidURI) {
                  return 'Endpoint must be a WebSocket'
                }
                if (networkError instanceof NoConnection) {
                  return 'Could not connect to endpoint'
                }
                return 'Could not detect compatible JSON-RPC endpoint'
              })()}
            </span>
          )}
        </Label>
        <Label theme={theme}>
          IPFS Gateway
          <TextInput
            value={ipfsGateway}
            wide
            onChange={handleIpfsGatewayChange}
            css={`
              ${textStyle('body2')};
              color: ${theme.contentSecondary};
            `}
          />
        </Label>
        <Button mode="strong" onClick={handleNetworkChange} wide={compact}>
          Save changes
        </Button>
      </Box>
      <Box heading="Troubleshooting">
        <div
          css={`
            margin-bottom: ${2 * GU}px;
          `}
        >
          <span>
            Press this button to refresh the cache of the application in your
            browser.
          </span>
        </div>
        <Button
          css={`
            margin-bottom: ${2 * GU}px;
          `}
          onClick={handleClearCache}
          wide={compact}
        >
          Clear application cache
        </Button>
        <Info>
          This will only delete the data stored in your browser to make the app
          load faster. No data related to the organization itself will be
          altered.
        </Info>
      </Box>
    </React.Fragment>
  )
}

Network.propTypes = {
  wrapper: AragonType,
}

const useNetwork = wrapper => {
  const [networkError, setNetworkError] = useState(null)
  const [ethEndpoint, setEthEndpointValue] = useState(network.endpoints.read)
  const [ipfsGateway, setIpfsGatewayValue] = useState(ipfsDefaultConf.gateway)

  const handleNetworkChange = useCallback(async () => {
    try {
      await checkValidEthEndpoint(ethEndpoint, network.chainId)
    } catch (err) {
      setNetworkError(err)
      return
    }

    setEthEndpoint(ethEndpoint)
    setIpfsGateway(ipfsGateway)
    // For now, we have to reload the page to propagate the changes
    window.location.reload()
  }, [ethEndpoint, ipfsGateway])

  const handleClearCache = useCallback(async () => {
    await wrapper.cache.clear()
    window.localStorage.clear()
    window.location.reload()
  }, [wrapper])

  const handleKeyPress = useCallback(
    ({ keyCode }) => {
      if (
        keyCode === keycodes.enter &&
        (ipfsGateway !== ipfsDefaultConf.gateway ||
          ethEndpoint !== network.endpoints.read)
      ) {
        handleNetworkChange()
      }
    },
    [handleNetworkChange, ethEndpoint, ipfsGateway]
  )

  useEffect(() => {
    window.addEventListener('keypress', handleKeyPress)
    return () => window.removeEventListener('keypress', handleKeyPress)
  }, [handleKeyPress])

  return {
    ethEndpoint,
    ipfsGateway,
    handleNetworkChange,
    handleClearCache,
    networkError,
    handleEthEndpointChange: ({ currentTarget: { value } }) =>
      setEthEndpointValue(value),
    handleIpfsGatewayChange: ({ currentTarget: { value } }) =>
      setIpfsGatewayValue(value),
  }
}

const Label = styled.label`
  color: ${({ theme }) => theme.content};
  display: block;
  margin-bottom: ${2 * GU}px;
`

export default React.memo(Network)
