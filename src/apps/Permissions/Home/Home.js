import React from 'react'
import PropTypes from 'prop-types'
import BrowseByApp from './BrowseByApp'
import BrowseByEntity from './BrowseByEntity'

class Home extends React.Component {
  static propTypes = {
    apps: PropTypes.array.isRequired,
    appsLoading: PropTypes.bool.isRequired,
    permissionsLoading: PropTypes.bool.isRequired,
    onOpenApp: PropTypes.func.isRequired,
    onOpenEntity: PropTypes.func.isRequired,
  }

  render() {
    const {
      apps,
      appsLoading,
      permissionsLoading,
      onOpenApp,
      onOpenEntity,
    } = this.props

    return (
      <React.Fragment>
        <BrowseByApp apps={apps} loading={appsLoading} onOpenApp={onOpenApp} />
        <BrowseByEntity
          loading={appsLoading || permissionsLoading}
          onOpenEntity={onOpenEntity}
        />
      </React.Fragment>
    )
  }
}

export default Home
