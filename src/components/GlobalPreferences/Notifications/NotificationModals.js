import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Button, breakpoint, GU, Modal, textStyle } from '@aragon/ui'

export function DeleteAccountConfirmationModal({
  onConfirm,
  onClose,
  visible,
}) {
  return (
    <Modal css="z-index: 2;" visible={visible} onClose={onClose}>
      <h2
        css={`
          ${textStyle('title2')}
        `}
      >
        Delete your account
      </h2>
      <p
        css={`
          margin-top: ${2 * GU}px;
        `}
      >
        This action will unsubscribe you from all email notifications from all
        organization' events.
      </p>

      <ModalControls>
        <Button label="Cancel" onClick={onClose}>
          Cancel
        </Button>
        <RemoveButton label="Unsubscribe" mode="negative" onClick={onConfirm}>
          Unsubscribe
        </RemoveButton>
      </ModalControls>
    </Modal>
  )
}

DeleteAccountConfirmationModal.propTypes = {
  onConfirm: PropTypes.func,
  onClose: PropTypes.func,
  visible: PropTypes.bool,
}

export const ModalControls = styled.div`
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

export const RemoveButton = styled(Button)`
  ${breakpoint(
    'medium',
    `
      margin-left: ${1.5 * GU}px;
    `
  )}
`
