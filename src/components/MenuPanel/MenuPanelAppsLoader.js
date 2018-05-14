import React from 'react'
import styled from 'styled-components'
import { spring, Motion } from 'react-motion'
import { spring as springConf } from '@aragon/ui'
import { lerp } from '../../math-utils'
import LoadingRing from '../LoadingRing'

const SPRING = springConf('fast')

class MenuPanelAppsLoader extends React.Component {
  state = { hideLoader: false, loadingTransitionDone: false }

  componentWillReceiveProps({ loading }) {
    if (loading && !this.props.loading) {
      this.setState({ hideLoader: false, loadingTransitionDone: false })
    }
  }

  handleRest = () => {
    const { loading } = this.props

    if (loading) {
      return
    }

    if (!this.state.hideLoader) {
      // To trigger the Motion transition
      setTimeout(() => {
        this.setState({ hideLoader: true })
      }, 0)
    } else {
      this.setState({ loadingTransitionDone: true })
    }
  }
  render() {
    const { children, itemsCount, loading } = this.props
    const { hideLoader, loadingTransitionDone } = this.state
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
                <LoadingRingWrapper>
                  <LoadingRing spin={loading} />
                </LoadingRingWrapper>
                {loading ? 'Loading apps…' : 'Apps loaded.'}
              </LoaderContent>
            </Loader>
            <Apps
              style={{
                height: loadingTransitionDone
                  ? 'auto'
                  : `${lerp(prepareProgress, 40, itemsCount * 40)}px`,
                transform: `translateX(-${(1 - hideProgress) * 100}%)`,
              }}
            >
              {children(loadingTransitionDone)}
            </Apps>
          </Main>
        )}
      </Motion>
    )
  }
}

const LoadingRingWrapper = styled.div`
  margin-right: 15px;
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
