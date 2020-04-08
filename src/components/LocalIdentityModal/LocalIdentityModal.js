import React, { useCallback, useEffect } from 'react'
import PropTypes from 'prop-types'
import {
  Button,
  EscapeOutside,
  GU,
  Modal,
  TextInput,
  textStyle,
  useTheme,
  useViewport,
} from '@aragon/ui'
import IdentityBadgeWithNetwork from '../IdentityBadge/IdentityBadgeWithNetwork'
import keycodes from '../../keycodes'
import { EthereumAddressType } from '../../prop-types'

const LocalIdentityModal = React.memo(
  ({ opened, address, label, onCancel, onSave }) => {
    return (
      <Modal visible={opened} onClose={onCancel}>
        <LocalModal
          address={address}
          label={label}
          onCancel={onCancel}
          onSave={onSave}
        />
      </Modal>
    )
  }
)

LocalIdentityModal.propTypes = {
  opened: PropTypes.bool.isRequired,
  address: EthereumAddressType,
  label: PropTypes.string,
  onCancel: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
}

function LocalModal({ address, label, onCancel, onSave }) {
  const theme = useTheme()
  const { above } = useViewport()
  const [action, setAction] = React.useState(null)
  const [error, setError] = React.useState(null)
  const labelInput = React.useRef(null)

  const handleCancel = useCallback(() => {
    onCancel()
  }, [onCancel])

  const handleSave = useCallback(() => {
    try {
      const label = labelInput.current.value.trim()
      if (label) {
        onSave({ address, label })
      }
    } catch (e) {
      setError(e)
    }
  }, [address, labelInput, onSave])

  const handleKeyDown = useCallback(
    e => {
      if (e.keyCode === keycodes.enter) {
        handleSave()
      } else if (e.keyCode === keycodes.esc) {
        handleCancel()
      }
    },
    [handleCancel, handleSave]
  )

  useEffect(() => {
    setAction(label && label.trim() ? 'Edit' : 'Add')
    labelInput.current.focus()
    labelInput.current.select()
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [label, labelInput, handleKeyDown])

  return (
    <EscapeOutside onEscapeOutside={onCancel}>
      <div
        css={`
          background: ${theme.surface};
          max-width: calc(100vw - 32px);

          ${above('medium') &&
            `
              /* wide identity badge + paddings */
              min-width: ${54 * GU}px;
            `};
        `}
      >
        <h3
          css={`
            ${textStyle('title4')};
          `}
        >
          {action} custom label
        </h3>
        <p
          css={`
            margin: ${5 * GU}px 0;
            & span {
              font-weight: bold;
            }
          `}
        >
          This label would be displayed instead of the following address and
          only be <span>stored on this device</span>.
        </p>
        <IdentityBadgeWithNetwork entity={address} />
        <Label>
          <div>Custom Label</div>
          <TextInput
            wide
            defaultValue={label}
            ref={labelInput}
            maxLength="42"
          />
          <div
            css={`
              color: ${theme.negative};
              text-transform: initial;
            `}
          >
            {error}
          </div>
        </Label>
        <div
          css={`
            display: grid;
            grid-gap: ${1 * GU}px;
            grid-template-columns: 1fr 1fr;
            ${above('medium') &&
              `
                display: flex;
                justify-content: flex-end;
              `};
          `}
        >
          <Button
            onClick={handleCancel}
            css={`
              min-width: ${8 * GU}px;
            `}
          >
            Cancel
          </Button>
          <Button
            mode="strong"
            onClick={handleSave}
            css={`
              min-width: ${8 * GU}px;
              ${above('medium') &&
                `
                  margin-left: ${2 * GU}px;
                `}
            `}
          >
            Save
          </Button>
        </div>
      </div>
    </EscapeOutside>
  )
}

LocalModal.propTypes = {
  address: EthereumAddressType,
  label: PropTypes.string,
  onCancel: PropTypes.func,
  onSave: PropTypes.func,
}

function Label(props) {
  const theme = useTheme()
  return (
    <label
      css={`
        display: block;
        margin: 20px 0;
        color: ${theme.surfaceContentSecondary};
        ${textStyle('label2')};
        & > div {
          margin: 5px 0;
        }
      `}
      {...props}
    />
  )
}

export default LocalIdentityModal
