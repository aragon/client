import React from 'react'
import styled from 'styled-components'
import { spring, Motion } from 'react-motion'
import { spring as springConf, theme } from '@aragon/ui'
import { lerp } from '../../math-utils'

const SPRING = springConf('fast')

class MenuPanelAppsLoader extends React.Component {
  state = {
    hideLoader: false,
  }
  componentWillReceiveProps({ loading }) {
    if (loading && !this.props.loading) {
      this.setState({ hideLoader: false })
    }
  }
  handleRest = () => {
    if (!this.props.loading) {
      // To trigger the Motion transition
      setTimeout(() => {
        this.setState({ hideLoader: true })
      }, 0)
    }
  }
  render() {
    const { children, loading } = this.props
    const { hideLoader } = this.state
    return (
      <Motion
        onRest={this.handleRest}
        defaultStyle={{ prepareProgress: 0, hideProgress: 0 }}
        style={{
          prepareProgress: spring(Number(!loading), SPRING),
          hideProgress: spring(Number(hideLoader), SPRING),
        }}
      >
        {({ prepareProgress, hideProgress }) => (
          <Main>
            <Loader>
              <LoaderBackground style={{ opacity: prepareProgress }} />
              <LoaderContent>
                <LoadCircle spin={loading}>
                  <LoadCircleIn spin={loading} />
                </LoadCircle>
                {loading ? 'Loading apps…' : 'Apps loaded.'}
              </LoaderContent>
            </Loader>
            <Apps
              style={{
                height: `${lerp(prepareProgress, 40, children.length * 40)}px`,
                transform: `translateX(-${(1 - hideProgress) * 100}%)`,
              }}
            >
              {children}
            </Apps>
          </Main>
        )}
      </Motion>
    )
  }
}

const LoadCircle = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  margin-right: 15px;
  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
  animation: ${({ spin }) => (spin ? 'spin 1s infinite linear' : 'none')};
`

const LoadCircleIn = styled.div`
  position: relative;
  overflow: ${({ spin }) => (spin ? 'hidden' : 'visible')};
  width: 10px;
  height: 100%;
  &:before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 14px;
    height: 14px;
    border-radius: 50%;
    border: 1px solid ${theme.accent};
  }
`

const Main = styled.div`
  position: relative;
  overflow: hidden;
`

const Apps = styled.div`
  position: relative;
  z-index: 2;
  background: white;
`

const Loader = styled.div`
  position: absolute;
  z-index: 1;
  top: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  width: 100%;
  padding-left: 30px;
  overflow: hidden;
  background: white;
`

const LoaderBackground = styled.div`
  position: absolute;
  z-index: 1;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: #f5f9fa;
`

const LoaderContent = styled.div`
  position: relative;
  z-index: 2;
  display: flex;
  align-items: center;
`

export default MenuPanelAppsLoader
