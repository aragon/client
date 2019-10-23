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
import { defaultEthNode, ipfsDefaultConf, network } from '../../../environment'
import { InvalidNetworkType, InvalidURI, NoConnection } from '../../../errors'
import { setDefaultEthNode, setIpfsGateway } from '../../../local-settings'
import keycodes from '../../../keycodes'
import { sanitizeNetworkType } from '../../../network-config'
import { checkValidEthNode } from '../../../web3-utils'

function Network({ wrapper }) {
  const {
    ethNode,
    ipfsGateway,
    handleNetworkChange,
    handleClearCache,
    networkError,
    handleEthNodeChange,
    handleIpfsGatewayChange,
    network,
  } = useNetwork(wrapper)
  const theme = useTheme()
  const { layoutName } = useLayout()
  const compact = layoutName === 'small'

  return (
    <React.Fragment>
      <Box heading="Node settings">
        <Label theme={theme}>
          Ethereum node
          <TextInput
            value={ethNode}
            wide
            onChange={handleEthNodeChange}
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
                if (networkError instanceof InvalidNetworkType) {
                  return `Node must be connected to ${sanitizeNetworkType(
                    network.type
                  )}`
                }
                if (networkError instanceof InvalidURI) {
                  return 'Must provide WebSocket endpoint to node'
                }
                if (networkError instanceof NoConnection) {
                  return 'Could not connect to node'
                }
                return 'URI does not seem to be a ETH node'
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
  const [ethNode, setEthNodeValue] = useState(defaultEthNode)
  const [ipfsGateway, setIpfsGatewayValue] = useState(ipfsDefaultConf.gateway)

  const handleNetworkChange = useCallback(async () => {
    try {
      await checkValidEthNode(ethNode, network.type)
    } catch (err) {
      setNetworkError(err)
      return
    }

    setDefaultEthNode(ethNode)
    setIpfsGateway(ipfsGateway)
    // For now, we have to reload the page to propagate the changes
    window.location.reload()
  }, [ethNode, ipfsGateway])
  const handleClearCache = useCallback(async () => {
    await wrapper.cache.clear()
    window.localStorage.clear()
    window.location.reload()
  }, [wrapper])
  const handleKeyPress = useCallback(
    ({ keyCode }) => {
      if (
        keyCode === keycodes.enter &&
        (ipfsGateway !== ipfsDefaultConf.gateway || ethNode !== defaultEthNode)
      ) {
        handleNetworkChange()
      }
    },
    [handleNetworkChange, ethNode, ipfsGateway]
  )

  useEffect(() => {
    window.addEventListener('keypress', handleKeyPress)
    return () => window.removeEventListener('keypress', handleKeyPress)
  }, [handleKeyPress])

  return {
    ethNode,
    network,
    ipfsGateway,
    handleNetworkChange,
    handleClearCache,
    networkError,
    handleEthNodeChange: ({ currentTarget: { value } }) =>
      setEthNodeValue(value),
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
