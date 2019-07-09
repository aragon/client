import React from 'react'
import styled from 'styled-components'
import { Button, GU, Modal, breakpoint } from '@aragon/ui'

function RemoveModal({ visible, onClose, onConfirm }) {
  return (
    <Modal visible={visible} onClose={onClose}>
      <h2 css="font-size: 22px;">Remove labels</h2>
      <p
        css={`
          margin: ${2.5 * GU}px 0 ${2.5 * GU}px 0;
        `}
      >
        This action will irreversibly delete the selected labels you have added
        to your organization on this device
      </p>
      <ModalControls>
        <Button label="Remove labels" mode="strong" onClick={onConfirm}>
          Remove
        </Button>
        <CancelButton label="Cancel" mode="secondary" onClick={onClose}>
          Cancel
        </CancelButton>
      </ModalControls>
    </Modal>
  )
}

const ModalControls = styled.div`
  display: grid;
  grid-gap: ${1.5 * GU}px;
  grid-template-columns: 1fr 1fr;
  ${breakpoint(
    'medium',
    `
      display: flex;
      justify-content: flex-start;
    `
  )}
`

const CancelButton = styled(Button)`
  ${breakpoint(
    'medium',
    `
      margin-left: ${2.5 * GU}px;
    `
  )}
`

export default RemoveModal
