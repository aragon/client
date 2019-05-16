import React, { useCallback, useEffect } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Button, TextInput, breakpoint, font, theme } from '@aragon/ui'
import { ModalContext } from '../ModalManager/ModalManager'
import EscapeOutside from '../EscapeOutside/EscapeOutside'
import IdentityBadgeWithNetwork from '../IdentityBadge/IdentityBadgeWithNetwork'
import keycodes from '../../keycodes'
import { EthereumAddressType } from '../../prop-types'

const LocalIdentityModal = React.memo(
  ({ opened, address, label, onCancel, onSave }) => {
    const { showModal, hideModal } = React.useContext(ModalContext)

    const modalProps = React.useMemo(
      () => ({ address, label, onCancel, onSave }),
      [address, label, onCancel, onSave]
    )

    React.useEffect(() => {
      if (opened) {
        showModal(Modal, modalProps)
      } else {
        hideModal()
      }
    }, [opened, modalProps, showModal, hideModal])

    return null
  }
)

LocalIdentityModal.propTypes = {
  opened: PropTypes.bool.isRequired,
  address: EthereumAddressType,
  label: PropTypes.string,
  onCancel: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
}

const Modal = ({ address, label, onCancel, onSave }) => {
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
        <Title>{action} custom label</Title>
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
          <Button mode="secondary" onClick={handleCancel}>
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

Modal.propTypes = {
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
  padding: 16px;
  max-width: calc(100vw - 32px);

  ${breakpoint(
    'medium',
    `
      padding: 16px 32px;
      max-width: 50vw;
      /* wide identity badge + paddings */
      min-width: ${400 + 32 * 2}px;
    `
  )}
`

const Title = styled.h3`
  ${font({ size: 'xlarge' })};
`

const Description = styled.p`
  margin: 20px 0;
  & span {
    font-weight: bold;
  }
`

const Label = styled.label`
  display: block;
  margin: 20px 0;
  text-transform: uppercase;
  color: ${theme.textSecondary};
  ${font({ size: 'xsmall' })};

  & > div {
    margin: 5px 0;
  }
`

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
  )}
`

const StyledSaveButton = styled(Button)`
  ${breakpoint(
    'medium',
    `
      margin-left: 16px;
    `
  )}
`

export default LocalIdentityModal
