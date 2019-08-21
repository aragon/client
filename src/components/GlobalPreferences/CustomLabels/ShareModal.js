import React, { useEffect, useRef, useCallback } from 'react'
import PropTypes from 'prop-types'
import {
  Button,
  ButtonIcon,
  GU,
  IconCopy,
  Modal,
  TextInput,
  Toast,
  breakpoint,
  textStyle,
  useTheme,
} from '@aragon/ui'

const TIMEOUT_TOAST = 4000

function ShareModal({ inputRef, onClose, onCopy, onFocus, link, visible }) {
  const theme = useTheme()

  return (
    <Modal visible={visible} onClose={onClose} css="z-index: 2;">
      <h1
        css={`
          ${textStyle('title2')}
        `}
      >
        Share custom labels
      </h1>
      <main
        css={`
          margin-top: ${2 * GU}px;
        `}
      >
        <div
          css={`
            ${textStyle('body2')}
            margin-bottom: ${2.5 * GU}px;
          `}
        >
          These labels will be shared with everyone that has access to this
          link.
        </div>
        <div>
          <div
            css={`
              font-size: 12px;
              line-height: 16px;
              text-transform: uppercase;
              margin-bottom: ${1 * GU}px;
            `}
          >
            Link
          </div>
          <TextInput
            ref={inputRef}
            value={link}
            onFocus={onFocus}
            adornment={
              <ButtonIcon
                onClick={onCopy}
                label="Copy to clipboard"
                css={`
                  width: 38px;
                  height: 38px;
                  &:active {
                    background: ${theme.surfacePressed};
                  }
                `}
              >
                <IconCopy
                  css={`
                    color: ${theme.surfaceIcon};
                  `}
                />
              </ButtonIcon>
            }
            adornmentPosition="end"
            adornmentSettings={{
              width: 64,
              padding: 1,
            }}
            readOnly
            wide
            css={`
              text-overflow: ellipsis;
            `}
          />
        </div>
      </main>
      <div
        css={`
          margin-top: ${3 * GU}px;
          display: flex;
          justify-content: space-between;
          text-align: right;

          ${breakpoint(
            'medium',
            `
              display: block;
            `
          )}
        `}
      >
        <Button label="Close modal" onClick={onClose}>
          Close
        </Button>
        <Button
          mode="strong"
          label="Copy link to clipboard"
          onClick={onCopy}
          css={`
            margin-left: ${2 * GU}px;
          `}
        >
          Copy link
        </Button>
      </div>
    </Modal>
  )
}

ShareModal.propTypes = {
  inputRef: PropTypes.object,
  onClose: PropTypes.func.isRequired,
  onCopy: PropTypes.func.isRequired,
  onFocus: PropTypes.func.isRequired,
  link: PropTypes.string.isRequired,
  visible: PropTypes.bool.isRequired,
}

function ShareModalWithToast({ visible, onClose, link }) {
  const { inputRef, handleCopy, handleFocus } = useShareModal({
    visible,
    onClose,
  })

  return (
    <Toast timeout={TIMEOUT_TOAST}>
      {toast => (
        <ShareModal
          inputRef={inputRef}
          link={link}
          onClose={onClose}
          onCopy={handleCopy}
          onFocus={handleFocus}
          toast={toast}
          visible={visible}
        />
      )}
    </Toast>
  )
}

function useShareModal({ visible, toast, onClose }) {
  const inputRef = useRef()
  const handleFocus = useCallback(() => {
    inputRef.current.select()
  }, [inputRef])
  const handleCopy = useCallback(() => {
    inputRef.current.focus()
    inputRef.current.select()
    try {
      document.execCommand('copy')
      toast('Custom labels link copied.')
      setTimeout(onClose, (TIMEOUT_TOAST * 7) / 8)
    } catch (err) {
      console.warn(err)
    }
  }, [toast, inputRef, onClose])

  useEffect(() => {
    if (visible) {
      setTimeout(() => inputRef.current.focus(), 0)
    }
  }, [visible])

  return { inputRef, handleCopy, handleFocus }
}

ShareModalWithToast.propTypes = {
  visible: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
  link: PropTypes.string.isRequired,
}

export default React.memo(ShareModalWithToast)
