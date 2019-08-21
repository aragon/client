import React from 'react'
import PropTypes from 'prop-types'
import { ButtonText, Info, RadioList, GU } from '@aragon/ui'
import LocalIdentityBadge from '../IdentityBadge/LocalIdentityBadge'
import providerString from '../../provider-strings'
import { getAppPath } from '../../routing'
import AddressLink from './AddressLink'
import SignerButton from './SignerButton'

const RADIO_ITEM_TITLE_LENGTH = 30

class ActionPathsContent extends React.Component {
  static propTypes = {
    dao: PropTypes.string.isRequired,
    direct: PropTypes.bool.isRequired,
    installed: PropTypes.bool.isRequired,
    external: PropTypes.bool.isRequired,
    intent: PropTypes.object.isRequired,
    paths: PropTypes.array.isRequired,
    pretransaction: PropTypes.object,
    onSign: PropTypes.func.isRequired,
    signingEnabled: PropTypes.bool,
    walletProviderId: PropTypes.string.isRequired,
  }
  state = {
    selected: 0,
  }
  handleChange = selected => {
    this.setState({ selected })
  }
  handleSign = () => {
    const { intent, direct, paths, pretransaction, onSign } = this.props
    const { selected } = this.state
    // In non-direct paths, the first transaction (0) is the one we need to sign
    // to kick off the forwarding path
    onSign(
      direct ? intent.transaction : paths[selected][0],
      intent,
      pretransaction
    )
  }
  renderDescription(
    showPaths,
    { description, name, to, annotatedDescription }
  ) {
    const { dao } = this.props
    return (
      <React.Fragment>
        <p>This transaction will {showPaths ? 'eventually' : ''} perform</p>
        <div
          css={`
            margin: ${0.5 * GU}px 0 ${0.5 * GU}px ${1 * GU}px;
            line-height: 1.6;
          `}
        >
          {annotatedDescription
            ? annotatedDescription.map(({ type, value }, index) => {
                if (type === 'address' || type === 'any-account') {
                  return (
                    <span
                      key={index}
                      css={`
                        display: inline-flex;
                        vertical-align: middle;
                        margin-right: 4px;
                        position: relative;
                        top: -1px;
                      `}
                    >
                      <LocalIdentityBadge
                        entity={type === 'any-account' ? 'Any account' : value}
                        fontSize="small"
                        compact
                      />
                    </span>
                  )
                }
                if (type === 'app') {
                  return (
                    <ButtonText
                      key={index}
                      href={`#${getAppPath({
                        dao,
                        instanceId: 'permissions',
                        params: `app.${value.proxyAddress}`,
                      })}`}
                      target="_blank"
                      css="margin-right: 2px"
                    >
                      {value.name}
                    </ButtonText>
                  )
                }
                if (type === 'role' || type === 'kernelNamespace') {
                  return (
                    <span
                      key={index}
                      css={`
                        margin-right: 4px;
                        font-style: italic;
                      `}
                    >
                      {value.name}
                    </span>
                  )
                }
                if (type === 'apmPackage') {
                  return (
                    <span
                      key={index}
                      css={`
                        display: inline-flex;
                        vertical-align: middle;
                        margin-right: 4px;
                      `}
                    >
                      <LocalIdentityBadge
                        entity={value.name}
                        fontSize="small"
                      />
                    </span>
                  )
                }
                return (
                  <span key={index} css="margin-right: 4px">
                    {value}
                  </span>
                )
              })
            : description || 'an action'}
        </div>
        <p>
          {' on '}
          <AddressLink to={to}>{name}</AddressLink>.
        </p>
      </React.Fragment>
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
    const {
      installed,
      intent,
      direct,
      external,
      paths,
      pretransaction,
      signingEnabled,
      walletProviderId,
    } = this.props
    const { selected } = this.state
    const showPaths = !direct
    const radioItems = paths.map(this.getPathRadioItem)

    const approveTransactionMessage =
      intent.transaction &&
      intent.transaction.token &&
      intent.transaction.token.spender ? (
        <React.Fragment>
          The first will grant a token allowance to
          <LocalIdentityBadge
            entity={intent.transaction.token.spender}
            fontSize="small"
            compact
          />
          {'. '}
        </React.Fragment>
      ) : null

    return (
      <React.Fragment>
        {showPaths ? (
          <div
            css={`
              margin-bottom: ${3 * GU}px;
            `}
          >
            <Info mode="warning" title="Permission note">
              You cannot directly perform this action. You do not have the
              necessary permissions.
            </Info>
            <div
              css={`
                margin-top: ${4 * GU}px;
              `}
            >
              <RadioList
                title="Action Requirement"
                description={
                  paths.length > 1
                    ? 'Here are some options to perform this action:'
                    : 'You can perform this action through:'
                }
                items={radioItems}
                onChange={this.handleChange}
                selected={selected}
              />
            </div>
          </div>
        ) : (
          <h2
            css={`
              margin-bottom: ${2 * GU}px;
            `}
          >
            You can directly perform this action:
          </h2>
        )}
        <Info mode="description" title="Action to be triggered">
          {this.renderDescription(showPaths, intent)}
        </Info>
        {pretransaction && (
          <Info
            title="Two transactions required"
            css={`
              margin-top: ${3 * GU}px;
            `}
          >
            This action requires two transactions to be signed in{' '}
            {providerString('your Ethereum provider', walletProviderId)}.{' '}
            {approveTransactionMessage}
            Please confirm them one after another.
          </Info>
        )}
        {external && (
          <div css="margin-top: 20px">
            <Info.Alert title="Warning">
              {installed
                ? `Be aware that this is an attempt to execute a transaction on another app that is installed in this organization. You may want to double check that app's functionality before proceeding.`
                : `Be aware that this is an attempt to execute a transaction on an *external contract* that has not been reviewed or audited. This means that it might behave unexpectedly. Please *be sure your trust this contract* before proceeding.`}
            </Info.Alert>
          </div>
        )}
        <SignerButton onClick={this.handleSign} disabled={!signingEnabled}>
          Create transaction
        </SignerButton>
      </React.Fragment>
    )
  }
}

export default ActionPathsContent
