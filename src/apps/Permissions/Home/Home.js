import React from 'react'
import BrowseByApp from './BrowseByApp'
import BrowseByEntity from './BrowseByEntity'

class Home extends React.Component {
  render() {
    const {
      apps,
      appsLoading,
      permissions,
      permissionsLoading,
      onOpenApp,
      onOpenEntity,
      daoAddress,
      resolveEntity,
      resolveRole,
    } = this.props
    return (
      <div>
        <BrowseByApp
          apps={apps.filter(app => app.hasWebApp)}
          loading={appsLoading}
          onOpenApp={onOpenApp}
        />
        <BrowseByEntity
          permissions={permissions}
          daoAddress={daoAddress}
          resolveEntity={resolveEntity}
          resolveRole={resolveRole}
          loading={permissionsLoading || !resolveEntity || !resolveRole}
          onOpenEntity={onOpenEntity}
        />
      </div>
    )
  }
}

export default Home
