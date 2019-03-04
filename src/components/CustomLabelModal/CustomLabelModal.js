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
import { ModalConsumer } from '../ModalManager/ModalManager'

const CustomLabelModal = ({ opened, showModal, ...props }) => {
  if (!opened) {
    return null
  }

  React.useEffect(() => {
    showModal(Modal, props)
  })

  return null
}

CustomLabelModal.propTypes = {
  opened: PropTypes.bool.isRequired,
  showModal: PropTypes.func.isRequired,
}

const Modal = ({ address, label, onCancel, onSave, hideModal }) => {
  const action = label && label.trim() ? 'Edit' : 'Add'
  const labelInput = React.useRef(null)
  const handleCancel = () => {
    onCancel()
    hideModal()
  }
  const handleSave = () => {
    const label = labelInput.current.value.trim()
    if (label && label.length < 500) {
      onSave({ address, label })
      hideModal()
    }
  }

  return (
    <Wrap>
      <Title>{action} custom label</Title>
      <Description>
        This label would be displayed instead of the following address and only
        be <span>stored on this device</span>.
      </Description>
      <IdentityBadge address={address} entity={address} />
      <Label>
        <div>Custom Label</div>
        <TextInput wide defaultValue={label} ref={labelInput} />
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
  )
}

Modal.propTypes = {
  address: PropTypes.string,
  label: PropTypes.string,
  onCancel: PropTypes.func,
  onSave: PropTypes.func,
  hideModal: PropTypes.func,
}

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

export default props => (
  <ModalConsumer>
    {({ showModal, hideModal }) => (
      <CustomLabelModal
        {...props}
        showModal={showModal}
        hideModal={hideModal}
      />
    )}
  </ModalConsumer>
)
