import React, { useState, useEffect, useCallback } from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import { AppType } from '../../../prop-types'
import {
  Box,
  Button,
  DropDown,
  GU,
  IconMail,
  IconTrash,
  IconCheck,
  IdentityBadge,
  Info,
  LoadingRing,
  breakpoint,
  font,
  theme,
  Split,
} from '@aragon/ui'
import { getSubscriptions, deleteAccount } from './notification-service-api'
import { getEthNetworkType } from '../../../local-settings'

export default function ManageNotifications({ onLogout, apps, email, token }) {
  const [apiError, setApiError] = useState(null)
  const [isFetching, setIsFetching] = useState(true)
  const [subscriptions, setSubscriptions] = useState([])

  useEffect(() => {
    if (!token) return

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
  }, [email, token])

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
          <Box heading="Create Subscriptions">
            <SubscriptionsForm apps={apps} token={token} />
          </Box>
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
  email: PropTypes.string,
  onLogout: PropTypes.func,
  token: PropTypes.string,
}

function DeleteAccount({ token, onLogout, onApiError }) {
  const [isFetching, setIsFetching] = useState(false)
  const [isAccountDeleted, setIsAccountDeleted] = useState(false)

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

const getEventNamesFromAbi = abi =>
  abi.filter(item => item.type === 'event').map(item => item.name)

function SubscriptionsForm({ apps, token }) {
  const [selectedAppIdx, setSelectedAppIdx] = useState(0)
  const [selectedEvent, setSelectedEvent] = useState(0)

  const subscriptionApps = apps.filter(
    ({ isAragonOsInternalApp }) => !isAragonOsInternalApp
  )
  const appNames = [
    '',
    ...subscriptionApps.map(
      app => `${app.name} ${app.identifier ? `(${app.identifier})` : ''}`
    ),
  ]
  // Subtract 1 from index because we add an empty item in rendered list
  const selectedApp =
    selectedAppIdx === 0 ? null : subscriptionApps[selectedAppIdx - 1]

  const eventNames =
    selectedAppIdx === 0 ? [''] : getEventNamesFromAbi(selectedApp.abi)

  const handleAppChange = (index, items) => {
    setSelectedAppIdx(index)
    // TODO: update the events
  }

  const handleEventChange = (index, items) => {
    setSelectedEvent(index)
  }
  const handeSubscribe = e => {
    console.log(`subscribe to: `, subscriptionApps[selectedAppIdx - 1])
    console.log('selectedApp', selectedApp)
    console.log(selectedApp.appName)
    console.log(selectedApp.abi)
    console.log(getEthNetworkType())
  }

  // const isSubscribeDisabled = selectedAppIdx !== 0 && selectedEvent !== 0
  const isSubscribeDisabled = false

  return (
    <div
    // css={`
    //   display: grid;
    //   align-items: center;
    //   grid-template-columns: 2fr 2fr 1fr;
    //   grid-gap: ${2 * GU}px;
    //   margin-bottom: ${2 * GU}px;
    // `}
    >
      <Label>App</Label>
      <DropDown
        wide
        items={appNames}
        active={selectedAppIdx}
        onChange={handleAppChange}
      />
      <Label>Event</Label>
      <DropDown
        wide
        items={eventNames}
        active={selectedEvent}
        onChange={handleEventChange}
      />
      <Button disabled={isSubscribeDisabled} onClick={handeSubscribe}>
        <IconMail /> Subscribe
      </Button>
    </div>
  )
}

SubscriptionsForm.propTypes = {
  apps: PropTypes.arrayOf(AppType).isRequired,
  token: PropTypes.string,
}

function SubscriptionsTable({ subscriptions }) {
  if (!subscriptions || subscriptions.length === 0) return 'No subscriptions'

  return (
    <React.Fragment>
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
          App
        </div>

        <span
          css={`
            display: inline-block;
          `}
        >
          Event
        </span>

        <span
          css={`
            display: inline-block;
          `}
        >
          Network
        </span>
      </div>
      <List border={theme.border} surface={theme.surface}>
        {subscriptions.map(
          ({
            contractAddress,
            createdAt,
            eventName,
            network,
            subscriptionId,
          }) => (
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
              <div>
                <IdentityBadge entity={contractAddress} />
              </div>
              <Label>{eventName}</Label>
              <Label>{network}</Label>
            </li>
          )
        )}
      </List>
    </React.Fragment>
  )
}

SubscriptionsTable.propTypes = {
  subscriptions: PropTypes.array,
}

const Label = styled.label`
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
