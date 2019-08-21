import React, { useState, useEffect, useCallback } from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import { AppType } from '../../../prop-types'
import {
  Box,
  Button,
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
import { SubscriptionsForm } from './SubscriptionsForm'

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
    getSubscriptions(token)
      .then(subscriptions => {
        setSubscriptions(subscriptions)
        setIsFetching(false)
        return subscriptions
      })
      .catch(error => {
        setIsFetching(false)
        setApiError(error.message)
      })
  }, [token])

  useEffect(() => {
    if (!token) return
    fetchSubscriptions()
  }, [fetchSubscriptions, token])

  return (
    <React.Fragment>
      {apiError && (
        <Info
          css={`
            margin-bottom: ${GU}px;
          `}
          mode="error"
        >
          {apiError}
        </Info>
      )}
      <Split
        primary={
          <SubscriptionsForm
            onApiError={setApiError}
            onCreate={fetchSubscriptions}
            dao={dao}
            apps={apps}
            token={token}
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
      {!isFetching && subscriptions.length > 0 && (
        <SubscriptionsTable
          authToken={token}
          subscriptions={subscriptions}
          onUnsubscribe={fetchSubscriptions}
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
      onApiError(e.message)
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

const SubscriptionsTable = ({ subscriptions, onUnsubscribe, authToken }) => {
  const [selectedSubscriptionsIds, setSelectedSubscriptionsIds] = useState([])
  const [apiError, setApiError] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const handleSelectEntries = useCallback(
    (entries, indexes) => {
      console.log('handleSelectEntries', subscriptions, entries, indexes)
      setSelectedSubscriptionsIds(
        indexes.map(i => subscriptions[i].subscriptionId)
      )
    },
    [subscriptions, setSelectedSubscriptionsIds]
  )

  const handleUnsubscribe = useCallback(
    async e => {
      setIsSubmitting(true)
      try {
        await deleteSubscriptions({
          subscriptionIds: selectedSubscriptionsIds,
          authToken,
        })
        // reset selection
        setSelectedSubscriptionsIds([])
        setIsSubmitting(false)
        // Refetch subscriptions
        onUnsubscribe()
      } catch (e) {
        setApiError(e.message)
        setIsSubmitting(false)
      }
    },
    [
      authToken,
      onUnsubscribe,
      selectedSubscriptionsIds,
      setApiError,
      setIsSubmitting,
      setSelectedSubscriptionsIds,
    ]
  )
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
            {selectedSubscriptionsIds.length > 0 && (
              <div css="text-align: right;">
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
        </React.Fragment>
      }
      entries={subscriptions}
      onSelectEntries={handleSelectEntries}
      renderEntry={(
        { contractAddress, ensName, eventName },
        index,
        { selected, mode }
      ) => [
        <Label>{ensName}</Label>,
        <LocalIdentityBadge entity={contractAddress} />,
        <Label>{eventName}</Label>,
      ]}
    />
  )
}

SubscriptionsTable.propTypes = {
  authToken: PropTypes.string,
  onUnsubscribe: PropTypes.func,
  subscriptions: PropTypes.array,
}

export const Label = styled.label`
  display: block;
  margin-bottom: ${2 * GU}px;
`
