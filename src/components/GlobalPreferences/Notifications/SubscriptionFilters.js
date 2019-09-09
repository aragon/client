import React from 'react'
import { AppBadge, Button, DropDown, GU, useLayout } from '@aragon/ui'
import PropTypes from 'prop-types'
import { AppType } from '../../../prop-types'

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
  const appBadges = apps.map(appName => {
    const app = appsFull.find(app => app.appName === appName)
    if (!app) {
      return appName
    }
    const {
      contractAddress,
      icons: [{ src: iconSrc }],
      name,
    } = app
    return (
      <AppBadge
        appAddress={contractAddress}
        label={name}
        badgeOnly
        iconSrc={iconSrc}
      />
    )
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
        items={appBadges}
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
