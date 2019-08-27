import React from 'react'
import { Button, DropDown, GU } from '@aragon/ui'
import PropTypes from 'prop-types'

const SubscriptionFilters = ({
  organizations,
  selectedOrganization,
  onOrganizationChange,
  apps,
  selectedApp,
  onAppChange,
  events,
  selectedEvent,
  onEventChange,
  onClearFilters,
}) => {
  return (
    <div
      css={`
        width: 100%;
        margin-bottom: ${1 * GU}px;
        display: inline-grid;
        grid-gap: ${1.5 * GU}px;
        grid-template-columns: auto auto auto auto;
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
        items={apps}
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
      {
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
          Clear Filters
        </Button>
      }
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
}

export default SubscriptionFilters
