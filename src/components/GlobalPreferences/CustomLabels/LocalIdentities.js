import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import {
  Box,
  Checkbox,
  GU,
  IconDown,
  IconDownload,
  IconExternal,
  IconGrid,
  IconSearch,
  IconShare,
  IconTrash,
  IdentityBadge,
  Info,
  TextInput,
  breakpoint,
  font,
  theme,
} from '@aragon/ui'
import ButtonDropDown from '../../ButtonDropDown/ButtonDropDown'
import LocalIdentityPopoverTitle from '../../IdentityBadge/LocalIdentityPopoverTitle'
import { fileImport } from './Import'

const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream

function LocalIdentities({
  allSelected,
  identities,
  identitiesSelected,
  onExport,
  onImport,
  onRemove,
  onSearchChange,
  onShare,
  onToggleAll,
  onToggleIdentity,
  searchTerm,
  onShowLocalIdentityModal,
  someSelected,
}) {
  return (
    <Box>
      <Controls>
        <div
          css={`
            position: relative;
          `}
        >
          <TextInput
            css={`
              padding-right: ${4 * GU}px;
            `}
            placeholder="Search"
            onChange={onSearchChange}
            value={searchTerm}
          />
          <IconSearch
            css={`
              position: absolute;
              right: ${1 * GU}px;
              top: ${1 * GU}px;
            `}
          />
        </div>
        <Actions
          someSelected={someSelected}
          onShare={onShare}
          onExport={onExport}
          onImport={onImport}
          onRemove={onRemove}
        />
      </Controls>
      <Headers>
        <div>
          {!iOS && (
            <StyledCheckbox
              checked={allSelected}
              onChange={onToggleAll}
              indeterminate={!allSelected && someSelected}
            />
          )}
          Custom label
        </div>
        <div>Address</div>
      </Headers>
      <List>
        {identities.map(({ address, name }) => (
          <Item key={address}>
            <Label>
              {!iOS && (
                <StyledCheckbox
                  checked={identitiesSelected.get(address)}
                  onChange={onToggleIdentity(address)}
                />
              )}
              {name}
            </Label>
            <div>
              <IdentityBadge
                entity={address}
                popoverAction={{
                  label: 'Edit custom label',
                  onClick: onShowLocalIdentityModal(address),
                }}
                popoverTitle={<LocalIdentityPopoverTitle label={name} />}
              />
            </div>
          </Item>
        ))}
      </List>
      <Info
        css={`
          margin-top: ${3 * GU}px;
        `}
      >
        Any labels you add or import will only be shown on this device, and not
        stored anywhere else. If you want to share the labels with other devices
        or users, you will need to export them and share the .json file.
      </Info>
    </Box>
  )
}

function Actions({ onShare, onImport, onExport, onRemove, someSelected }) {
  const inputRef = React.useRef()
  const handleClick = index => {
    if (index === 0) {
      onShare()
      return
    }
    if (index === 1) {
      // trigger file chooser
      inputRef.current.click()
      return
    }
    if (index === 2) {
      onExport()
      return
    }
    onRemove()
  }
  const handleFileChange = ({ currentTarget: { files } }) =>
    fileImport(onImport)(files)

  return (
    <React.Fragment>
      <input
        type="file"
        onChange={handleFileChange}
        css={`
          position: absolute;
          z-index: 1;
          display: inline-block;
          opacity: 0;
          height: 1px;
          width: 1px;
          top: 101vh;
          left: 101vw;
        `}
        ref={inputRef}
      />
      <ButtonDropDown
        css="z-index: 2;"
        items={[
          <ActionSpan>
            <IconShare />
            <span>Share</span>
          </ActionSpan>,
          ...(!iOS
            ? [
                <ActionSpan>
                  <IconDownload />
                  <span>Import</span>
                </ActionSpan>,
              ]
            : []),
          <ActionSpan>
            <IconExternal />
            <span>Export</span>
          </ActionSpan>,
          <ActionSpan>
            <IconTrash css="color: red;" />
            <span>Remove</span>
          </ActionSpan>,
        ]}
        cover={
          <span
            css={`
              display: grid;
              grid-template-columns: auto calc(100% - ${3 * GU}px) auto;
              grid-gap: ${1 * GU}px;
              align-items: center;
              padding-left: ${1 * GU}px;
              z-index: 2;
            `}
          >
            <IconGrid />
            <span css="text-align: left;">Actions</span>
            <IconDown size="small" />
          </span>
        }
        onClick={handleClick}
      />
    </React.Fragment>
  )
}

const ActionSpan = styled.span`
  display: grid;
  align-items: center;
  grid-template-columns: auto auto;
  grid-gap: ${1 * GU}px;
  padding-left: ${1 * GU}px;
`

const StyledCheckbox = styled(Checkbox)`
  margin-right: ${3 * GU}px;
`

const Label = styled.label`
  display: block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

const Controls = styled.div`
  display: grid;
  grid-template-columns: auto auto;
  grid-gap: ${1 * GU}px;
  align-items: center;
  justify-content: flex-end;
  margin-bottom: ${2 * GU}px;

  ${breakpoint(
    'medium',
    `
      padding: 0;
    `
  )}
`

const Headers = styled.div`
  text-transform: uppercase;
  color: ${theme.textSecondary};
  ${font({ size: 'xsmall' })};
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: center;

  & > div {
    padding-left: ${2 * GU}px;
  }
`

const Item = styled.li`
  padding: ${2 * GU}px 0;
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: center;
  border-bottom: 1px solid ${theme.contentBorder};

  & > label {
    padding-left: ${2 * GU}px;
  }
`

const List = styled.ul`
  padding: 0;
  list-style: none;
  overflow: hidden;
  width: calc(100% + ${4 * GU}px);
  position: relative;
  left: -${2 * GU}px;
  background: ${theme.contentBackground};
  z-index: 1;

  li:first-child {
    border-top: 1px solid ${theme.contentBorder};
  }

  ${breakpoint(
    'medium',
    `
      max-height: 40vh;
      overflow: auto;
      border-radius: 4px;
      border-top: 1px solid ${theme.contentBorder};
      border-bottom: 1px solid ${theme.contentBorder};

      li:first-child {
        border-top: none;
      }
      li:last-child {
        border-bottom: none;
      }
    `
  )}
`

export default LocalIdentities
