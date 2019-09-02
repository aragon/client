import React, { useState } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import Dropzone from 'react-dropzone'
import {
  BackButton,
  Bar,
  Button,
  Card,
  CardLayout,
  GU,
  Modal,
  Text,
  TextInput,
  useLayout,
  useTheme,
} from '@aragon/ui'
import LocalIdentityBadge from '../../components/IdentityBadge/LocalIdentityBadge'
import noTokensConnectedPNG from '../../assets/no-tokens-connected.png'
import organizationLogoPlaceholder from '../../assets/organization-logo-placeholder.png'
import Label from './Label'

const NoTokens = () => (
  <NoTokensCard>
    <div
      css={`
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-evenly;
      `}
    >
      <img css="margin: 10px" src={noTokensConnectedPNG} alt="" height="160" />
      <Text size="xlarge">No tokens connected</Text>
      <Text size="large">Connect a token to your organization.</Text>
      <Button css="margin: 10px 0 20px 0" mode="strong">
        Connect token
      </Button>
    </div>
  </NoTokensCard>
)

const TokenDetails = ({ token }) => {
  const theme = useTheme()
  const { layoutName } = useLayout()
  const [removeDialogOpen, setRemoveDialogOpen] = useState(false)
  const oneColumn = layoutName === 'small'
  const toggleRemoveDialog = () => setRemoveDialogOpen(!removeDialogOpen)

  return (
    <React.Fragment>
      <Modal visible={removeDialogOpen} onClose={toggleRemoveDialog}>
        <Text
          size="xlarge"
          css={`
            margin: 20px 0 26px 0;
            display: block;
          `}
        >
          Remove token
        </Text>
        <Text size="small">
          This action will remove your token from the organization, until you
          decide to reconnect it.
        </Text>
        <div
          css={`
            display: flex;
            justify-content: flex-end;
            margin-top: 20px;
          `}
        >
          <Button compact mode="outline" onClick={toggleRemoveDialog}>
            Cancel
          </Button>
          <Button
            compact
            mode="strong"
            css={`
              background: ${theme.negative};
              margin-left: 10px;
            `}
            onClick={toggleRemoveDialog}
          >
            Remove token
          </Button>
        </div>
      </Modal>

      <TokenDetailsCard
        css={`
          padding: 20px;
          display: flex;
          flex-direction: ${oneColumn ? 'column' : 'row'};
        `}
      >
        <div
          css={`
            width: ${oneColumn ? '100' : '49'}%;
            margin-bottom: ${oneColumn ? '20px' : '0'};
          `}
        >
          <div css="display: flex">
            <div css="margin-bottom: 20px; width: 50%">
              <Label text="Name" />
              <Text.Block>{token.tokenName}</Text.Block>
            </div>
            <div css="margin-bottom: 20px">
              <Label text="Symbol" />
              <Text.Block>{token.tokenSymbol}</Text.Block>
            </div>
          </div>

          <div css="margin-bottom: 20px">
            <Label text="Address" block />
            <LocalIdentityBadge
              entity={token.tokenAddress}
              shorten={layoutName !== 'large'}
            />
          </div>

          <div css="margin-bottom: 20px">
            <Label text="Description" block />
            <TextInput.Multiline wide>
              {token.tokenDescription}
            </TextInput.Multiline>
          </div>

          <div>
            <Button mode="strong" css="margin-right: 10px">
              Save changes
            </Button>
            <Button onClick={toggleRemoveDialog} mode="outline">
              Remove token
            </Button>
          </div>
        </div>

        <div
          css={`
            width: ${oneColumn ? '100' : '50'}%;
            padding-left: ${oneColumn ? '0' : '20px'};
          `}
        >
          <Dropzone onDrop={acceptedFiles => console.log(acceptedFiles)}>
            {({ getRootProps, getInputProps, isDragActive }) => (
              <div {...getRootProps()} css="outline: none">
                <input {...getInputProps()} />
                <div
                  css={`
                    background: ${theme.surfaceUnder};
                    width: 217px;
                    height: 217px;
                    padding: 30px;
                    margin-bottom: 10px;
                    border: ${isDragActive
                      ? '1px dashed green'
                      : '1px solid white'};
                  `}
                >
                  <img
                    css={`
                      width: 157px;
                      height: 157px;
                      border: 0;
                      border-radius: 50%;
                    `}
                    src={organizationLogoPlaceholder}
                    alt=""
                  />
                </div>
                <Button
                  mode="outline"
                  css="margin-right: 10px; font-weight: bold"
                >
                  Upload new
                </Button>
                <Text size="small">Please keep 1:1 ratio</Text>
              </div>
            )}
          </Dropzone>
        </div>
      </TokenDetailsCard>
    </React.Fragment>
  )
}

TokenDetails.propTypes = {
  token: PropTypes.object.isRequired,
}

const Tokens = ({ connectedTokens, toggleTabsVisible }) => {
  const { layoutName } = useLayout()
  const theme = useTheme()
  const [currentToken, setCurrentToken] = useState(-1)
  const compactMode = layoutName === 'small'
  const rowHeight = compactMode ? null : 350

  if (connectedTokens.length === 0) {
    return <NoTokens />
  }

  if (currentToken > -1) {
    return (
      <React.Fragment>
        <Bar>
          <BackButton
            onClick={() => {
              setCurrentToken(-1)
              toggleTabsVisible()
            }}
          />
        </Bar>
        <TokenDetails token={connectedTokens[currentToken]} />
      </React.Fragment>
    )
  }

  return (
    <CardLayout columnWidthMin={20 * GU} rowHeight={rowHeight}>
      {connectedTokens.map((token, i) => {
        const handleOpen = () => {
          setCurrentToken(i)
          toggleTabsVisible()
        }

        return (
          <Card
            onClick={handleOpen}
            key={i}
            css={`
              display: flex;
              flex-direction: column;
              width: 172px;
              height: 172px;
            `}
          >
            <img
              css={`
                width: 70px;
                height: 70px;
                border: 0;
                border-radius: 50%;
              `}
              src={organizationLogoPlaceholder}
              alt=""
            />
            <span css="margin: 10px 0">
              {token.tokenName}{' '}
              <Text size="xsmall" color={`${theme.surfaceContentSecondary}`}>
                ({token.tokenSymbol})
              </Text>
            </span>
            <LocalIdentityBadge entity={token.tokenAddress} shorten />
          </Card>
        )
      })}
    </CardLayout>
  )
}
Tokens.propTypes = {
  connectedTokens: PropTypes.arrayOf(PropTypes.object).isRequired,
  toggleTabsVisible: PropTypes.func.isRequired,
}

const NoTokensCard = styled(Card)`
  width: 100%;
  height: 364px;
`
const TokenDetailsCard = styled(Card)`
  width: 100%;
  height: unset;
`

export default Tokens
