import React, { useMemo, useState, useCallback } from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import {
  Button,
  GU,
  DataView,
  IconMail,
  LoadingRing,
  useTheme,
  textStyle,
} from '@aragon/ui'
import { AppType } from '../../../prop-types'
import LocalIdentityBadge from '../../IdentityBadge/LocalIdentityBadge'
import { deleteSubscriptions } from './notification-service-api'
import SubscriptionFilters from './SubscriptionFilters'
import { DeleteSubscriptionConfirmationModal } from './NotificationModals'
import LocalLabelAppBadge from '../../LocalLabelAppBadge/LocalLabelAppBadge'

/**
 * Filters the subscriptions based on the search criteria
 *
 * @param {Object} options options
 * @param {[Object]} options.subscriptions array of subscriptions as per the API schema
 * @param {String} options.organization organization to filter by or -1 to not search
 * @param {String} options.appName appName to filter by or -1 to not search
 * @param {String} options.event event name to filter by or -1 to not search
 *
 * @returns {[Object]} Array of filtered subscriptions
 */
function filterSubscriptions({
  subscriptions,
  organization,
  appName,
  event,
} = {}) {
  return subscriptions.filter(subscription => {
    const matchingOrg = organization
      ? organization === subscription.ensName
      : true
    const matchingApp = appName ? appName === subscription.appName : true
    const matchingEvent = event ? event === subscription.eventName : true
    return matchingOrg && matchingApp && matchingEvent
  })
}

const DEFAULT_CONSTANT = -1

