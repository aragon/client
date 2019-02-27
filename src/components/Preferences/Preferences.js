import React from 'react'
import styled from 'styled-components'
import {
  AppBar,
  AppView,
  EthIdenticon,
  IdentityBadge,
  TabBar,
  Viewport,
} from '@aragon/ui'
import { CustomLabelModalConsumer } from '../CustomLabelModal/CustomLabelModalManager'
import { getAll, removeAll } from '../../mockCustomLabelsManager'

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

const CustomLabels = () => {
  const [list, setList] = React.useState(getAll)
  const clearAll = () => {
    removeAll()
    setList(getAll)
  }

  return (
    <React.Fragment>
      <Labels list={list} />
      <div>
        <button>Import</button>
        <button>Export</button>
        <button onClick={clearAll}>Remove all labels</button>
      </div>
      <Warning />
    </React.Fragment>
  )
}

const Labels = ({ list = [] }) => {
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
                  customLabelAction={{
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
