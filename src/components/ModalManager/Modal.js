import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import EscapeOutside from '../EscapeOutside/EscapeOutside'
import { Button, breakpoint, font } from '@aragon/ui'
import { noop } from '../../utils'

const Modal = ({ title, body, onHide, More, blocking }) => (
  <Main>
    <WrapModal role="alertdialog" onEscapeOutside={blocking ? noop : onHide}>
      <Header>{title}</Header>
      <Body>{body}</Body>
      <Footer>
        <Button mode="text" onClick={onHide} style={{ paddingLeft: '0' }}>
          Close
        </Button>
        {More}
      </Footer>
    </WrapModal>
  </Main>
)

Modal.propTypes = {
  title: PropTypes.node.isRequired,
  body: PropTypes.node.isRequired,
  onHide: PropTypes.func.isRequired,
  More: PropTypes.node,
  blocking: PropTypes.bool,
}

const Main = styled.div`
  display: grid;
  grid-template-rows: auto 1fr auto;
  padding: 20px;
`

const WrapModal = styled(EscapeOutside)`
  max-width: 800px;
  padding: 40px 40px 20px;
  box-shadow: 0 10px 28px rgba(0, 0, 0, 0.2);
  border-radius: 4px;
  background: #fff;

  ${breakpoint(
    'medium',
    `
      height: unset;
      min-height: 400px;
      padding: 50px;
      margin: auto;
    `
  )};
`

const Header = styled.header`
  margin-bottom: 20px;
  ${font({ size: 'xlarge' })};
  ${breakpoint('medium', font({ size: 'xxlarge' }))};
`

const Body = styled.main`
  margin-bottom: 30px;
  word-break: break-word;
`

const Footer = styled.footer`
  display: flex;
  align-items: center;
  justify-content: space-between;
`

export default Modal
