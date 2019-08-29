import React, { useState, useEffect, useCallback } from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import { AppType } from '../../../prop-types'
import {
  Box,
  Button,
  ButtonText,
  GU,
  DataView,
  IconTrash,
  IconCheck,
  IconMail,
  Info,
  LoadingRing,
  breakpoint,
  font,
  useTheme,
  textStyle,
  Split,
} from '@aragon/ui'
import LocalIdentityBadge from '../../../components/IdentityBadge/LocalIdentityBadge'
import {
  getSubscriptions,
  deleteAccount,
  deleteSubscriptions,
} from './notification-service-api'
import {
  NOTIFICATION_SERVICE_TOKEN_KEY,
  NOTIFICATION_SERVICE_EMAIL_KEY,
} from './constants'
import SubscriptionsForm from './SubscriptionsForm'
import SubscriptionFilters from './SubscriptionFilters'
import NotificationsInfoBox, {
  ICON_SUCCESS,
  ICON_ERROR,
  ICON_NEUTRAL,
} from './NotificationsInfoBox'

export default function ManageNotifications({
  apps,
  dao,
  email,
  onLogout,
  token,
}) {
  const [apiError, setApiError] = useState(null)
  const [isFetching, setIsFetching] = useState(true)
  const [subscriptions, setSubscriptions] = useState([])

  const fetchSubscriptions = useCallback(() => {
    setIsFetching(true)
    return getSubscriptions(token)
      .then(subscriptions => {
        setApiError(null) // reset the error after successfully fetching
        setSubscriptions(subscriptions)
        setIsFetching(false)
        return subscriptions
      })
      .catch(error => {
        setIsFetching(false)
        setApiError(error)
      })
  }, [token, setSubscriptions, setIsFetching, setApiError])

  useEffect(() => {
    if (!token) {
      return
    }
    fetchSubscriptions()
  }, [fetchSubscriptions, token])

  return (
    <React.Fragment>
      <Split
        primary={
          <SubscriptionsForm
            onApiError={setApiError}
            fetchSubscriptions={fetchSubscriptions}
            dao={dao}
            apps={apps}
            token={token}
            isFetchingSubscriptions={isFetching}
            subscriptions={subscriptions}
          />
        }
        secondary={
          <React.Fragment>
            <Box heading="Signed In With Email">
              {email}
              <Button
                css={`
                  margin-top: ${2 * GU}px;
                `}
                wide
                onClick={onLogout}
              >
                Sign Out
              </Button>
            </Box>
            <DeleteAccount
              onApiError={setApiError}
              token={token}
              onLogout={onLogout}
            />
          </React.Fragment>
        }
      />
      {(apiError || subscriptions.length > 0) && (
        <SubscriptionsTable
          apps={apps}
          apiError={apiError}
          onApiError={setApiError}
          authToken={token}
          subscriptions={subscriptions}
          fetchSubscriptions={fetchSubscriptions}
          isFetchingSubscriptions={isFetching}
        />
      )}
    </React.Fragment>
  )
}

ManageNotifications.propTypes = {
  apps: PropTypes.arrayOf(AppType).isRequired,
  dao: PropTypes.string,
  email: PropTypes.string,
  onLogout: PropTypes.func,
  token: PropTypes.string,
}

function DeleteAccount({ token, onLogout, onApiError }) {
  const [isFetching, setIsFetching] = useState(false)
  const [isAccountDeleted, setIsAccountDeleted] = useState(false)
  const theme = useTheme()

  const handleDeleteAccount = useCallback(async () => {
    try {
      setIsFetching(true)
      await deleteAccount(token)
      localStorage.removeItem(NOTIFICATION_SERVICE_TOKEN_KEY)
      localStorage.removeItem(NOTIFICATION_SERVICE_EMAIL_KEY)
      setIsAccountDeleted(true)
      onLogout()
    } catch (e) {
      onApiError(e)
    }
    setIsFetching(false)
  }, [onLogout, token, onApiError])

  return (
    <Box heading="Email Notification Data">
      <Button onClick={handleDeleteAccount}>
        {isFetching ? (
          <LoadingRing />
        ) : isAccountDeleted ? (
          <IconCheck />
        ) : (
          <IconTrash
            css={`
              color: ${theme.negative};
              margin-right: ${GU}px;
            `}
          />
        )}
        Delete your email
      </Button>
    </Box>
  )
}

