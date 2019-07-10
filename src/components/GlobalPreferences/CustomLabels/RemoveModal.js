import React from 'react'
import PropTypes from 'prop-types'
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

RemoveModal.propTypes = {
  visible: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
}

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

export default React.memo(RemoveModal)
