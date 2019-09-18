import React, { useEffect, useState, useCallback } from 'react'
import styled from 'styled-components'
import { AragonType } from '../../../prop-types'
import {
  Box,
  Button,
  Info,
  GU,
  TextInput,
  Checkbox,
  textStyle,
  useLayout,
  useTheme,
} from '@aragon/ui'
import {
  defaultEthNode,
  ipfsDefaultConf,
  defaultFeatherNode,
  featherCacheEnabled,
  network,
} from '../../../environment'
import { InvalidNetworkType, InvalidURI, NoConnection } from '../../../errors'
import {
  setDefaultEthNode,
  setIpfsGateway,
  setFeatherNode,
  setFeatherCacheEnabled,
} from '../../../local-settings'
import keycodes from '../../../keycodes'
import { sanitizeNetworkType } from '../../../network-config'
import { checkValidEthNode } from '../../../web3-utils'

function Network({ wrapper }) {
  const {
    ethNode,
    ipfsGateway,
    featherNode,
    cacheEnabled,
    handleNetworkChange,
    handleClearCache,
    networkError,
    handleEthNodeChange,
    handleIpfsGatewayChange,
    handleFeatherNodeChange,
    handleFeatherEnabledChange,
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
        <Label theme={theme}>
          Feather Cache Node
          <TextInput
            value={featherNode}
            wide
            onChange={handleFeatherNodeChange}
            css={`
              ${textStyle('body2')};
              color: ${theme.contentSecondary};
            `}
          />
          <Checkbox
            onChange={handleFeatherEnabledChange}
            checked={cacheEnabled}
          />
          <span
            css={`
              color: ${theme.surfaceContentSecondary};
              ${textStyle('body3')}
            `}
          >
            Enable cache
          </span>
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
  const [featherNode, setFeatherNodeValue] = useState(defaultFeatherNode)
  const [cacheEnabled, setCacheEnabledValue] = useState(featherCacheEnabled)

  const handleNetworkChange = useCallback(async () => {
    try {
      await checkValidEthNode(ethNode, network.type)
    } catch (err) {
      setNetworkError(err)
      return
    }

    setDefaultEthNode(ethNode)
    setIpfsGateway(ipfsGateway)
    setFeatherNode(featherNode)
    setFeatherCacheEnabled(cacheEnabled)

    // For now, we have to reload the page to propagate the changes
    window.location.reload()
  }, [ethNode, ipfsGateway, featherNode, cacheEnabled])
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
    featherNode,
    cacheEnabled,
    handleNetworkChange,
    handleClearCache,
    networkError,
    handleEthNodeChange: ({ currentTarget: { value } }) =>
      setEthNodeValue(value),
    handleIpfsGatewayChange: ({ currentTarget: { value } }) =>
      setIpfsGatewayValue(value),
    handleFeatherNodeChange: ({ currentTarget: { value } }) =>
      setFeatherNodeValue(value),
    handleFeatherEnabledChange: enabled => setCacheEnabledValue(enabled),
  }
}

const Label = styled.label`
  color: ${({ theme }) => theme.content};
  display: block;
  margin-bottom: ${2 * GU}px;
`

export default React.memo(Network)
