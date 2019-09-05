import React, { useCallback } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Button, GU, Modal, breakpoint, textStyle, useToast } from '@aragon/ui'

function RemoveModal({ visible, onClose, onConfirm }) {
  const toast = useToast()
  const handleConfirm = useCallback(() => {
    toast('Custom labels removed successfully')
    onConfirm()
  }, [onConfirm, toast])

  return (
    <Modal visible={visible} onClose={onClose} css="z-index: 2;">
      <h1
        css={`
          ${textStyle('title2')}
        `}
      >
        Remove labels
      </h1>
      <p
        css={`
          margin-top: ${2 * GU}px;
        `}
      >
        This action will irreversibly delete the selected labels you have added
        to your organization on this device.
      </p>
      <ModalControls>
        <Button label="Cancel" onClick={onClose}>
          Cancel
        </Button>
        <RemoveButton
          label="Remove labels"
          mode="strong"
          onClick={handleConfirm}
        >
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
  margin-top: ${3 * GU}px;
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
      margin-left: ${1.5 * GU}px;
    `
  )}
`

export default React.memo(RemoveModal)
