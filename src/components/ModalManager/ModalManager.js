import React, { Component, createContext } from 'react'
import styled from 'styled-components'
import { Transition } from 'react-spring'
import { breakpoint } from '@aragon/ui'

const Wrap = styled.div`
  position: absolute;
  z-index: 11;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(59, 59, 59, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
`

const ModalContext = createContext({
  component: null,
  props: {},
  showModal: () => {},
  hideModal: () => {},
})

class ModalProvider extends Component {
  showModal = (component, props = {}) => {
    this.setState({ component, props })
  }

  hideModal = () => {
    this.setState({ component: null, props: {} })
  }

  state = {
    component: null,
    props: {},
    showModal: this.showModal,
    hideModal: this.hideModal,
  }

  render() {
    return (
      <ModalContext.Provider value={this.state}>
        {this.props.children}
      </ModalContext.Provider>
    )
  }
}

const ModalConsumer = ModalContext.Consumer

const AnimatedWrap = styled.div`
  position: relative;
  height: 100%;

  /* desktop */
  ${breakpoint(
    'medium',
    `
    height: unset;
  `
  )};
`

const ModalView = () => (
  <ModalConsumer>
    {({ component: Component, props, hideModal }) => (
      <Transition
        from={{ opacity: 0 }}
        enter={{ opacity: 1 }}
        leave={{ opacity: 0 }}
      >
        {Component &&
          (styles => (
            <Wrap style={styles}>
              <Transition from={{ top: 50 }} enter={{ top: 0 }}>
                {styles => (
                  <AnimatedWrap style={styles}>
                    <Component onHide={hideModal} {...props} />
                  </AnimatedWrap>
                )}
              </Transition>
            </Wrap>
          ))}
      </Transition>
    )}
  </ModalConsumer>
)

export { ModalConsumer, ModalProvider, ModalView }
