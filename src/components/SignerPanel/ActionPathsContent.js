import React from 'react'
import styled from 'styled-components'
import { Info, RadioList } from '@aragon/ui'
import SignerButton from './SignerButton'
import AddressLink from './AddressLink'

const RADIO_ITEM_TITLE_LENGTH = 30

class ActionPathsContent extends React.Component {
  state = {
    selected: 0,
  }
  handleOnSelect = selected => {
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
  renderDescription(showPaths, { description, name, to }) {
    return (
      <React.Fragment>
        <p>This transaction will {showPaths && 'eventually'} perform:</p>
        <p style={{ margin: '10px 0' }}>
          {description ? `"${description}"` : 'an action'}
        </p>
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
    const { signingEnabled, intent, direct, paths, pretransaction } = this.props
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
        <Info.Action icon={null} title="Action to be triggered">
          {this.renderDescription(showPaths, intent)}
        </Info.Action>
        {pretransaction && (
          <Info.Action
            title="Two transactions required"
            style={{ marginTop: '20px' }}
          >
            This action requires two transactions to be signed in your Ethereum
            provider, please confirm them one after another.
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
