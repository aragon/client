import React from 'react'
import { Spring, animated } from 'react-spring'
import styled from 'styled-components'
import throttle from 'lodash.throttle'
import { theme, springs, unselectable, Text } from '@aragon/ui'

import arrow from './assets/arrow.svg'

class ExpandableBox extends React.Component {
  state = {
    selfExpanded: false,
    drawerHeight: 0,
  }
  componentDidMount() {
    this.updateDrawerHeight()
    window.addEventListener('resize', this.updateDrawerHeight)
  }
  componentWillUnmount() {
    window.removeEventListener('resize', this.updateDrawerHeight)
  }

  // Update the drawer height in the state
  updateDrawerHeight = throttle(() => {
    const rect = this.drawerElt.getBoundingClientRect()
    this.setState({ drawerHeight: rect.height })
  }, 150)

  toggle = () => {
    // Externally controlled toggle
    if (this.props.onRequestToggle) {
      this.props.onRequestToggle()
      return
    }

    // Self controlled toggle
    this.setState({ selfExpanded: !this.state.selfExpanded })
  }

  render() {
    const { title, summary, summaryFooter, expanded, children } = this.props
    const { selfExpanded, drawerHeight } = this.state
    const expandedFinal = expanded === undefined ? selfExpanded : expanded
    return (
      <Spring
        config={springs.fast}
        to={{ openProgress: Number(expandedFinal) }}
        native
      >
        {({ openProgress }) => (
          <Main expanded={expandedFinal}>
            <Arrow
              alt=""
              src={arrow}
              style={{
                transform: openProgress.interpolate(
                  v => `rotate(${180 * (1 - v)}deg)`
                ),
              }}
            />
            <Summary
              opened={openProgress.interpolate(v => v > 0.1)}
              style={{
                boxShadow: openProgress.interpolate(
                  v => `0 7px 10px 0 rgba(101, 148, 170, ${0.08 * v})`
                ),
              }}
            >
              <SummaryTopArea onClick={this.toggle}>
                <h1>
                  <Text weight="bold" size="large">
                    {title}
                  </Text>
                </h1>
                <p>{summary}</p>
              </SummaryTopArea>
              {summaryFooter && <SummaryFooter>{summaryFooter}</SummaryFooter>}
            </Summary>
            <DrawerWrapper>
              <Drawer
                innerRef={elt => (this.drawerElt = elt)}
                style={{
                  marginTop: openProgress.interpolate(
                    v => `${-drawerHeight * (1 - v)}px`
                  ),
                }}
              >
                <DrawerContent>{children}</DrawerContent>
              </Drawer>
            </DrawerWrapper>
          </Main>
        )}
      </Spring>
    )
  }
}

const Main = styled.section`
  position: relative;
  border: 1px solid ${theme.contentBorder};
  border-radius: 3px;
  background: ${theme.contentBackground};
  ${unselectable};
`

const Arrow = styled(animated.img)`
  position: absolute;
  top: 30px;
  right: 20px;
`

const Summary = styled(animated.div)`
  position: relative;
  z-index: 1;
  border-bottom: 1px solid
    ${({ opened }) => (opened ? theme.contentBorder : theme.contentBackground)};
`

const SummaryTopArea = styled.div`
  position: relative;
  z-index: 1;
  cursor: pointer;
  padding: 20px;
  border-bottom: 1px solid
    ${({ opened }) => (opened ? theme.contentBorder : theme.contentBackground)};

  h1 {
    margin-bottom: 10px;
  }
`

const SummaryFooter = styled.div`
  padding: 0 20px 20px;
`

const DrawerWrapper = styled.div`
  overflow: hidden;
  position: relative;
`

const Drawer = styled(animated.div)`
  overflow: hidden;
  position: relative;
  padding: 30px 20px;
  background: #edf3f6;
`

const DrawerContent = styled.div``

export default ExpandableBox
