import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { format } from 'date-fns'
import {
  Badge,
  Button,
  IconCross,
  IdentityBadge,
  Info,
  breakpoint,
  font,
  theme,
} from '@aragon/ui'
import { CustomLabelModalContext } from '../CustomLabelModal/CustomLabelModalManager'
import { LocalIdentityContext } from '../../components/LocalIdentityManager/LocalIdentityManager'

import { getAll, resolve } from '../../mockCustomLabelsManager'
import EmptyCustomLabels from './EmptyCustomLabels'
import Import from './Import'

const CustomLabels = () => {
  const { localIdentities } = React.useContext(LocalIdentityContext)
  // const [list, setList] = React.useState(getAll())

  // TODO transform localIdentities from object into sorted array
  const list = Object.keys(localIdentities).map(address => {
    return Object.assign({}, localIdentities[address], { address })
  })

  const handleClearAll = () => {
    console.log('handleClearAll')
    // TODO clear local identities
    // removeAll()
    // setList([])
  }
  const handleImport = () => {
    console.log('handleImport')
    // setList(getAll())
    // TODO Check with Jouni/Paty -
    // TODO iterate and call modify for each imported
    // modification through the wrapper ->
  }

  return (
    <React.Fragment>
      <Labels list={list} clearAll={handleClearAll} onImport={handleImport} />
      <Warning />
    </React.Fragment>
  )
}

CustomLabels.propTypes = {
  localIdentities: PropTypes.object,
}

const Labels = ({ clearAll, list, onImport }) => {
  if (!list.length) {
    return <EmptyCustomLabels onImport={onImport} />
  }
  const updateLabel = (fn, address) => () => {
    fn(address)
  }
  const href = window.URL.createObjectURL(
    new Blob([JSON.stringify(getAll())], { type: 'text/json' })
  )
  // Mar 01 2019
  const today = format(Date.now(), 'MMM dd yyyy')
  const { showCustomLabelModal } = React.useContext(CustomLabelModalContext)

  return (
    <React.Fragment>
      <Headers>
        <div>Custom label</div>
        <div>Address</div>
      </Headers>
      <List>
        {list.map(({ address }) => (
          <Item key={address}>
            <Label>{resolve(address)}</Label>
            <div>
              <IdentityBadge
                entity={address}
                popoverAction={{
                  title: <PopoverActionTitle address={address} />,
                  label: 'Edit custom label',
                  onClick: updateLabel(showCustomLabelModal, address),
                }}
              />
            </div>
          </Item>
        ))}
      </List>
      <Controls>
        <Import onImport={onImport} />
        <StyledExport
          label="Export labels"
          mode="secondary"
          download={`custom labels (${today}).json`}
          href={href}
        >
          Export
        </StyledExport>
        <Button label="Remove labels" mode="outline" onClick={clearAll}>
          <IconCross /> Remove all labels
        </Button>
      </Controls>
    </React.Fragment>
  )
}

Labels.defaultProps = {
  list: [],
}

Labels.propTypes = {
  list: PropTypes.array,
  clearAll: PropTypes.func.isRequired,
  onImport: PropTypes.func.isRequired,
}

const PopoverActionTitle = ({ address }) => {
  return (
    <WrapTitle>
      <TitleLabel>{resolve(address)}</TitleLabel>
      <Badge
        css={`
          margin-left: 16px;
          text-transform: uppercase;
          ${font({ size: 'xsmall' })};
        `}
      >
        Custom label
      </Badge>
    </WrapTitle>
  )
}

PopoverActionTitle.propTypes = {
  address: PropTypes.string.isRequired,
}

const Label = styled.div`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

const WrapTitle = styled.div`
  display: grid;
  align-items: center;
  grid-template-columns: auto 1fr;
  padding-right: 24px;
`

const TitleLabel = styled.span`
  display: inline-block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

const Warning = () => (
  <StyledInfoAction title="All labels are local to your device">
    <div>
      Any labels you add or import will only be shown on this device, and not
      stored anywhere else. If you want to share the labels with other devices
      or users, you will need to export them and share the .json file
    </div>
  </StyledInfoAction>
)

const StyledExport = styled(Button.Anchor)`
  margin: 0 24px 24px;
`

const Controls = styled.div`
  display: flex;
  align-items: start;
  flex-wrap: wrap;
  margin-top: 20px;
  padding: 0 16px;

  ${breakpoint(
    'medium',
    `
      padding: 0;
    `
  )}
`

const StyledInfoAction = styled(Info.Action)`
  margin: 16px 16px 0 16px;

  ${breakpoint(
    'medium',
    `
      margin: 0;
      margin-top: 16px;
    `
  )}
`

const Headers = styled.div`
  margin: 10px auto;
  text-transform: uppercase;
  color: ${theme.textSecondary};
  ${font({ size: 'xsmall' })};
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: center;

  & > div {
    padding-left: 16px;
  }
`

const Item = styled.li`
  padding: 16px 0;
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: center;
  border-bottom: 1px solid ${theme.contentBorder};

  & > div {
    padding-left: 16px;
  }
`

const List = styled.ul`
  padding: 0;
  list-style: none;
  overflow: hidden;

  li:first-child {
    border-top: 1px solid ${theme.contentBorder};
  }

  ${breakpoint(
    'medium',
    `
      max-height: 50vh;
      overflow: auto;
      border-radius: 4px;
      border: 1px solid ${theme.contentBorder};

      li:first-child {
        border-top: none;
      }
      li:last-child {
        border-bottom: none;
      }
    `
  )}
`

export default CustomLabels
