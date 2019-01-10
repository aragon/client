import React from 'react'
import PropTypes from 'prop-types'
import { BreakPoint } from '@aragon/ui'

const SMALL = Symbol('small')
const MEDIUM = Symbol('medium')
const LARGE = Symbol('large')

const { Provider, Consumer } = React.createContext()

const ScreenSizeProvider = ({ children }) => (
  <React.Fragment>
    <BreakPoint to="medium">
      <Provider value={{ screenSize: SMALL }}>{children}</Provider>
    </BreakPoint>
    <BreakPoint from="medium" to="large">
      <Provider value={{ screenSize: MEDIUM }}>{children}</Provider>
    </BreakPoint>
    <BreakPoint from="large">
      <Provider value={{ screenSize: LARGE }}>{children}</Provider>
    </BreakPoint>
  </React.Fragment>
)

ScreenSizeProvider.propTypes = {
  children: PropTypes.oneOfType([PropTypes.func, PropTypes.array]).isRequired,
}

export { SMALL, MEDIUM, LARGE }
export { ScreenSizeProvider, Consumer as ScreenSizeConsumer }
