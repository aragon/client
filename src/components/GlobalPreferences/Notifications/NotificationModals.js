import React from 'react'
import PropTypes from 'prop-types'
import { Button, GU, Modal, textStyle, useViewport } from '@aragon/ui'

export function DeleteAccountConfirmationModal({
  onClose,
  onConfirm,
  ...props
}) {
  const { above } = useViewport()

  return (
    <ConfirmationModal
      {...props}
      onClose={onClose}
      onConfirm={onConfirm}
      header="Delete your account"
      body="This action will unsubscribe you from all email notifications from all
      organization' events."
    >
      <ModalControls large={above('medium')}>
        <Button label="Cancel" onClick={onClose}>
          Cancel
        </Button>
        <RemoveButton
          label="Delete Account"
          large={above('medium')}
          mode="negative"
          onClick={onConfirm}
        >
          Delete Account
        </RemoveButton>
      </ModalControls>
    </ConfirmationModal>
  )
}

DeleteAccountConfirmationModal.propTypes = {
  onConfirm: PropTypes.func,
  onClose: PropTypes.func,
  visible: PropTypes.bool,
}

export function DeleteSubscriptionConfirmationModal({
  onClose,
  onConfirm,
  ...props
}) {
  const { above } = useViewport()

  return (
    <ConfirmationModal
      {...props}
      onClose={onClose}
      onConfirm={onConfirm}
      header="Unsubscribe from email notifications"
      body="This action will unsubscribe you from the selected email notifications
    from the organization’s events."
    >
      <ModalControls large={above('medium')}>
        <Button label="Cancel" onClick={onClose}>
          Cancel
        </Button>
        <RemoveButton
          large={above('medium')}
          label="Unsubscribe"
          mode="strong"
          onClick={onConfirm}
        >
          Unsubscribe
        </RemoveButton>
      </ModalControls>
    </ConfirmationModal>
  )
}

DeleteSubscriptionConfirmationModal.propTypes = {
  onConfirm: PropTypes.func,
  onClose: PropTypes.func,
  visible: PropTypes.bool,
}

function ConfirmationModal({ children, onClose, visible, header, body }) {
  return (
    <Modal css="z-index: 2;" visible={visible} onClose={onClose}>
      <h2
        css={`
          ${textStyle('title2')}
        `}
      >
        {header}
      </h2>
      <p
        css={`
          margin-top: ${2 * GU}px;
        `}
      >
        {body}
      </p>

      {children}
    </Modal>
  )
}

ConfirmationModal.propTypes = {
  body: PropTypes.string,
  children: PropTypes.node,
  header: PropTypes.string,
  onClose: PropTypes.func,
  visible: PropTypes.bool,
}

function ModalControls({ children }) {
  const { above } = useViewport()

  return (
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
      {children}
    </div>
  )
}

ModalControls.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
}

function RemoveButton({ children, label, mode, onClick }) {
  const { above } = useViewport()

  return (
    <Button
      label={label}
      mode={mode}
      onClick={onClick}
      css={`
        ${above('medium') &&
          `
            margin-left:${1.5 * GU}px;
          `}
      `}
    >
      {children}
    </Button>
  )
}

RemoveButton.propTypes = {
  children: PropTypes.node,
  label: PropTypes.string,
  mode: PropTypes.string,
  onClick: PropTypes.func,
}
