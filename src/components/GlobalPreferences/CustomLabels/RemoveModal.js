import React from 'react'
import styled from 'styled-components'
import { Button, GU, Modal, breakpoint } from '@aragon/ui'

function RemoveModal({ visible, onClose, onConfirm }) {
  return (
    <Modal visible={visible} onClose={onClose}>
      <ModalTitle>Remove labels</ModalTitle>
      <ModalText>
        This action will irreversibly delete the selected labels you have added
        to your organization on this device
      </ModalText>
      <ModalControls>
        <Button label="Cancel" mode="secondary" onClick={onClose}>
          Cancel
        </Button>
        <RemoveButton label="Remove labels" mode="strong" onClick={onConfirm}>
          Remove
        </RemoveButton>
      </ModalControls>
    </Modal>
  )
}

const ModalTitle = styled.h1`
  font-size: 22px;
`

const ModalText = styled.p`
  margin: ${2.5 * GU}px 0 ${2.5 * GU}px 0;
`

const ModalControls = styled.div`
  display: grid;
  grid-gap: ${1.5 * GU}px;
  grid-template-columns: 1fr 1fr;
  ${breakpoint(
    'medium',
    `
      display: flex;
      justify-content: flex-end;
    `
  )}
`

const RemoveButton = styled(Button)`
  ${breakpoint(
    'medium',
    `
      margin-left: ${2.5 * GU}px;
    `
  )}
`

export default RemoveModal
