import React, { useState } from 'react'
import styled from 'styled-components'
import { Box, Button, Info, GU, Text, TextInput, theme } from '@aragon/ui'
import { InvalidNetworkType, InvalidURI, NoConnection } from '../../../errors'
import { sanitizeNetworkType } from '../../../network-config'
import { defaultEthNode, ipfsDefaultConf, network } from '../../../environment'
import { checkValidEthNode } from '../../../web3-utils'
import {
  getSelectedCurrency,
  setDefaultEthNode,
  setIpfsGateway,
  setSelectedCurrency,
} from '../../../local-settings'

function Network({ wrapper }) {
  const {
    ethNode,
    ipfsGateway,
    handleNetworkChange,
    handleClearCache,
    networkError,
    setIpfsGateway,
    setEthNode,
    network,
  } = useNetwork(wrapper)

  return (
    <View
      ethNode={ethNode}
      ipfsGateway={ipfsGateway}
      onSave={handleNetworkChange}
      onClear={handleClearCache}
      error={networkError}
      onChangeEthNode={setEthNode}
      onChangeIpfsGateway={setIpfsGateway}
      network={network}
    />
  )
}

const useNetwork = wrapper => {
  const [networkError, setNetworkError] = useState(null)
  const [ethNode, setEthNodeValue] = useState(defaultEthNode)
  const [ipfsGateway, setIpfsGatewayValue] = useState(ipfsDefaultConf.gateway)

  const handleNetworkChange = async () => {
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
  }
  const handleClearCache = async () => {
    await wrapper.cache.clear()
    window.localStorage.clear()
    window.location.reload()
  }

  return {
    ethNode,
    network,
    ipfsGateway,
    handleNetworkChange,
    handleClearCache,
    networkError,
    setEthNode: ({ currentTarget: { value } }) => setEthNodeValue(value),
    setIpfsGateway: ({ currentTarget: { value } }) =>
      setIpfsGatewayValue(value),
  }
}

function View({
  error,
  ethNode,
  ipfsGateway,
  network,
  onChangeEthNode,
  onChangeIpfsGateway,
  onClear,
  onSave,
}) {
  return (
    <React.Fragment>
      <Box heading={'Node settings'}>
        <Label>
          Ethereum node{' '}
          <TextInput
            value={ethNode}
            wide
            onChange={onChangeEthNode}
            css={error && `border-color: ${theme.negative};`}
          />
          {error && (
            <Text color={theme.negative} size="xsmall">
              {(() => {
                if (error instanceof InvalidNetworkType) {
                  return `Node must be connected to ${sanitizeNetworkType(
                    network.type
                  )}`
                }
                if (error instanceof InvalidURI) {
                  return 'Must provide WebSocket endpoint to node'
                }
                if (error instanceof NoConnection) {
                  return 'Could not connect to node'
                }
                return 'URI does not seem to be a ETH node'
              })()}
            </Text>
          )}
        </Label>
        <Label>
          IPFS Gateway{' '}
          <TextInput value={ipfsGateway} wide onChange={onChangeIpfsGateway} />
        </Label>
        <Button mode="strong" onClick={onSave}>
          Save changes
        </Button>
      </Box>
      <Box heading={'Troubleshooting'}>
        <div
          css={`
            margin-bottom: ${2 * GU}px;
          `}
        >
          <Text>
            Press this button to refresh the cache of the application in your
            browser.
          </Text>
        </div>
        <Button
          css={`
            margin-bottom: ${2 * GU}px;
          `}
          onClick={onClear}
        >
          Clear application cache
        </Button>
        <Info>
          This will only delete the data stored in youur browser to make the app
          load faster. No data related to the organization itself will be
          altered.
        </Info>
      </Box>
    </React.Fragment>
  )
}

const Label = styled.label`
  display: block;
  margin-bottom: ${2 * GU}px;
`

export default Network
