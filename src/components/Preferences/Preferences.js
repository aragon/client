import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import {
  AppBar,
  AppView,
  Badge,
  EthIdenticon,
  IdentityBadge,
  TabBar,
  Viewport,
  font,
} from '@aragon/ui'
import { CustomLabelModalConsumer } from '../CustomLabelModal/CustomLabelModalManager'
import { getAll, resolve, set, removeAll } from '../../mockCustomLabelsManager'

const isString = str => typeof str === 'string' || str instanceof String

const checkIntegrity = obj => {
  return (
    Array.isArray(obj) &&
    obj.every(
      ({ address, label }) =>
        isString(address) &&
        isString(label) &&
        !!address.trim() &&
        !!label.trim()
    )
  )
}

const ETH_ADDRESS = '0x0000000000000000000000000000000000000000'

const SMALL_TABS = ['Network', 'Manage labels']

const TABS = ['Network', 'Addresses', 'Manage labels']

const Preferences = ({ onClose, opened, smallView, ...props }) => {
  if (!opened) {
    return null
  }

  const [selectedTab, setSelectedTab] = React.useState(0 || smallView ? 1 : 2)

  return (
    <StyledAppView
      smallView={smallView}
      padding={smallView ? 0 : 30}
      appBar={
        <AppBar
          title="My Preferences"
          endContent={<button onClick={onClose}>x</button>}
        />
      }
    >
      <React.Fragment>
        <TabBar
          items={smallView ? SMALL_TABS : TABS}
          selected={selectedTab}
          onSelect={setSelectedTab}
        />
        {selectedTab === 0 && <Network />}
        {!smallView && selectedTab === 1 && <Addresses />}
        {((!smallView && selectedTab === 2) ||
          (smallView && selectedTab === 1)) && <CustomLabels />}
      </React.Fragment>
    </StyledAppView>
  )
}

Preferences.propTypes = {
  onClose: PropTypes.func.isRequired,
  opened: PropTypes.bool.isRequired,
  smallView: PropTypes.bool.isRequired,
}

const CustomLabels = () => {
  const [list, setList] = React.useState(getAll)
  const clearAll = () => {
    removeAll()
    setList(getAll)
  }
  const href = window.URL.createObjectURL(
    new Blob([JSON.stringify(getAll())], { type: 'text/json' })
  )
  const fileImport = file => {
    const reader = new FileReader()
    reader.onload = event => {
      const list = JSON.parse(event.target.result)
      if (checkIntegrity(list)) {
        list.forEach(({ address, label }) => set({ address, label }))
        setList(getAll)
      }
    }
    reader.readAsText(event.target.files[0])
  }

  return (
    <React.Fragment>
      <Labels list={list} />
      <div>
        <label
          css={`
            position: relative;
            display: inline-block;
            overflow: hidden;
          `}
        >
          <button>Import</button>
          <input
            type="file"
            onChange={fileImport}
            accept=".json"
            css={`
              border: 1px solid red;
              display: block;
              filter: alpha(opacity=0);
              opacity: 0;
              position: absolute;
              z-index: 1;
              top: 0;
              bottom: 0;
              left: 0;
              right: 0;
            `}
          />
        </label>
        <a download="customLabels.json" href={href}>
          Export
        </a>
        <button onClick={clearAll}>Remove all labels</button>
      </div>
      <Warning />
    </React.Fragment>
  )
}

const Labels = ({ list }) => {
  if (!list.length) {
    return <EmptyLabels />
  }
  const updateLabel = (fn, address) => () => {
    fn(address)
  }

  return (
    <ul>
      <li key="headers">
        <div>Custom label</div>
        <div>Address</div>
      </li>
      {list.map(({ address }) => (
        <li key={address}>
          <div>{resolve(address)}</div>
          <div>
            <CustomLabelModalConsumer>
              {({ showCustomLabelModal }) => (
                <IdentityBadge
                  entity={address}
                  popoverAction={{
                    title: (
                      <div
                        css={`
                          display: grid;
                          align-items: center;
                          grid-template-columns: auto 1fr;
                          padding-right: 24px;
                        `}
                      >
                        <span
                          css={`
                            display: inline-block;
                            overflow: hidden;
                            text-overflow: ellipsis;
                            white-space: nowrap;
                          `}
                        >
                          {resolve(address)}
                        </span>
                        <Badge
                          css={`
                            margin-left: 16px;
                            text-transform: uppercase;
                            ${font({ size: 'xxsmall' })};
                          `}
                        >
                          Custom label
                        </Badge>
                      </div>
                    ),
                    label: 'Edit custom label',
                    onClick: updateLabel(showCustomLabelModal, address),
                  }}
                />
              )}
            </CustomLabelModalConsumer>
          </div>
        </li>
      ))}
    </ul>
  )
}

Labels.defaultProps = {
  list: [],
}

Labels.propTypes = {
  list: PropTypes.array,
}

const Addresses = () => 'Coming soon...'

const Network = () => 'Coming soon...'

const EmptyLabels = () => (
  <React.Fragment>
    <h3>Start adding labels</h3>
    <div>
      You can add labels by clicking on the{' '}
      <div
        css={`
          display: inline-block;
          align-items: center;
          border-radius: 3px;
          overflow: hidden;
          height: 22px;
        `}
      >
        <EthIdenticon
          address={ETH_ADDRESS}
          css={`
            position: relative;
            z-index: 1;
          `}
        />
        <IdentityBadge
          css={`
            position: relative;
            left: -3px;
          `}
          entity="Address badge"
        />
      </div>
      anywhere in the app, or importing a .json file with labels by clicking
      "Import" below.
    </div>
    <button>Import</button>
  </React.Fragment>
)

const Warning = () => (
  <div>
    <div>i All labels are local to your device</div>
    <div>
      If you want to share the labels with others, you will need to export them
      and share the .json file
    </div>
  </div>
)

const StyledAppView = styled(AppView)`
  position: fixed;
  background: #fff;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: ${({ smallView }) => (smallView ? 2 : 4)};
`

export default props => (
  <Viewport>
    {({ below }) => <Preferences smallView={below('medium')} {...props} />}
  </Viewport>
)