DeleteAccount.propTypes = {
  onApiError: PropTypes.func,
  onLogout: PropTypes.func,
  token: PropTypes.string,
}

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
const filterSubscriptions = ({
  subscriptions,
  organization,
  appName,
  event,
} = {}) => {
  return subscriptions.filter(subscription => {
    const matchingOrg = organization
      ? organization === subscription.ensName
      : true
    const matchingApp = appName ? appName === subscription.appName : true
    const matchingEvent = event ? event === subscription.eventName : true
    return matchingOrg && matchingApp && matchingEvent
  })
}

const SubscriptionsTable = React.memo(function SubscriptionsTable({
  apps,
  apiError,
  onApiError,
  authToken,
  subscriptions,
  fetchSubscriptions,
  isFetchingSubscriptions,
}) {
  const [selectedSubscriptions, setSelectedSubscriptions] = useState([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const handleSelectEntries = useCallback(
    (entries, indexes) => {
      setSelectedSubscriptions(indexes)
    },
    [setSelectedSubscriptions]
  )

  const handleUnsubscribe = useCallback(
    async e => {
      setIsSubmitting(true)
      try {
        const subscriptionIds = selectedSubscriptions.map(
          i => subscriptions[i].subscriptionId
        )
        await deleteSubscriptions({
          subscriptionIds,
          authToken,
        })
        // reset selection
        setIsSubmitting(false)
        // Refetch subscriptions
        fetchSubscriptions()
        setSelectedSubscriptions([])
      } catch (e) {
        onApiError(e)
        setIsSubmitting(false)
      }
    },
    [
      authToken,
      fetchSubscriptions,
      selectedSubscriptions,
      subscriptions,
      onApiError,
    ]
  )

  const organizations = Array.from(
    new Set(subscriptions.map(subscription => subscription.ensName))
  )
  const [selectedOrganization, setSelectedOrganization] = useState(-1)
  const onOrganizationChange = useCallback(
    idx => {
      setSelectedOrganization(idx)
    },
    [setSelectedOrganization]
  )

  // Get unique app names by matching subscriptions with
  const subscriptionApps = Array.from(
    new Set(subscriptions.map(subscription => subscription.appName))
  )
  const [selectedApp, setSelectedApp] = useState(-1)
  const onAppChange = useCallback(
    idx => {
      setSelectedApp(idx)
    },
    [setSelectedApp]
  )
  const events = Array.from(
    new Set(subscriptions.map(subscription => subscription.eventName))
  )
  const [selectedEvent, setSelectedEvent] = useState(-1)

  const onEventChange = useCallback(
    idx => {
      setSelectedEvent(idx)
    },
    [setSelectedEvent]
  )
  const onClearFilters = useCallback(() => {
    setSelectedEvent(-1)
    setSelectedApp(-1)
    setSelectedOrganization(-1)
  }, [setSelectedEvent, setSelectedApp, setSelectedOrganization])

  const filteredSubscriptions = filterSubscriptions({
    subscriptions,
    event: events[selectedEvent],
    appName: subscriptionApps[selectedApp],
    organization: organizations[selectedOrganization],
  })
  const theme = useTheme()

  if (apiError) {
    if (!(apiError instanceof TypeError)) {
      console.error('--- error handling is wrong for api errors')
    }
    return (
      <NotificationsInfoBox
        showImage={false}
        header="Error connecting to the Notifications server"
        icon={ICON_ERROR}
      >
        <div>
          There was an error when trying to connect to the Notifications server.
          <React.Fragment>
            Please
            <ButtonText
              disabled={isFetchingSubscriptions}
              css={`
                font-weight: bold;
              `}
              onClick={fetchSubscriptions}
            >
              retry {isFetchingSubscriptions && <LoadingRing />}
            </ButtonText>
            or try again later.
          </React.Fragment>
          )}
        </div>
      </NotificationsInfoBox>
    )
  }

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
            {selectedSubscriptions.length > 0 && (
              <div>
                <Button disabled={false} onClick={handleUnsubscribe}>
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
            )}
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
}

export const Label = styled.label`
  display: block;
`
