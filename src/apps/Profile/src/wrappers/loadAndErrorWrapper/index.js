import React, { Fragment, useContext } from 'react'
import PropTypes from 'prop-types'

import { BoxContext } from '../box'
import Initializing from './Initializing'
import LoadingPublicProfile from './LoadingPublicProfile'
import ErrorState from './Error'
import UnlockingBox from './UnlockingBox'

const LoadAndErrorWrapper = props => {
  const syncing = false

  const { boxes } = useContext(BoxContext)

  const usersBox = boxes[props.ethereumAddress]

  const loadingPublicProf = usersBox && usersBox.loadingPublicProf
  const unlockingProf = usersBox && usersBox.unlockingProf

  return (
    <LoadAndErrorView
      {...props}
      isInitializing={syncing}
      isLoadingPublicProfile={loadingPublicProf}
      isUnlockingProfile={unlockingProf}
    />
  )
}

LoadAndErrorWrapper.propTypes = {
  ethereumAddress: PropTypes.string.isRequired,
}

const LoadAndErrorView = ({
  children,
  isInitializing,
  isLoadingPublicProfile,
  isUnlockingProfile,
  error,
}) => {
  if (Object.keys(error).length > 0) return <ErrorState />
  if (isInitializing) return <Initializing />
  if (isLoadingPublicProfile) return <LoadingPublicProfile />
  if (isUnlockingProfile) return <UnlockingBox />
  return <Fragment>{children}</Fragment>
}

LoadAndErrorView.propTypes = {
  children: PropTypes.node.isRequired,
  isInitializing: PropTypes.bool,
  isLoadingPublicProfile: PropTypes.bool,
  isUnlockingProfile: PropTypes.bool,
  error: PropTypes.object,
}

LoadAndErrorWrapper.defaultProps = {
  error: {},
  isInitializing: true,
  isLoadingPublicProfile: false,
  isUnlockingProfile: false,
}

LoadAndErrorWrapper.propTypes = {
  children: PropTypes.node.isRequired,
  isInitializing: PropTypes.bool,
  isLoadingPublicProfile: PropTypes.bool,
  isUnlockingProfile: PropTypes.bool,
  error: PropTypes.object,
}

LoadAndErrorWrapper.defaultProps = {
  error: {},
  isInitializing: true,
  isLoadingPublicProfile: false,
  isUnlockingProfile: false,
}

export default LoadAndErrorWrapper
