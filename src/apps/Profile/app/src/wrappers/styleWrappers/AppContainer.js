import React from 'react'
import PropTypes from 'prop-types'
import { AppView, AppBar } from '@aragon/ui'
import logoBackground from '../../assets/logo-background.svg'

const style = {
  backgroundColor: '#F7FBFD',
  backgroundImage: `url(${logoBackground})`,
  backgroundPosition: '50% 50%',
  backgroundRepeat: 'no-repeat',
}

const AppContainer = ({ children }) => {
  return (
    <AppView appBar={<AppBar title="Profile" />} padding={0} style={style}>
      {children}
    </AppView>
  )
}

AppContainer.propTypes = {
  children: PropTypes.node.isRequired,
}

export default AppContainer
