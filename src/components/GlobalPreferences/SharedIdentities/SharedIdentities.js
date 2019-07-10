import React from 'react'
import styled from 'styled-components'
import {
  Box,
  Button,
  Checkbox,
  IdentityBadge,
  GU,
  LoadingRing,
  breakpoint,
  font,
  useTheme,
} from '@aragon/ui'

function SharedIdentities({
  onSave,
  onCancel,
  identities,
  isSaving,
  selected,
  allSelected,
  someSelected,
  onToggleAll,
  onToggleIdentity,
}) {
  const theme = useTheme()

  return (
    <React.Fragment>
      <div
        css={`
          margin-bottom: ${3 * GU}px;
        `}
      >
        These labels have been shared with you. By clicking on the ‘Save’ button
        below, you will make them appear on this device (labels will be stored
        locally).
      </div>
      <Box padding={0}>
        {isSaving ? (
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
        ) : (
          <React.Fragment>
            <div
              css={`
                text-transform: uppercase;
                color: ${theme.content};
                ${font({ size: 'xsmall' })};
                align-items: center;
                padding: ${0.5 * GU}px ${2 * GU}px;
              `}
            >
              <StyledCheckbox
                checked={allSelected}
                onChange={onToggleAll}
                indeterminate={!allSelected && someSelected}
              />
              {selected.size} labels selected
            </div>
            <List border={theme.border} surface={theme.surface}>
              {identities.map(({ address, name }) => (
                <li
                  key={address}
                  css={`
                    padding: ${2 * GU}px;
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    align-items: center;
                    border-bottom: 1px solid ${theme.border};
                    background: ${selected.get(address)
                      ? theme.surfaceSelected
                      : theme.surface};
                  `}
                >
                  <Label>
                    <StyledCheckbox
                      checked={selected.get(address)}
                      onChange={onToggleIdentity(address)}
                    />
                    {name}
                  </Label>
                  <div css="text-align: right;">
                    <IdentityBadge entity={address} />
                  </div>
                </li>
              ))}
            </List>
            <div
              css={`
                text-align: right;
                padding: ${2 * GU}px;
              `}
            >
              <Button
                css={`
                  margin-right: ${2 * GU}px;
                `}
                onClick={onCancel}
              >
                Cancel
              </Button>
              <Button mode="strong" onClick={onSave}>
                Save labels
              </Button>
            </div>
          </React.Fragment>
        )}
      </Box>
    </React.Fragment>
  )
}

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
  width: 100%;
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

export default SharedIdentities
