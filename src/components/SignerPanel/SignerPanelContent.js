import React from 'react'
import styled from 'styled-components'
import { Button, Info, RadioList, SafeLink } from '@aragon/ui'
import EtherscanLink from '../Etherscan/EtherscanLink'
import { noop } from '../../utils'

const RADIO_ITEM_TITLE_LENGTH = 30

const SignerPanelContent = ({
  account,
  error,
  intent,
  direct,
  paths,
  onClose,
  onSign,
  web3,
}) => {
  if (!web3) {
    return <NeedWeb3Content intent={intent} onClose={onClose} />
  }
  if (!account) {
    return <NeedUnlockAccountContent intent={intent} onClose={onClose} />
  }

  const possible =
    (direct || (Array.isArray(paths) && paths.length)) && !error
  return possible ? (
    <ActionPathsContent intent={intent} direct={direct} paths={paths} onSign={onSign} />
  ) : (
    <ImpossibleContent error={error} intent={intent} onClose={onClose} />
  )
}
SignerPanelContent.defaultProps = {
  intent: {},
  paths: [],
  onClose: noop,
  onSign: noop,
}

class ActionPathsContent extends React.Component {
  state = {
    selected: 0,
  }
  handleOnSelect = selected => {
    this.setState({ selected })
  }
  handleSign = () => {
    const { intent, direct, paths, onSign } = this.props
    const { selected } = this.state
    // In non-direct paths, the first transaction (0) is the one we need to sign
    // to kick off the forwarding path
    onSign(direct ? intent.transaction : paths[selected][0])
  }
  renderDescription(showPaths, { description, to, toName, transaction = {} }) {
    if (transaction.description) {
      return transaction.description
    }
    return (
      <span>
        This transaction will {showPaths && 'eventually'} perform{' '}
        {description ? `"${description}"` : 'an action'}
        {' on '}
        <AddressLink to={to}>{toName}</AddressLink>
        .
      </span>
    )
  }
  getPathRadioItem(path) {
    // Slice off the intention (last transaction in the path)
    path = path.slice(0, path.length - 1)

    const titleElements = path.reduce((titleElements, { name }, index) => {
      const shortName =
        name.length > RADIO_ITEM_TITLE_LENGTH
          ? name.slice(0, RADIO_ITEM_TITLE_LENGTH) + '…'
          : name

      if (titleElements.length) {
        titleElements.push(' → ')
      }
      titleElements.push(
        <span key={index} title={name}>
          {shortName}
        </span>
      )
      return titleElements
    }, [])
    const title = <React.Fragment>{titleElements}</React.Fragment>

    const descriptionElements =
      path.length === 1
        ? path[0].description
        : path.map(({ name, description }, index) => (
            <p key={index}>
              {index + 1}. {name}: {description}
            </p>
          ))
    const description = <React.Fragment>{descriptionElements}</React.Fragment>

    return {
      description,
      title,
    }
  }
  render() {
    const { intent, direct, paths } = this.props
    const { selected } = this.state
    const showPaths = !direct
    const radioItems = paths.map(this.getPathRadioItem)
    return (
      <React.Fragment>
        {showPaths ? (
          <ActionContainer>
            <Info.Permissions title="Permission note:">
              You cannot directly perform this action. You do not have the
              necessary permissions.
            </Info.Permissions>
            <Actions>
              <RadioList
                title="Action Requirement"
                description={
                  paths.length > 1
                    ? 'Here are some options you can use to perform it:'
                    : 'You can perform this action through:'
                }
                items={radioItems}
                onChange={this.handleOnSelect}
                selected={selected}
              />
            </Actions>
          </ActionContainer>
        ) : (
          <DirectActionHeader>
            You can directly perform this action:
          </DirectActionHeader>
        )}
        <Info.Action icon={null} title="Action to be triggered:">
          {this.renderDescription(showPaths, intent)}
        </Info.Action>
        <SignerButton onClick={this.handleSign}>Sign Transaction</SignerButton>
      </React.Fragment>
    )
  }
}

const ImpossibleContent = ({
  error,
  intent: { description, to, toName },
  onClose,
}) => (
  <React.Fragment>
    <Info.Permissions title="Action impossible">
      The action {description && `"${description}"`} failed to execute on{' '}
      <AddressLink to={to}>{toName}</AddressLink>
      .{' '}
      {error
        ? 'An error occurred when we tried to find a path or send a transaction for this action.'
        : 'You do not have the necessary permissions.'}
    </Info.Permissions>
    <SignerButton onClick={onClose}>Close</SignerButton>
  </React.Fragment>
)

const NeedUnlockAccountContent = ({
  intent: { description, to, toName },
  onClose,
}) => (
  <React.Fragment>
    <Info.Action title="You can't perform any actions">
      You need to unlock your account in order to perform{' '}
      {description ? `"${description}"` : 'this action'}
      {' on '}
      <AddressLink to={to}>{toName}</AddressLink>
      .
      <InstallMessage>
        Please unlock or enable{' '}
        <SafeLink href="https://metamask.io/" target="_blank">
          MetaMask
        </SafeLink>.
      </InstallMessage>
    </Info.Action>
    <SignerButton onClick={onClose}>Close</SignerButton>
  </React.Fragment>
)

const NeedWeb3Content = ({ intent: { description, to, toName }, onClose }) => (
  <React.Fragment>
    <Info.Action title="You can't perform any actions">
      You need to be connected to a Web3 instance in order to perform{' '}
      {description ? `"${description}"` : 'this action'}
      {' on '}
      <AddressLink to={to}>{toName}</AddressLink>
      .
      <InstallMessage>
        Please install or enable{' '}
        <SafeLink href="https://metamask.io/" target="_blank">
          MetaMask
        </SafeLink>.
      </InstallMessage>
    </Info.Action>
    <SignerButton onClick={onClose}>Close</SignerButton>
  </React.Fragment>
)

const AddressLink = ({ children, to }) =>
  to ? (
    <EtherscanLink address={to}>
      {url =>
        url ? (
          <SafeLink href={url} target="_blank">
            {children || to}
          </SafeLink>
        ) : (
          to
        )
      }
    </EtherscanLink>
  ) : (
    'an address or app'
  )

const ActionContainer = styled.div`
  margin-bottom: 40px;
`

const Actions = styled.div`
  margin-top: 25px;
`

const DirectActionHeader = styled.h2`
  margin-bottom: 10px;
`

const InstallMessage = styled.p`
  margin-top: 15px;
`

const SignerButton = styled(Button).attrs({
  mode: 'strong',
  wide: true,
})`
  margin-top: 20px;
`

export default SignerPanelContent