const SubscriptionsTable = React.memo(function SubscriptionsTable({
  apps,
  apiError,
  onApiError,
  authToken,
  subscriptions,
  fetchSubscriptions,
  isFetchingSubscriptions,
  toast,
}) {
  const theme = useTheme()

  const [selectedOrganization, setSelectedOrganization] = useState(
    DEFAULT_CONSTANT
  )
  const [selectedApp, setSelectedApp] = useState(DEFAULT_CONSTANT)
  const [selectedEvent, setSelectedEvent] = useState(DEFAULT_CONSTANT)
  const [selectedSubscriptions, setSelectedSubscriptions] = useState([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [deleteModalOpened, setDeleteModalOpened] = useState(false)

  const handleSelectEntries = useCallback((entries, indexes) => {
    setSelectedSubscriptions(indexes)
  }, [])
  const onOrganizationChange = useCallback(idx => {
    setSelectedSubscriptions([])
    setSelectedOrganization(idx || DEFAULT_CONSTANT)
  }, [])
  const onAppChange = useCallback(idx => {
    setSelectedSubscriptions([])
    setSelectedApp(idx || DEFAULT_CONSTANT)
  }, [])
  const onEventChange = useCallback(idx => {
    setSelectedSubscriptions([])
    setSelectedEvent(idx || DEFAULT_CONSTANT)
  }, [])
  const onClearFilters = useCallback(() => {
    setSelectedEvent(DEFAULT_CONSTANT)
    setSelectedApp(DEFAULT_CONSTANT)
    setSelectedOrganization(DEFAULT_CONSTANT)
    // Reset selection when filters cleared
    setSelectedSubscriptions([])
  }, [])

  const onClick = useCallback(() => {
    setDeleteModalOpened(true)
  }, [])
  const onCloseModal = useCallback(() => {
    setDeleteModalOpened(false)
  }, [])

  const organizations = [
    'All',
    ...new Set(subscriptions.map(subscription => subscription.ensName)),
  ]
  const subscriptionApps = [
    'All',
    ...new Set(subscriptions.map(subscription => subscription.appName)),
  ]
  const events = [
    'All',
    ...new Set(subscriptions.map(subscription => subscription.eventName)),
  ]
  const filteredSubscriptions = useMemo(
    () =>
      filterSubscriptions({
        subscriptions,
        event: selectedEvent > 0 ? events[selectedEvent] : null,
        appName: selectedApp > 0 ? subscriptionApps[selectedApp] : null,
        organization:
          selectedOrganization > 0 ? organizations[selectedOrganization] : null,
      }),
    [
      events,
      organizations,
      selectedApp,
      selectedEvent,
      selectedOrganization,
      subscriptionApps,
      subscriptions,
    ]
  )

  const handleUnsubscribe = useCallback(
    async e => {
      setIsSubmitting(true)
      try {
        const subscriptionIds = selectedSubscriptions.map(
          i => filteredSubscriptions[i].subscriptionId
        )
        await deleteSubscriptions({
          subscriptionIds,
          authToken,
        })

        // reset selection
        setIsSubmitting(false)
        // Clear filters as the filter might no longer be valid as the item has been removed
        onClearFilters()
        // Refetch subscriptions
        fetchSubscriptions()
        toast('Email notifications unsubscribed')
      } catch (e) {
        onApiError(e)
        setIsSubmitting(false)
      }
    },
    [
      selectedSubscriptions,
      authToken,
      onClearFilters,
      fetchSubscriptions,
      toast,
      filteredSubscriptions,
      onApiError,
    ]
  )

  const onModalConfirm = useCallback(() => {
    setDeleteModalOpened(false)
    handleUnsubscribe()
  }, [handleUnsubscribe])

  return (
    <React.Fragment>
      <DataView
        fields={[
          {
            label: 'Organization',
            priority: 3,
          },
          {
            label: 'App',
            priority: 2,
          },
          {
            label: 'Contract',
            priority: 2,
          },
          {
            label: 'Event',
            priority: 1,
          },
        ]}
        heading={
          <React.Fragment>
            <div
              css={`
                height: ${9 * GU}px;
                display: flex;
                align-items: center;
                justify-content: space-between;
              `}
            >
              <div
                css={`
                  color: ${theme.content};
                  ${textStyle('body1')}
                `}
              >
                Subscriptions
              </div>
              <div>
                <Button
                  disabled={selectedSubscriptions.length === 0}
                  onClick={onClick}
                >
                  {isSubmitting ? (
                    <LoadingRing
                      css={`
                        margin-right: ${GU}px;
                      `}
                    />
                  ) : (
                    <IconMail
                      css={`
                        color: ${theme.negative};
                        margin-right: ${GU}px;
                      `}
                    />
                  )}{' '}
                  Unsubscribe
                </Button>
              </div>
            </div>
            <SubscriptionFilters
              organizations={organizations}
              selectedOrganization={selectedOrganization}
              onOrganizationChange={onOrganizationChange}
              apps={subscriptionApps}
              appsFull={apps}
              selectedApp={selectedApp}
              onAppChange={onAppChange}
              events={events}
              selectedEvent={selectedEvent}
              onEventChange={onEventChange}
              onClearFilters={onClearFilters}
            />
          </React.Fragment>
        }
        entries={filteredSubscriptions}
        onSelectEntries={handleSelectEntries}
        selection={selectedSubscriptions}
        renderEntry={(
          { appName, contractAddress, ensName, eventName },
          index,
          { selected, mode }
        ) => {
          const appLabel = (() => {
            const app = apps.find(a => a.contractAddress === contractAddress)
            if (!app) {
              return appName
            }
            return <LocalLabelAppBadge app={app} apps={apps} />
          })()

          return [
            <Label>{ensName}</Label>,
            <Label>{appLabel} </Label>,
            <LocalIdentityBadge entity={contractAddress} />,
            <Label>{eventName}</Label>,
          ]
        }}
      />
      <DeleteSubscriptionConfirmationModal
        visible={deleteModalOpened}
        onConfirm={onModalConfirm}
        onClose={onCloseModal}
      />
    </React.Fragment>
  )
})

SubscriptionsTable.propTypes = {
  apps: PropTypes.arrayOf(AppType).isRequired,
  apiError: PropTypes.string,
  onApiError: PropTypes.func.isRequired,
  authToken: PropTypes.string,
  fetchSubscriptions: PropTypes.func.isRequired,
  isFetchingSubscriptions: PropTypes.bool,
  subscriptions: PropTypes.array.isRequired,
  toast: PropTypes.func.isRequired,
}

const Label = styled.label`
  display: block;
`

export default SubscriptionsTable
