import React from 'react'
import BrowseByApp from './BrowseByApp'
import BrowseByEntity from './BrowseByEntity'

class Home extends React.Component {
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
        <BrowseByApp
          apps={apps.filter(app => app.hasWebApp)}
          loading={appsLoading}
          onOpenApp={onOpenApp}
        />
        <BrowseByEntity
          loading={appsLoading || permissionsLoading}
          onOpenEntity={onOpenEntity}
        />
      </React.Fragment>
    )
  }
}

export default Home
