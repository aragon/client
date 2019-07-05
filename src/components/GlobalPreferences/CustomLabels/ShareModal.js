import React, { useRef } from 'react'
import {
  Button,
  ButtonIcon,
  GU,
  IconCopy,
  Modal,
  TextInput,
  Toast,
  breakpoint,
  theme,
} from '@aragon/ui'

const TIMEOUT_TOAST = 4000

function ShareModal({ inputRef, onClose, onCopy, onFocus, link, visible }) {
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
              color: ##6d777b;
            `}
          >
            Link
          </div>
          <div
            css={`
              display: inline-flex;
              max-width: 100%;
              width: 100%;
              height: 40px;
              position: relative;
              background: ${theme.contentBackground};
              border: 1px solid ${theme.contentBorder};
              border-radius: 3px;
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
                background: transparent;
                &:read-only {
                  color: ${theme.textPrimary};
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
                width: 39px;
                height: 38px;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 0 3px 3px 0;
                &:active {
                  background: rgba(220, 234, 239, 0.3);
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

          ${breakpoint(
            'medium',
            `
                display: block;
              `
          )}
        `}
      >
        <Button
          label="Close modal"
          mode="secondary"
          onClick={onClose}
          css={'width: 117px;'}
        >
          Close
        </Button>
        <Button
          mode="strong"
          label="Copy link to clipboard"
          onClick={onCopy}
          css={`
            width: 117px;
            margin-left: ${2 * GU}px;
          `}
        >
          Copy
        </Button>
      </footer>
    </Modal>
  )
}

export default ({ visible, onClose, link }) => {
  // handle copy, toast, focus, etc
  const inputRef = useRef()
  const handleFocus = () => {}
  const handleCopy = () => {}

  return (
    <Toast timeout={TIMEOUT_TOAST}>
      {toast => (
        <ShareModal
          inputRef={inputRef}
          link={link}
          onClose={onClose}
          onCopy={handleCopy}
          onFocus={handleFocus}
          visible={visible}
        />
      )}
    </Toast>
  )
}
