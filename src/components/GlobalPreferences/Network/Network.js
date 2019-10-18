import React, { useEffect, useState, useCallback } from 'react'
import styled from 'styled-components'
import {
  Box,
  Button,
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

function Network() {
  const {
    ethNode,
    ipfsGateway,
    handleNetworkChange,
    networkError,
    handleEthNodeChange,
    handleIpfsGatewayChange,
    network,
  } = useNetwork()
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
    </React.Fragment>
  )
}

const useNetwork = () => {
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
