import React, { useCallback } from 'react'
import PropTypes from 'prop-types'
import { Button, GU, Modal, textStyle, useToast, useViewport } from '@aragon/ui'

function RemoveModal({ visible, onClose, onConfirm }) {
  const toast = useToast()
  const { above } = useViewport()
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
      <div
        css={`
          margin-top: ${3 * GU}px;
          display: grid;
          grid-gap: ${1.5 * GU}px;
          grid-template-columns: 1fr 1fr;
          ${above('medium') &&
            `
              display: flex;
              justify-content: flex-end;
            `}
        `}
      >
        <Button label="Cancel" onClick={onClose}>
          Cancel
        </Button>
        <Button
          label="Remove labels"
          mode="strong"
          onClick={handleConfirm}
          css={`
            ${above('medium') &&
              `
                margin-left: ${1.5 * GU}px;
              `}
          `}
        >
          Remove
        </Button>
      </div>
    </Modal>
  )
}

RemoveModal.propTypes = {
  visible: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
}

export default React.memo(RemoveModal)
