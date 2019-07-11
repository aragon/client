import React, { useEffect, useRef, useCallback } from 'react'
import PropTypes from 'prop-types'
import {
  Button,
  ButtonIcon,
  GU,
  IconCopy,
  Modal,
  RADIUS,
  TextInput,
  Toast,
  breakpoint,
  useTheme,
} from '@aragon/ui'

const TIMEOUT_TOAST = 4000

function ShareModal({ inputRef, onClose, onCopy, onFocus, link, visible }) {
  const theme = useTheme()

  return (
    <Modal visible={visible} onClose={onClose}>
      <header
        css={`
          font-size: 22px;
          line-height: 38px;
          font-weight: bold;
        `}
      >
        Share custom labels
      </header>
      <main style={{ marginTop: `${2 * GU}px` }}>
        <div
          css={`
            font-size: 15px;
            line-height: 22px;
          `}
        >
          These labels will be shared with everyone that has access to this
          link.
        </div>
        <div style={{ marginTop: `${2.5 * GU}px` }}>
          <div
            css={`
              font-size: 12px;
              line-height: 16px;
              text-transform: uppercase;
            `}
          >
            Link
          </div>
          <div
            css={`
              display: inline-flex;
              max-width: 100%;
              width: 100%;
              position: relative;
              background: ${theme.surface};
              border: 1px solid ${theme.border};
              border-radius: ${RADIUS}px;
              box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.06);
              padding-right: 30px;
              margin-top: ${1 * GU}px;
            `}
          >
            <TextInput
              ref={inputRef}
              value={link}
              onFocus={onFocus}
              readOnly
              css={`
                text-overflow: ellipsis;
                width: 100%;
                max-width: 100%;
                border: 0;
                box-shadow: none;
                background: ${theme.surface};
                &:read-only {
                  color: ${theme.content};
                  text-shadow: none;
                }
              `}
            />
            <ButtonIcon
              onClick={onCopy}
              label="Copy to clipboard"
              css={`
                position: absolute;
                top: 0;
                right: 0;
                width: 40px;
                height: 40px;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 0 ${RADIUS}px ${RADIUS}px 0;
                &:active {
                  background: ${theme.surfacePressed};
                }
              `}
            >
              <IconCopy />
            </ButtonIcon>
          </div>
        </div>
      </main>
      <footer
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
        <Button label="Close modal" mode="secondary" onClick={onClose}>
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
      </footer>
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

function ShareModalWithToast({ toast, visible, onClose, link }) {
  const inputRef = useRef()
  const handleFocus = useCallback(() => {
    inputRef.current.select()
  }, [inputRef])
  const handleCopy = useCallback(() => {
    inputRef.current.focus()
    inputRef.current.select()
    try {
      document.execCommand('copy')
      toast('Link copied')
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

  return (
    <ShareModal
      inputRef={inputRef}
      link={link}
      onClose={onClose}
      onCopy={handleCopy}
      onFocus={handleFocus}
      visible={visible}
    />
  )
}

ShareModalWithToast.propTypes = {
  toast: PropTypes.func.isRequired,
  visible: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
  link: PropTypes.string.isRequired,
}

const ShareModalWithToastMemo = React.memo(ShareModalWithToast)

export default React.memo(props => (
  <Toast timeout={TIMEOUT_TOAST}>
    {toast => <ShareModalWithToastMemo {...props} toast={toast} />}
  </Toast>
))
