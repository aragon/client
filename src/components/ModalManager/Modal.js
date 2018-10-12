import React from 'react'
import styled from 'styled-components'
import EscapeOutside from '../EscapeOutside/EscapeOutside'
import { Button, Text, breakpoint } from '@aragon/ui'
import { noop } from '../../utils'

const Modal = ({ title, body, moreText, onHide, More, blocking }) => (
  <Main>
    <WrapModal role="alertdialog" onEscapeOutside={blocking ? noop : onHide}>
      <Header>
        <Text size="xxlarge">{title}</Text>
      </Header>
      <Body>{body}</Body>
      <Footer>
        <Button mode="text" onClick={onHide}>
          Close
        </Button>
        {More}
      </Footer>
    </WrapModal>
  </Main>
)

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

  /* desktop */
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
