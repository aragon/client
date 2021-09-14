import React, { useState, useEffect, useCallback } from 'react'
import PropTypes from 'prop-types'
import { AppType } from '../../../prop-types'
import {
  Box,
  Button,
  GU,
  IconTrash,
  IconCheck,
  LoadingRing,
  useToast,
  useTheme,
  Split,
} from '@aragon/ui'
import { getSubscriptions, deleteAccount } from './notification-service-api'
import {
  NOTIFICATION_SERVICE_TOKEN_KEY,
  NOTIFICATION_SERVICE_EMAIL_KEY,
} from './constants'
import SubscriptionsForm from './SubscriptionsForm'
import SubscriptionsTable from './SubscriptionsTable'
import { DeleteAccountConfirmationModal } from './NotificationModals'
import { useWallet } from '../../../contexts/wallet'

export default function ManageNotifications({
  apps,
  email,
  onLogout,
  token,
  onServiceUnavailable,
}) {
  const toast = useToast()

  const [apiError, setApiError] = useState(null)
  const [isFetching, setIsFetching] = useState(true)
  const [subscriptions, setSubscriptions] = useState([])
  const { networkType } = useWallet()

  const fetchSubscriptions = useCallback(() => {
    setIsFetching(true)
    return getSubscriptions(networkType, token)
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
  }, [token, networkType])

  useEffect(() => {
    if (!token) {
      return
    }
    fetchSubscriptions()
  }, [fetchSubscriptions, token])

  useEffect(() => {
    // Effect for handling api errors
    if (!apiError) {
      return
    }
    if (apiError instanceof TypeError) {
      onServiceUnavailable()
    } else {
      console.error('Unhandled API error:', apiError)
    }
  }, [apiError, onServiceUnavailable])

  const handleLogout = useCallback(() => {
    onLogout()
    toast('Signed out from email notifications')
  }, [onLogout, toast])

  return (
    <React.Fragment>
      <Split
        primary={
          <SubscriptionsForm
            onApiError={setApiError}
            fetchSubscriptions={fetchSubscriptions}
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
                onClick={handleLogout}
              >
                Sign out
              </Button>
            </Box>
            <DeleteAccount
              onApiError={setApiError}
              token={token}
              onLogout={onLogout}
              toast={toast}
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
          toast={toast}
        />
      )}
    </React.Fragment>
  )
}

ManageNotifications.propTypes = {
  apps: PropTypes.arrayOf(AppType).isRequired,
  email: PropTypes.string,
  onLogout: PropTypes.func,
  onServiceUnavailable: PropTypes.func,
  token: PropTypes.string,
}

function DeleteAccount({ token, onLogout, onApiError, toast }) {
  const theme = useTheme()

  const [isFetching, setIsFetching] = useState(false)
  const [isAccountDeleted, setIsAccountDeleted] = useState(false)
  const [deleteAccountModalOpened, setDeleteAccountModalOpened] = useState(
    false
  )

  const handleDeleteAccount = useCallback(async () => {
    try {
      setIsFetching(true)
      await deleteAccount(token)
      localStorage.removeItem(NOTIFICATION_SERVICE_TOKEN_KEY)
      localStorage.removeItem(NOTIFICATION_SERVICE_EMAIL_KEY)
      setIsAccountDeleted(true)
      onLogout()
      toast('Email notifications account deleted')
    } catch (e) {
      onApiError(e)
    }
    setIsFetching(false)
  }, [token, onLogout, toast, onApiError])

  const onClick = useCallback(() => {
    setDeleteAccountModalOpened(true)
  }, [])

  const onCloseModal = useCallback(() => {
    setDeleteAccountModalOpened(false)
  }, [])

  const onModalConfirm = useCallback(() => {
    setDeleteAccountModalOpened(false)
    handleDeleteAccount()
  }, [handleDeleteAccount])

  return (
    <React.Fragment>
      <Box heading="Email Notification Data">
        <Button wide onClick={onClick}>
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
      <DeleteAccountConfirmationModal
        visible={deleteAccountModalOpened}
        onConfirm={onModalConfirm}
        onClose={onCloseModal}
      />
    </React.Fragment>
  )
}

DeleteAccount.propTypes = {
  onApiError: PropTypes.func,
  onLogout: PropTypes.func,
  token: PropTypes.string,
  toast: PropTypes.func,
}
