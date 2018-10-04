import React from 'react'
import styled from 'styled-components'
import EscapeOutside from '../EscapeOutside/EscapeOutside'
import { Button, Text, breakpoint } from '@aragon/ui'

const Modal = ({ title, body, moreText, onHide, More, blocking }) => (
  <WrapModal role="alertdialog" onEscapeOutside={!blocking && onHide}>
    <Header>
      <Text size="xxlarge">{title}</Text>
    </Header>
    <Main>{body}</Main>
    <Footer>
      <Button mode="text" onClick={onHide}>
        Close
      </Button>
      {More}
    </Footer>
  </WrapModal>
)

const WrapModal = styled(EscapeOutside)`
  height: calc(100vh - 2em);
  display: grid;
  grid-template-rows: auto 1fr auto;
  background: #fff;
  padding: 2.5em 2.5em 1.5em 2.5em;
  margin: 1em;
  box-shadow: -2px 0px 20px rgba(0, 0, 0, 0.236894);
  border-radius: 4px;

  /* desktop */
  ${breakpoint(
    'medium',
    `
    height: unset;
    min-height: 40vh;
    max-height: 70vh;
    max-width: 90%;
    padding: 3.5em;
    margin: auto;
  `
  )} ${breakpoint(
    'large',
    `
    max-width: 70%;
  `
  )};
`

const Header = styled.header`
  margin-bottom: 1.5em;
`

const Main = styled.main`
  margin-bottom: 30px;
  word-break: break-word;
  overflow: auto;
`

const Footer = styled.footer`
  display: flex;
  align-items: center;
  justify-content: space-between;
`

export default Modal
