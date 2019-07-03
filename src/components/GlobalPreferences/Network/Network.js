import React from 'react'
import { Box, Button, Info, Text, TextInput, theme } from '@aragon/ui'
import { InvalidNetworkType, InvalidURI, NoConnection } from '../../../errors'
import { sanitizeNetworkType } from '../../../network-config'

function Network({
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
        <label
          css={`
            display: block;
          `}
        >
          Ethereum node{' '}
          <TextInput value={ethNode} wide onChange={onChangeEthNode} />
        </label>
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
        <label
          css={`
            display: block;
          `}
        >
          IPFS Gateway{' '}
          <TextInput value={ipfsGateway} wide onChange={onChangeIpfsGateway} />
        </label>
        <Button mode="strong" onClick={onSave}>
          Save changes
        </Button>
      </Box>
      <Box heading={'Troubleshooting'}>
        <div>
          <Text>
            Press this button to refresh the cache of the application in your
            browser.
          </Text>
        </div>
        <Button onClick={onClear}>Clear application cache</Button>
        <Info>
          This will only delete the data stored in youur browser to make the app
          load faster. No data related to the organization itself will be
          altered.
        </Info>
      </Box>
    </React.Fragment>
  )
}

export default Network
