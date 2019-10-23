import React, { useState, useEffect } from 'react'
import { Button, DropDown, GU, Tag, useLayout } from '@aragon/ui'
import PropTypes from 'prop-types'
import { AppType } from '../../../prop-types'
import { useLocalIdentity } from '../../../hooks'

const AppLabel = React.memo(function AppLabel({ apps, app }) {
  const { name: appName, proxyAddress, contractAddress, identifier } = app
  const [label, setLabel] = useState(appName)
  const { name } = useLocalIdentity(proxyAddress)
  const onlyOneInstance =
    apps.filter(a => a.contractAddress === contractAddress).length === 1

  useEffect(() => {
    setLabel(name || appName)
  }, [appName, name])

  return (
    <div
      css={`
        display: flex;
        align-items: center;
      `}
    >
      {label}
      {!onlyOneInstance && !name && (
        <Tag
          mode="identifier"
          css={`
            margin-left: ${1 * GU}px;
          `}
        >
          {identifier}
        </Tag>
      )}
    </div>
  )
})

AppLabel.propTypes = {
  apps: PropTypes.arrayOf(AppType).isRequired,
  app: AppType.isRequired,
}

function SubscriptionFilters({
  organizations,
  selectedOrganization,
  onOrganizationChange,
  apps,
  appsFull,
  selectedApp,
  onAppChange,
  events,
  selectedEvent,
  onEventChange,
  onClearFilters,
}) {
  const { layoutName } = useLayout()
  const compact = layoutName === 'small'
  const appLabels = apps.map(appName => {
    const app = appsFull.find(app => app.appName === appName)
    if (!app) {
      return appName
    }

    return app.name
  })

  return (
    <div
      css={`
        width: 100%;
        margin-bottom: ${1 * GU}px;
        display: inline-grid;
        grid-gap: ${1.5 * GU}px;
        grid-template-columns: ${compact ? 'auto' : 'auto auto auto auto'};
        grid-template-rows: ${compact ? 'auto auto auto auto' : 'auto'};
      `}
    >
      <DropDown
        placeholder="Organization"
        header="Organization"
        items={organizations}
        selected={selectedOrganization}
        onChange={onOrganizationChange}
      />
      <DropDown
        placeholder="App"
        header="App"
        items={appLabels}
        selected={selectedApp}
        onChange={onAppChange}
      />
      <DropDown
        placeholder="Event"
        header="Event"
        items={events}
        selected={selectedEvent}
        onChange={onEventChange}
      />
      <Button
        css={`
          justify-self: end;
          opacity: ${selectedOrganization !== -1 ||
          selectedApp !== -1 ||
          selectedEvent !== -1
            ? 1
            : 0};
        `}
        onClick={onClearFilters}
      >
        Clear filters
      </Button>
    </div>
  )
}

SubscriptionFilters.propTypes = {
  organizations: PropTypes.array,
  selectedOrganization: PropTypes.number,
  onOrganizationChange: PropTypes.func,
  apps: PropTypes.array,
  selectedApp: PropTypes.number,
  onAppChange: PropTypes.func,
  events: PropTypes.array,
  selectedEvent: PropTypes.number,
  onEventChange: PropTypes.func,
  onClearFilters: PropTypes.func,
  appsFull: PropTypes.arrayOf(AppType).isRequired,
}

export default SubscriptionFilters
