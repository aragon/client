import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Info, RadioList, SafeLink } from '@aragon/ui'
import SignerButton from './SignerButton'
import AddressLink from './AddressLink'
import LocalIdentityBadge from '../IdentityBadge/LocalIdentityBadge'
import providerString from '../../provider-strings'

const RADIO_ITEM_TITLE_LENGTH = 30

class ActionPathsContent extends React.Component {
  static propTypes = {
    direct: PropTypes.bool.isRequired,
    intent: PropTypes.object.isRequired,
    dao: PropTypes.string.isRequired,
    onSign: PropTypes.func.isRequired,
    paths: PropTypes.array.isRequired,
    pretransaction: PropTypes.object,
    signingEnabled: PropTypes.bool.isRequired,
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
    return (
      <React.Fragment>
        <p>This transaction will {showPaths && 'eventually'} perform</p>
        <div style={{ margin: '10px 0 10px 15px' }}>
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
                      `}
                    >
                      <LocalIdentityBadge
                        entity={type === 'any-account' ? 'Any account' : value}
                        fontSize="small"
                      />
                    </span>
                  )
                } else if (type === 'app') {
                  return (
                    <SafeLink
                      key={index}
                      href={`/#/${this.props.dao}/permissions/?p=app.${
                        value.proxyAddress
                      }`}
                      target="_blank"
                      style={{ marginRight: '2px' }}
                    >
                      {value.name}
                    </SafeLink>
                  )
                } else if (type === 'role') {
                  return (
                    <span
                      key={index}
                      style={{ marginRight: '4px', fontStyle: 'italic' }}
                    >
                      {value.name}
                    </span>
                  )
                } else if (type === 'text') {
                  return (
                    <span key={index} style={{ marginRight: '4px' }}>
                      {value}
                    </span>
                  )
                }
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
      intent,
      direct,
      paths,
      pretransaction,
      signingEnabled,
      walletProviderId,
    } = this.props
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
                onChange={this.handleChange}
                selected={selected}
              />
            </Actions>
          </ActionContainer>
        ) : (
          <DirectActionHeader>
            You can directly perform this action:
          </DirectActionHeader>
        )}
        <Info.Action icon={null} title="Action to be triggered">
          {this.renderDescription(showPaths, intent)}
        </Info.Action>
        {pretransaction && (
          <Info.Action
            title="Two transactions required"
            style={{ marginTop: '20px' }}
          >
            This action requires two transactions to be signed in{' '}
            {providerString('your Ethereum provider', walletProviderId)}, please
            confirm them one after another.
          </Info.Action>
        )}
        <SignerButton onClick={this.handleSign} disabled={!signingEnabled}>
          Create transaction
        </SignerButton>
      </React.Fragment>
    )
  }
}

const ActionContainer = styled.div`
  margin-bottom: 40px;
`

const Actions = styled.div`
  margin-top: 25px;
`

const DirectActionHeader = styled.h2`
  margin-bottom: 10px;
`

export default ActionPathsContent
