import React, { useCallback, useEffect } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import {
  Button,
  EscapeOutside,
  Modal,
  TextInput,
  breakpoint,
  textStyle,
  useTheme,
} from '@aragon/ui'
import IdentityBadgeWithNetwork from '../IdentityBadge/IdentityBadgeWithNetwork'
import keycodes from '../../keycodes'
import { EthereumAddressType } from '../../prop-types'

const LocalIdentityModal = React.memo(
  ({ opened, address, label, onCancel, onSave }) => {
    return (
      <Modal visible={opened} onClose={onCancel}>
        <LocalModal
          address={address}
          label={label}
          onCancel={onCancel}
          onSave={onSave}
        />
      </Modal>
    )
  }
)

LocalIdentityModal.propTypes = {
  opened: PropTypes.bool.isRequired,
  address: EthereumAddressType,
  label: PropTypes.string,
  onCancel: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
}

const LocalModal = ({ address, label, onCancel, onSave }) => {
  const [action, setAction] = React.useState(null)
  const [error, setError] = React.useState(null)
  const labelInput = React.useRef(null)

  const handleCancel = useCallback(() => {
    onCancel()
  }, [onCancel])

  const handleSave = useCallback(() => {
    try {
      const label = labelInput.current.value.trim()
      if (label) {
        onSave({ address, label })
      }
    } catch (e) {
      setError(e)
    }
  }, [address, labelInput, onSave])

  const handleKeyDown = useCallback(
    e => {
      if (e.keyCode === keycodes.enter) {
        handleSave()
      } else if (e.keyCode === keycodes.esc) {
        handleCancel()
      }
    },
    [handleCancel, handleSave]
  )

  useEffect(() => {
    setAction(label && label.trim() ? 'Edit' : 'Add')
    labelInput.current.focus()
    labelInput.current.select()
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [label, labelInput, handleKeyDown])

  return (
    <EscapeOutside onEscapeOutside={onCancel}>
      <Wrap>
        <h3
          css={`
            ${textStyle('title4')};
          `}
        >
          {action} custom label
        </h3>
        <Description>
          This label would be displayed instead of the following address and
          only be <span>stored on this device</span>.
        </Description>
        <IdentityBadgeWithNetwork entity={address} />
        <Label>
          <div>Custom Label</div>
          <TextInput
            wide
            defaultValue={label}
            ref={labelInput}
            maxLength="42"
          />
          <Error>{error}</Error>
        </Label>
        <Controls>
          <Button css="min-width: 128px;" onClick={handleCancel}>
            Cancel
          </Button>
          <StyledSaveButton mode="strong" onClick={handleSave}>
            Save
          </StyledSaveButton>
        </Controls>
      </Wrap>
    </EscapeOutside>
  )
}

LocalModal.propTypes = {
  address: EthereumAddressType,
  label: PropTypes.string,
  onCancel: PropTypes.func,
  onSave: PropTypes.func,
}

const Error = styled.div`
  color: #f56a6a;
  text-transform: initial;
`

const Wrap = styled.div`
  background: #fff;
  max-width: calc(100vw - 32px);

  ${breakpoint(
    'medium',
    `
      /* wide identity badge + paddings */
      min-width: ${400 + 16 * 2}px;
    `
  )};
`

const Description = styled.p`
  margin: 20px 0;
  & span {
    font-weight: bold;
  }
`

function Label(props) {
  const theme = useTheme()
  return (
    <label
      css={`
        display: block;
        margin: 20px 0;
        color: ${theme.surfaceContentSecondary};
        ${textStyle('label2')};
        & > div {
          margin: 5px 0;
        }
      `}
      {...props}
    />
  )
}

const Controls = styled.div`
  display: grid;
  grid-gap: 10px;
  grid-template-columns: 1fr 1fr;

  ${breakpoint(
    'medium',
    `
      display: flex;
      justify-content: flex-end;
    `
  )};
`

const StyledSaveButton = styled(Button)`
  min-width: 128px;

  ${breakpoint(
    'medium',
    `
      margin-left: 16px;
    `
  )};
`

export default LocalIdentityModal
