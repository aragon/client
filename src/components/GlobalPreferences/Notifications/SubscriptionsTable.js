import React, { useState, useCallback } from 'react'
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
import LocalIdentityBadge from '../../IdentityBadge/LocalIdentityBadge'
import { deleteSubscriptions } from './notification-service-api'
import SubscriptionFilters from './SubscriptionFilters'
import { DeleteSubscriptionConfirmationModal } from './NotificationModals'

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
  const [selectedSubscriptions, setSelectedSubscriptions] = useState([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const handleSelectEntries = useCallback(
    (entries, indexes) => {
      setSelectedSubscriptions(indexes)
    },
    [setSelectedSubscriptions]
  )

  const organizations = Array.from(
    new Set(subscriptions.map(subscription => subscription.ensName))
  )
  const [selectedOrganization, setSelectedOrganization] = useState(-1)
  const onOrganizationChange = useCallback(
    idx => {
      setSelectedSubscriptions([])
      setSelectedOrganization(idx)
    },
    [setSelectedOrganization, setSelectedSubscriptions]
  )

  // Get unique app names by matching subscriptions with
  const subscriptionApps = Array.from(
    new Set(subscriptions.map(subscription => subscription.appName))
  )
  const [selectedApp, setSelectedApp] = useState(-1)
  const onAppChange = useCallback(
    idx => {
      setSelectedSubscriptions([])
      setSelectedApp(idx)
    },
    [setSelectedApp, setSelectedSubscriptions]
  )
  const events = Array.from(
    new Set(subscriptions.map(subscription => subscription.eventName))
  )
  const [selectedEvent, setSelectedEvent] = useState(-1)

  const onEventChange = useCallback(
    idx => {
      setSelectedSubscriptions([])
      setSelectedEvent(idx)
    },
    [setSelectedEvent, setSelectedSubscriptions]
  )
  const onClearFilters = useCallback(() => {
    setSelectedEvent(-1)
    setSelectedApp(-1)
    setSelectedOrganization(-1)
    // Reset selection when filters cleared
    setSelectedSubscriptions([])
  }, [
    setSelectedEvent,
    setSelectedApp,
    setSelectedOrganization,
    setSelectedSubscriptions,
  ])

  const onClick = useCallback(() => {
    setIsModalOpen(true)
  }, [setIsModalOpen])

  const onCloseModal = useCallback(() => {
    setIsModalOpen(false)
  }, [setIsModalOpen])

  const filteredSubscriptions = filterSubscriptions({
    subscriptions,
    event: events[selectedEvent],
    appName: subscriptionApps[selectedApp],
    organization: organizations[selectedOrganization],
  })

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
    setIsModalOpen(false)
    handleUnsubscribe()
  }, [handleUnsubscribe, setIsModalOpen])

  const theme = useTheme()

  return (
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
          <DeleteSubscriptionConfirmationModal
            visible={isModalOpen}
            onConfirm={onModalConfirm}
            onClose={onCloseModal}
          />
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
      ) => [
        <Label>{ensName}</Label>,
        <Label>{appName}</Label>,
        <LocalIdentityBadge entity={contractAddress} />,
        <Label>{eventName}</Label>,
      ]}
    />
  )
})

SubscriptionsTable.propTypes = {
  apps: PropTypes.array,
  apiError: PropTypes.string,
  onApiError: PropTypes.func,
  authToken: PropTypes.string,
  fetchSubscriptions: PropTypes.func,
  isFetchingSubscriptions: PropTypes.bool,
  subscriptions: PropTypes.array,
  toast: PropTypes.func,
}

export const Label = styled.label`
  display: block;
`

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

export default SubscriptionsTable
