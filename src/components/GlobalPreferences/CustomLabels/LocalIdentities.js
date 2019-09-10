import React, { useCallback } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import {
  Box,
  Button,
  ButtonBase,
  Checkbox,
  DropDown,
  GU,
  IconArrowDown,
  IconArrowUp,
  IconDownload,
  IconExternal,
  IconGrid,
  IconSearch,
  IconShare,
  IconTrash,
  Info,
  TextInput,
  breakpoint,
  useTheme,
  useLayout,
  useToast,
  textStyle,
} from '@aragon/ui'
import EmptyFilteredIdentities from './EmptyFilteredIdentities'
import Import from './Import'
import LocalIdentityBadge from '../../IdentityBadge/LocalIdentityBadge'
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
  const { layoutName } = useLayout()
  const compact = layoutName === 'small'
  const theme = useTheme()

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
            adornment={
              <IconSearch
                css={`
                  color: ${theme.surfaceOpened};
                `}
              />
            }
            adornmentPosition="end"
            placeholder="Search"
            onChange={onSearchChange}
            value={searchTerm}
            css={`
              width: ${compact ? 25 * GU : 30 * GU}px;
              ${textStyle('body2')};
              color: ${searchTerm.trim() ? theme.surfaceContent : theme.hint};
            `}
          />
        </div>
        {!iOS && (
          <Import
            onImport={onImport}
            button={
              <Button
                css={`
                  ${compact &&
                    `
                      width: 50px;
                      min-width: unset;
                      padding: 0;
                    `}
                `}
              >
                <IconDownload
                  css={`
                    color: ${theme.surfaceOpened};
                  `}
                />
                {!compact && (
                  <span
                    css={`
                      display: inline-block;
                      padding-left: ${1.5 * GU}px;
                    `}
                  >
                    Import
                  </span>
                )}
              </Button>
            }
          />
        )}
        <Actions
          disabled={!someSelected}
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
              display: grid;
              grid-template-columns: 1fr 1fr;
              align-items: center;
              margin-bottom: ${1 * GU}px;
              ${textStyle('label2')};
              color: ${theme.contentSecondary};
            `}
          >
            <div
              css={`
                display: flex;
                align-items: center;
              `}
            >
              <StyledCheckbox
                checked={allSelected}
                onChange={onToggleAll}
                indeterminate={!allSelected && someSelected}
              />
              {someSelected ? (
                `${identities.reduce(
                  (p, { address }) =>
                    p + Number(identitiesSelected.get(address)),
                  0
                )} labels selected`
              ) : (
                <div
                  css={`
                    display: inline-flex;
                    align-items: center;
                    height: 16px;
                  `}
                >
                  <ButtonBase
                    label="Toggle sort"
                    onClick={onToggleSort}
                    css={`
                      padding: ${0.5 * GU}px ${3 * GU}px;
                      position: relative;
                      left: ${-3 * GU}px;
                      border-radius: 0;
                      display: flex;
                      align-items: center;

                      &:active {
                        background: ${theme.surfaceSelected};
                      }
                    `}
                  >
                    <span
                      css={`
                        margin-right: ${1 * GU}px;
                        ${textStyle('label2')}
                      `}
                    >
                      Custom label{' '}
                    </span>
                    {sortIdentities === ASC ? (
                      <IconArrowDown size="small" />
                    ) : (
                      <IconArrowUp size="small" />
                    )}
                  </ButtonBase>
                </div>
              )}
            </div>
            <div css="text-align: right;">
              <span>Address</span>
            </div>
          </div>
          <List border={theme.border} surface={theme.surface}>
            {identities.map(({ address, name }) => (
              <li
                key={address}
                css={`
                  /* needs spacing left to compensate for list being moved to the edge */
                  padding: ${2 * GU}px ${3 * GU}px;
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
                  <span>{name}</span>
                </Label>
                <div css="text-align: right;">
                  <LocalIdentityBadge entity={address} forceAddress />
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

function Actions({ onExport, onRemove, onShare, disabled }) {
  const theme = useTheme()
  const { layoutName } = useLayout()
  const compact = layoutName === 'small'
  const toast = useToast()
  const handleChange = useCallback(
    index => {
      if (index === 0) {
        onShare()
        return
      }
      if (!iOS && index === 1) {
        toast('Custom labels exported successfully')
        onExport()
        return
      }
      onRemove()
    },
    [onShare, onExport, onRemove, toast]
  )

  return (
    <React.Fragment>
      <DropDown
        css={`
          box-shadow: ${disabled ? 'none' : '0px 1px 3px rgba(0, 0, 0, 0.1)'};
          ${compact ? 'min-width: unset' : ''}
        `}
        disabled={disabled}
        compact={compact}
        selected={-1}
        items={[
          <ActionSpan
            css={`
              color: ${theme.surfaceContent};
            `}
          >
            <IconShare
              css={`
                color: ${theme.surfaceIcon};
              `}
            />
            <span>Share</span>
          </ActionSpan>,
          ...(!iOS
            ? [
                <ActionSpan>
                  <IconExternal
                    css={`
                      color: ${theme.surfaceIcon};
                    `}
                  />
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
        placeholder={
          <span
            css={`
              height: 24px;
              $textStyle('body2');
              color: ${
                disabled ? theme.contentSecondary : theme.surfaceContent
              };

              ${
                !compact
                  ? `
                  display: grid;
                  grid-template-columns: auto 1fr auto;
                  grid-gap: ${1.5 * GU}px;
                  width: 100%;
                  align-items: center;
                `
                  : ''
              }
            `}
          >
            <IconGrid
              css={`
                color: ${theme.surfaceIcon};
              `}
            />
            {!compact && <span css="text-align: left;">Actions</span>}
          </span>
        }
        onChange={handleChange}
      />
    </React.Fragment>
  )
}

Actions.propTypes = {
  onExport: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired,
  onShare: PropTypes.func.isRequired,
  disabled: PropTypes.bool.isRequired,
}

const ActionSpan = styled.span`
  display: grid;
  align-items: center;
  grid-template-columns: auto 1fr;
  grid-gap: ${1 * GU}px;
  ${textStyle('body2')};

  & span {
    text-align: left;
  }
`

const StyledCheckbox = styled(Checkbox)`
  margin-right: ${3 * GU}px;
  min-width: 14px;
`

const Label = styled.label`
  display: flex;
  align-items: center;
  min-width: 0;

  & > span {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`

const List = styled.ul`
  padding: 0;
  list-style: none;
  overflow: hidden;
  width: calc(100% + ${4 * GU}px);
  position: relative;
  left: -${2 * GU}px;
  background: ${({ surface }) => surface};
  border-top: ${({ border }) => `1px solid ${border};`};
  border-bottom: ${({ border }) => `1px solid ${border};`};

  ${breakpoint(
    'medium',
    `
      left: -${3 * GU}px;
      width: calc(100% + ${6 * GU}px);
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

export default React.memo(LocalIdentities)
