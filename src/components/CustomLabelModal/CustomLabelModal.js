import React from 'react'
import PropTypes from 'prop-types'
import { IdentityBadge } from '@aragon/ui'
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
  const action = label !== null ? 'Edit' : 'Add'
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
    <div css={'background: white;'}>
      <h3>{action} custom label</h3>
      <div>
        This label would be displayed instead of the following address and only
        be <span>stored on this device</span>.
      </div>
      <div>{address}</div>
      <IdentityBadge address={address} />
      <div>Custom Label</div>
      <input type="text" defaultValue={label} ref={labelInput} />
      <button onClick={handleCancel}>Cancel</button>
      <button onClick={handleSave}>Save</button>
    </div>
  )
}

Modal.propTypes = {
  address: PropTypes.string,
  label: PropTypes.string,
  onCancel: PropTypes.func,
  onSave: PropTypes.func,
  hideModal: PropTypes.func,
}

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
