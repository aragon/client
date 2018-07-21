import React from 'react'
import BrowseByApp from './BrowseByApp'
import BrowseByEntity from './BrowseByEntity'

class Home extends React.Component {
  render() {
    const {
      apps,
      appsLoading,
      onOpenApp,
      onOpenEntity,
      permissions,
    } = this.props
    return (
      <div>
        <BrowseByApp
          apps={apps}
          appsLoading={appsLoading}
          onOpenApp={onOpenApp}
        />
        <BrowseByEntity
          permissions={permissions.byEntity}
          appsLoading={appsLoading}
          onOpenEntity={onOpenEntity}
        />
      </div>
    )
  }
}

export default Home
