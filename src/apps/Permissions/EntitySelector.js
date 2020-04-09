import React from 'react'
import PropTypes from 'prop-types'
import { DropDown, Field } from '@aragon/ui'
import {
  getAnyEntity,
  getBurnEntity,
  getUnassignedEntity,
} from '../../permissions'
import { AppType, AragonType } from '../../prop-types'
import { getEmptyAddress } from '../../web3-utils'
import AppInstanceLabel from '../../components/AppInstanceLabel'
import LocalIdentitiesAutoComplete from '../../components/LocalIdentitiesAutoComplete/LocalIdentitiesAutoComplete'

class EntitySelector extends React.Component {
  static propTypes = {
    apps: PropTypes.arrayOf(AppType).isRequired,
    includeAnyEntity: PropTypes.bool,
    includeBurnEntity: PropTypes.bool,
    includeUnassignedEntity: PropTypes.bool,
    label: PropTypes.string.isRequired,
    labelCustomAddress: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    selectedIndex: PropTypes.number.isRequired,
    wrapper: AragonType,
  }
  state = {
    customAddress: '',
  }
  handleChange = index => {
    this.setState({ customAddress: '' }, () => {
      this.props.onChange({
        index,
        address: this.getAddress(index),
      })
    })
  }
  handleCustomAddressChange = value => {
    this.setState({ customAddress: value })
    this.props.onChange({
      index: this.getItems().length - 1,
      address: value,
    })
  }
  getApps() {
    const { apps } = this.props
    return apps.filter(app => Boolean(app.name))
  }
  getAppsItems() {
    return this.getApps().map(app => (
      <AppInstanceLabel app={app} proxyAddress={app.proxyAddress} />
    ))
  }
  getAddress(index) {
    if (index === -1 || index === 0) {
      return ''
    }

    const items = this.getItems()

    if (index === items.length - 1) {
      return this.state.customAddress
    }

    if (this.props.includeAnyEntity && items[index] === 'Any account') {
      return getAnyEntity()
    }

    if (this.props.includeBurnEntity && items[index] === 'Burn role') {
      return getBurnEntity()
    }

    if (
      this.props.includeUnassignedEntity &&
      items[index] === 'Unassign role'
    ) {
      return getUnassignedEntity()
    }

    const app = this.getApps()[index - 1]
    return (app && app.proxyAddress) || getEmptyAddress()
  }
  getItems() {
    const {
      includeAnyEntity,
      includeBurnEntity,
      includeUnassignedEntity,
    } = this.props

    const items = [
      'Select an entity',
      ...this.getAppsItems(),
      'Custom address…',
    ]
    if (includeAnyEntity) {
      // Add immediately before last item
      items.splice(-1, 0, 'Any account')
    }

    if (includeBurnEntity) {
      items.splice(-1, 0, 'Burn role')
    }

    if (includeUnassignedEntity) {
      items.splice(-1, 0, 'Unassign role')
    }

    return items
  }
  render() {
    const { customAddress } = this.state
    const { label, labelCustomAddress, selectedIndex, wrapper } = this.props
    const items = this.getItems()
    const showCustomAddress = selectedIndex === items.length - 1
    return (
      <React.Fragment>
        <Field label={label}>
          <DropDown
            placeholder="Select an entity"
            items={items}
            selected={selectedIndex}
            onChange={this.handleChange}
            wide
          />
        </Field>

        {showCustomAddress && (
          <Field
            label={labelCustomAddress}
            css={`
              height: 60px;
            `}
          >
            <LocalIdentitiesAutoComplete
              placeholder="0xcafe…"
              value={customAddress}
              onChange={this.handleCustomAddressChange}
              wrapper={wrapper}
              wide
            />
          </Field>
        )}
      </React.Fragment>
    )
  }
}

export default EntitySelector
