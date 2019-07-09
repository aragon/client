import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import {
  Box,
  Button,
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
  LoadingRing,
  TextInput,
  breakpoint,
  font,
  useTheme,
} from '@aragon/ui'
import EmptyFilteredIdentities from './EmptyFilteredIdentities'
import ButtonDropDown from '../../ButtonDropDown/ButtonDropDown'
import LocalIdentityPopoverTitle from '../../IdentityBadge/LocalIdentityPopoverTitle'
import { fileImport } from './Import'

const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream

function LocalIdentities({
  allSelected,
  identities,
  identitiesSelected,
  isSharedLink,
  isSavingSharedLink,
  onClear,
  onExport,
  onImport,
  onRemove,
  onSearchChange,
  onShare,
  onSharedIdentitiesCancel,
  onSharedIdentitiesSave,
  onShowLocalIdentityModal,
  onToggleAll,
  onToggleIdentity,
  searchTerm,
  someSelected,
}) {
  const theme = useTheme()
  const inputRef = React.useRef()
  // trigger file chooser
  const handleImportClick = () => inputRef.current.click()
  const handleFileChange = ({ currentTarget: { files } }) =>
    fileImport(onImport)(files)

  return (
    <Box>
      <div
        css={`
          display: grid;
          grid-template-columns: auto auto auto;
          grid-gap: ${1 * GU}px;
          align-items: center;
          justify-content: flex-end;
          margin-bottom: ${2 * GU}px;
        `}
      >
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
        {!iOS && (
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
                top: -101vh;
                left: -101vw;
              `}
              ref={inputRef}
            />
            <Button onClick={handleImportClick}>
              <IconDownload />
              <span
                css={`
                  display: inline-block;
                  padding-right: ${1.5 * GU}px;
                `}
              >
                Import
              </span>
            </Button>
          </React.Fragment>
        )}
        <Actions
          someSelected={someSelected}
          onShare={onShare}
          onExport={onExport}
          onRemove={onRemove}
          // shared link
          isSharedLink={isSharedLink}
          onSave={onSharedIdentitiesSave}
          onCancel={onSharedIdentitiesCancel}
        />
      </div>
      {isSavingSharedLink && (
        <div
          css={`
            width: 100%;
            height: 400px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
          `}
        >
          <LoadingRing />
          <div>Saving…</div>
        </div>
      )}
      {!identities.length ? (
        <EmptyFilteredIdentities onClear={onClear} />
      ) : (
        !isSavingSharedLink && (
          <React.Fragment>
            <div
              css={`
                text-transform: uppercase;
                color: ${theme.content};
                ${font({ size: 'xsmall' })};
                display: grid;
                grid-template-columns: 1fr 1fr;
                align-items: center;
                margin-bottom: ${1 * GU}px;
              `}
            >
              <div>
                <StyledCheckbox
                  checked={allSelected}
                  onChange={onToggleAll}
                  indeterminate={!allSelected && someSelected}
                />
                Custom label
              </div>
              <div css="text-align: right;">
                <span
                  css={`
                    display: inline-block;
                    width: 136px;
                    text-align: left;
                  `}
                >
                  Address
                </span>
              </div>
            </div>
            <List border={theme.border} surface={theme.surface}>
              {identities.map(({ address, name }) => (
                <li
                  key={address}
                  css={`
                    /* needs spacing left to compensate for list being moved to the edge */
                    padding: ${2 * GU}px;
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    align-items: center;
                    border-bottom: 1px solid ${theme.border};
                  `}
                >
                  <Label>
                    <StyledCheckbox
                      checked={identitiesSelected.get(address)}
                      onChange={onToggleIdentity(address)}
                    />
                    {name}
                  </Label>
                  <div css="text-align: right;">
                    <IdentityBadge
                      entity={address}
                      popoverAction={
                        !isSharedLink
                          ? {
                              label: 'Edit custom label',
                              onClick: onShowLocalIdentityModal(address),
                            }
                          : null
                      }
                      popoverTitle={
                        !isSharedLink ? (
                          <LocalIdentityPopoverTitle label={name} />
                        ) : null
                      }
                    />
                  </div>
                </li>
              ))}
            </List>
            {isSharedLink ? (
              <div
                css={`
                  margin-top: ${2 * GU}px;
                `}
              >
                These labels have been shared with you. By clicking on the
                “Save” button, you will make them appear on this device (labels
                will be stored locally).
              </div>
            ) : (
              <Info
                css={`
                  margin-top: ${3 * GU}px;
                `}
              >
                Any labels you add or import will only be shown on this device,
                and not stored anywhere else. If you want to share the labels
                with other devices or users, you will need to export them and
                share the .json file.
              </Info>
            )}
          </React.Fragment>
        )
      )}
    </Box>
  )
}

function Actions({
  isSharedLink,
  onCancel,
  onExport,
  onRemove,
  onSave,
  onShare,
  someSelected,
}) {
  const handleClick = index => {
    if (isSharedLink) {
      if (index === 0) {
        onSave()
        return
      }
      onCancel()
      return
    }

    if (index === 0) {
      onShare()
      return
    }
    if (index === 1) {
      onExport()
      return
    }
    onRemove()
  }

  return (
    <React.Fragment>
      <ButtonDropDown
        css="z-index: 2;"
        items={
          isSharedLink
            ? [<ActionSpan>Save</ActionSpan>, <ActionSpan>Cancel</ActionSpan>]
            : [
                <ActionSpan>
                  <IconShare />
                  <span>Share</span>
                </ActionSpan>,
                <ActionSpan>
                  <IconExternal />
                  <span>Export</span>
                </ActionSpan>,
                <ActionSpan>
                  <IconTrash css="color: red;" />
                  <span>Remove</span>
                </ActionSpan>,
              ]
        }
        cover={
          <span
            css={`
              display: grid;
              grid-template-columns: auto 1fr auto;
              grid-gap: ${1 * GU}px;
              width: 100%;
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

const List = styled.ul`
  padding: 0;
  list-style: none;
  overflow: hidden;
  width: calc(100% + ${4 * GU}px);
  position: relative;
  left: -${2 * GU}px;
  background: ${({ surface }) => surface};
  z-index: 1;
  border-top: ${({ border }) => `1px solid ${border};`};
  border-bottom: ${({ border }) => `1px solid ${border};`};

  ${breakpoint(
    'medium',
    `
      max-height: 40vh;
      overflow: auto;

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
