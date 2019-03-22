import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import {
  Button,
  IdentityBadge,
  TextInput,
  breakpoint,
  font,
  theme,
} from '@aragon/ui'
import { ModalContext } from '../ModalManager/ModalManager'
import EscapeOutside from '../EscapeOutside/EscapeOutside'

const LocalIdentityModal = ({ opened, ...props }) => {
  const { showModal, hideModal } = React.useContext(ModalContext)
  React.useEffect(() => {
    opened ? showModal(Modal, props) : hideModal()
  }, [opened])

  return null
}

LocalIdentityModal.propTypes = {
  opened: PropTypes.bool.isRequired,
}

const Modal = ({ address, label, onCancel, onSave }) => {
  const [action, setAction] = React.useState()
  const labelInput = React.useRef(null)
  const handleCancel = () => {
    onCancel()
  }
  const [error, setError] = React.useState(null)
  const handleSave = () => {
    try {
      const label = labelInput.current.value.trim()
      if (label) {
        onSave({ address, label })
      }
    } catch (e) {
      setError(e)
    }
  }
  React.useEffect(() => {
    setAction(label && label.trim() ? 'Edit' : 'Add')
    labelInput.current.focus()
    labelInput.current.select()
    const handleKeyUp = e => e.keyCode === 13 && handleSave()
    window.addEventListener('keyup', handleKeyUp, true)
    return () => window.removeEventListener('keyup', handleKeyUp)
  }, [])

  return (
    <EscapeOutside onEscapeOutside={onCancel}>
      <Wrap>
        <Title>{action} custom label</Title>
        <Description>
          This label would be displayed instead of the following address and
          only be <span>stored on this device</span>.
        </Description>
        <IdentityBadge address={address} entity={address} />
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
  address: PropTypes.string,
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
      min-width: calc(400px + 32px * 2);
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
