import React from 'react'
import styled from 'styled-components'
import { Transition, animated } from 'react-spring'
import { breakpoint } from '@aragon/ui'

const ModalContext = React.createContext({
  modalComponent: null,
  modalComponentProps: {},
  showModal: null,
  hideModal: null,
})

class ModalProvider extends React.Component {
  state = { modalComponent: null, modalComponentProps: {} }

  showModal = (modalComponent, modalComponentProps = {}) => {
    this.setState({ modalComponent, modalComponentProps })
  }

  hideModal = () => {
    this.setState({ modalComponent: null, modalComponentProps: {} })
  }

  render() {
    return (
      <ModalContext.Provider
        value={{
          ...this.state,
          showModal: this.showModal,
          hideModal: this.hideModal,
        }}
      >
        {this.props.children}
        <ModalView />
      </ModalContext.Provider>
    )
  }
}

const ModalConsumer = ModalContext.Consumer

const ModalView = () => (
  <ModalConsumer>
    {({ modalComponent: ModalComponent, modalComponentProps, hideModal }) => (
      <Transition
        blocking={!!ModalComponent}
        native
        from={{ opacity: 0, top: 50 }}
        enter={{ opacity: 1, top: 0 }}
        leave={{ opacity: 0, top: 0 }}
      >
        {ModalComponent &&
          (({ opacity, top, blocking }) => (
            <Wrap
              style={{
                opacity,
                pointerEvents: blocking ? 'auto' : 'none',
              }}
            >
              <AnimatedWrap
                style={{
                  transform: top.interpolate(v => `translate3d(0, ${v}px, 0)`),
                }}
              >
                <ModalComponent onHide={hideModal} {...modalComponentProps} />
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
  ${breakpoint('medium', `height: unset;`)};
`

export { ModalProvider, ModalConsumer, ModalView }
