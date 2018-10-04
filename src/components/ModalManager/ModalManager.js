import React from 'react'
import styled from 'styled-components'
import { Transition, animated } from 'react-spring'
import { breakpoint } from '@aragon/ui'

const ModalContext = React.createContext({
  component: null,
  props: {},
  showModal: () => {},
  hideModal: () => {},
})

class ModalProvider extends React.Component {
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

const ModalView = () => (
  <ModalConsumer>
    {({ component: Component, props, hideModal }) => (
      <Transition
        native
        from={{ opacity: 0, top: 50 }}
        enter={{ opacity: 1, top: 0 }}
        leave={{ opacity: 0, top: 0 }}
      >
        {Component &&
          (({ opacity, top }) => (
            <Wrap style={{ opacity }}>
              <AnimatedWrap
                style={{
                  transform: top.interpolate(v => `translate3d(0, ${v}px, 0)`),
                }}
              >
                <Component onHide={hideModal} {...props} />
              </AnimatedWrap>
            </Wrap>
          ))}
      </Transition>
    )}
  </ModalConsumer>
)

const Wrap = styled(animated.div)`
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

const AnimatedWrap = styled(animated.div)`
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

export { ModalProvider, ModalConsumer, ModalView }
