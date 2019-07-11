import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import {
  Box,
  Button,
  ButtonIcon,
  Checkbox,
  GU,
  IconArrowDown,
  IconArrowUp,
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
  useTheme,
} from '@aragon/ui'
import EmptyFilteredIdentities from './EmptyFilteredIdentities'
import Import from './Import'
import ButtonDropDown from '../../ButtonDropDown/ButtonDropDown'
import LocalIdentityPopoverTitle from '../../IdentityBadge/LocalIdentityPopoverTitle'
import { ASC, DESC } from './useLocalIdentities'
import { iOS } from '../../../utils'

function LocalIdentities({
  allSelected,
  identities,
  identitiesSelected,
  onClear,
  onExport,
  onImport,
  onRemove,
  onSearchChange,
  onShare,
  onShowLocalIdentityModal,
  onToggleAll,
  onToggleIdentity,
  onToggleSort,
  searchTerm,
  someSelected,
  sortIdentities,
}) {
  const theme = useTheme()
  const inputRef = React.useRef()
  // trigger file chooser
  const handleImportClick = () => inputRef.current.click()

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
          <Import
            onImport={onImport}
            button={
              <Button>
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
            }
          />
        )}
        <ActionsMemo
          someSelected={someSelected}
          onShare={onShare}
          onExport={onExport}
          onRemove={onRemove}
        />
      </div>
      {!identities.length ? (
        <EmptyFilteredIdentities onClear={onClear} />
      ) : (
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
              {allSelected && !searchTerm ? (
                <div
                  css={`
                    display: inline-flex;
                    align-items: center;
                    height: 16px;
                  `}
                >
                  Custom label{' '}
                  <ButtonIcon label="Toggle sort" onClick={onToggleSort}>
                    {sortIdentities === ASC ? (
                      <IconArrowDown size="small" />
                    ) : (
                      <IconArrowUp size="small" />
                    )}
                  </ButtonIcon>
                </div>
              ) : (
                `${identities.reduce(
                  (p, { address }) =>
                    p + Number(identitiesSelected.get(address)),
                  0
                )} labels selected`
              )}
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
                  background: ${identitiesSelected.get(address)
                    ? theme.surfaceSelected
                    : theme.surface};
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
                    popoverAction={{
                      label: 'Edit custom label',
                      onClick: onShowLocalIdentityModal(address),
                    }}
                    popoverTitle={<LocalIdentityPopoverTitle label={name} />}
                  />
                </div>
              </li>
            ))}
          </List>
          <Info
            css={`
              margin-top: ${3 * GU}px;
            `}
          >
            Any labels you add or import will only be shown on this device, and
            not stored anywhere else. If you want to share the labels with other
            devices or users, you will need to export them and share the .json
            file.
          </Info>
        </React.Fragment>
      )}
    </Box>
  )
}

LocalIdentities.propTypes = {
  allSelected: PropTypes.bool.isRequired,
  identities: PropTypes.array.isRequired,
  identitiesSelected: PropTypes.instanceOf(Map).isRequired,
  onClear: PropTypes.func.isRequired,
  onExport: PropTypes.func.isRequired,
  onImport: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired,
  onSearchChange: PropTypes.func.isRequired,
  onShare: PropTypes.func.isRequired,
  onShowLocalIdentityModal: PropTypes.func.isRequired,
  onToggleAll: PropTypes.func.isRequired,
  onToggleIdentity: PropTypes.func.isRequired,
  onToggleSort: PropTypes.func.isRequired,
  searchTerm: PropTypes.string.isRequired,
  someSelected: PropTypes.bool.isRequired,
  sortIdentities: PropTypes.oneOf([ASC, DESC]).isRequired,
}

function Actions({ onExport, onRemove, onShare, someSelected }) {
  const theme = useTheme()
  const handleClick = index => {
    if (index === 0) {
      onShare()
      return
    }
    if (!iOS && index === 1) {
      onExport()
      return
    }
    onRemove()
  }

  return (
    <React.Fragment>
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
                  <IconExternal />
                  <span>Export</span>
                </ActionSpan>,
              ]
            : []),
          <ActionSpan>
            <IconTrash
              css={`
                color: ${theme.red};
              `}
            />
            <span>Remove</span>
          </ActionSpan>,
        ]}
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

Actions.propTypes = {
  onExport: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired,
  onShare: PropTypes.func.isRequired,
  someSelected: PropTypes.bool.isRequired,
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

const ActionsMemo = React.memo(Actions)

export default React.memo(LocalIdentities)
