import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import {
  Box,
  Button,
  Checkbox,
  IdentityBadge,
  GU,
  LoadingRing,
  textStyle,
  useTheme,
  useViewport,
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
  const { above } = useViewport()

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
                display: flex;
                align-items: center;
                padding: ${0.5 * GU}px ${2 * GU}px;
              `}
            >
              <StyledCheckbox
                checked={allSelected}
                onChange={onToggleAll}
                indeterminate={!allSelected && someSelected}
              />
              <span
                css={`
                  color: ${theme.surfaceContentSecondary};
                  ${textStyle('label2')}
                `}
              >
                {Array.from(selected.values()).reduce(
                  (p, c) => p + Number(c),
                  0
                )}{' '}
                labels selected
              </span>
            </div>
            <ul
              css={`
                padding: 0;
                list-style: none;
                overflow: hidden;
                width: 100%;
                background: ${theme.surface};
                z-index: 1;
                border-top: ${theme.border};
                border-bottom: ${theme.border};

                ${above('medium') &&
                  `
                    max-height: 40vh;
                    overflow: auto;

                    li:first-child {
                      border-top: none;
                    }
                    li:last-child {
                      border-bottom: none;
                    }
                  `}
              `}
            >
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
                  <label
                    css={`
                      display: block;
                      white-space: nowrap;
                      overflow: hidden;
                      text-overflow: ellipsis;
                    `}
                  >
                    <StyledCheckbox
                      checked={selected.get(address)}
                      onChange={onToggleIdentity(address)}
                    />
                    {name}
                  </label>
                  <div css="text-align: right;">
                    <IdentityBadge entity={address} />
                  </div>
                </li>
              ))}
            </ul>
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

SharedIdentities.propTypes = {
  onSave: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  identities: PropTypes.array,
  isSaving: PropTypes.bool,
  selected: PropTypes.instanceOf(Map),
  allSelected: PropTypes.bool,
  someSelected: PropTypes.bool,
  onToggleAll: PropTypes.func.isRequired,
  onToggleIdentity: PropTypes.func.isRequired,
}

const StyledCheckbox = styled(Checkbox)`
  margin-right: ${3 * GU}px;
`

export default React.memo(SharedIdentities)
