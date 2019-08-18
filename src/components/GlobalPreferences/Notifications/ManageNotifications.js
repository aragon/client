import React, { useState, useEffect, useCallback } from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import { AppType } from '../../../prop-types'
import {
  Box,
  Button,
  GU,
  IconTrash,
  IconCheck,
  IdentityBadge,
  Info,
  LoadingRing,
  breakpoint,
  font,
  useTheme,
  Split,
} from '@aragon/ui'
import LocalIdentityBadge from '../../../components/IdentityBadge/LocalIdentityBadge'
import { getSubscriptions, deleteAccount } from './notification-service-api'
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
    getSubscriptions({ token })
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
        <SubscriptionsTable subscriptions={subscriptions} />
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

// appName 'voting.aragonpm.eth'
// eventName "CastVote"
// contractAddress "0x7d77398078079b0d57ed872319f26d29b5405eb8"
// ensName '3color.aragonid.eth'
// network 'rinkeby'
// abi @voting-abi.json

function SubscriptionsTable({ subscriptions }) {
  const theme = useTheme()

  return (
    <Box>
      <div
        css={`
          text-transform: uppercase;
          color: ${theme.content};
          ${font({ size: 'xsmall' })};
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          align-items: center;
          margin-bottom: ${1 * GU}px;
        `}
      >
        <div
          css={`
            display: inline-flex;
          `}
        >
          Organization
        </div>
        <div
          css={`
            display: inline-flex;
          `}
        >
          App
        </div>

        <span
          css={`
            display: inline-block;
          `}
        >
          Event
        </span>
      </div>
      <List border={theme.border} surface={theme.surface}>
        {subscriptions.map(
          ({ contractAddress, ensName, eventName, subscriptionId }) => (
            <li
              key={subscriptionId}
              css={`
                /* needs spacing left to compensate for list being moved to the edge */
                padding: ${2 * GU}px;
                display: grid;
                grid-template-columns: 1fr 1fr 1fr;
                align-items: center;
                border-bottom: 1px solid ${theme.border};
                background: ${theme.surface};
              `}
            >
              <Label>{ensName}</Label>
              <div>
                <LocalIdentityBadge entity={contractAddress} />
              </div>
              <Label>{eventName}</Label>
            </li>
          )
        )}
      </List>
    </Box>
  )
}

SubscriptionsTable.propTypes = {
  subscriptions: PropTypes.array,
}

export const Label = styled.label`
  display: block;
  margin-bottom: ${2 * GU}px;
`

const List = styled.ul`
  padding: 0;
  list-style: none;
  overflow: hidden;
  width: calc(100% + ${4 * GU}px);
  position: relative;
  left: -${2 * GU}px;
  background: ${({ surface }) => surface};
  z-index: 1;
  border-top: ${({ border }) => `1px solid ${border};`};
  border-bottom: ${({ border }) => `1px solid ${border};`};

  ${breakpoint(
    'medium',
    `
      max-height: 40vh;
      overflow: auto;

      li:first-child {
        border-top: none;
      }
      li:last-child {
        border-bottom: none;
      }
    `
  )}
`
