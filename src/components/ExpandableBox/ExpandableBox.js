import React from 'react'
import { spring, Motion } from 'react-motion'
import {
  styled,
  theme,
  spring as springConf,
  unselectable,
  Text,
} from '@aragon/ui'
import arrow from './assets/arrow.svg'

class ExpandableBox extends React.Component {
  state = {
    selfExpanded: false,
    drawerHeight: 0,
  }
  componentDidMount() {
    this.setState({ drawerHeight: this.getDrawerHeight() })
  }
  getDrawerHeight() {
    const rect = this.drawerElt.getBoundingClientRect()
    return rect.height
  }
  toggle = () => {
    // Update the drawer height
    this.setState({ drawerHeight: this.getDrawerHeight() })

    // Externally controlled
    const { onRequestToggle } = this.props
    if (onRequestToggle) {
      onRequestToggle()
      return
    }

    // Self controlled
    this.setState({ selfExpanded: !this.state.selfExpanded })
  }
  render() {
    const { title, summary, topFooter, expanded, children } = this.props
    const { selfExpanded, drawerHeight } = this.state
    const expandedFinal = expanded === undefined ? selfExpanded : expanded
    return (
      <Motion
        style={{
          openProgress: spring(Number(expandedFinal), springConf('fast')),
        }}
      >
        {({ openProgress }) => (
          <Main expanded={expandedFinal}>
            <Arrow
              alt=""
              src={arrow}
              style={{
                transform: `rotate(${180 * (1 - openProgress)}deg)`,
              }}
            />
            <Top
              opened={openProgress > 0.1}
              onClick={this.toggle}
              style={{
                boxShadow: `
                  0 7px 10px 0 rgba(101, 148, 170, ${0.08 * openProgress})
                `,
              }}
            >
              <h1>
                <Text weight="bold" size="large">
                  {title}
                </Text>
              </h1>
              <p>{summary}</p>
              {topFooter && <div>{topFooter}</div>}
            </Top>
            <DrawerWrapper
              style={
                {
                  // height: `${drawerHeight * openProgress}px`,
                }
              }
            >
              <Drawer
                innerRef={elt => (this.drawerElt = elt)}
                style={{
                  marginTop: `${-drawerHeight * (1 - openProgress)}px`,
                }}
              >
                <DrawerContent>{children}</DrawerContent>
              </Drawer>
            </DrawerWrapper>
          </Main>
        )}
      </Motion>
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

const Arrow = styled.img`
  position: absolute;
  top: 30px;
  right: 20px;
`

const Top = styled.div`
  position: relative;
  z-index: 1;
  cursor: pointer;
  padding: 20px 20px 20px 20px;
  border-bottom: 1px solid
    ${({ opened }) => (opened ? theme.contentBorder : theme.contentBackground)};
`

const DrawerWrapper = styled.div`
  overflow: hidden;
  position: relative;
`

const Drawer = styled.div`
  overflow: hidden;
  position: relative;
  padding: 30px 20px;
  background: #edf3f6;
`

const DrawerContent = styled.div``

export default ExpandableBox
