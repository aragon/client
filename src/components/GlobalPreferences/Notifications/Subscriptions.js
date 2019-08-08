import React, { useState, useCallback, useEffect } from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import { AppType } from '../../../prop-types'
import {
  Box,
  DropDown,
  GU,
  IdentityBadge,
  Info,
  LoadingRing,
  breakpoint,
  font,
  theme,
} from '@aragon/ui'
import { getSubscriptions } from './notification-service-api'

export default function Subscriptions({ apps, email, token }) {
  const [apiError, setApiError] = useState(null)
  const [isFetching, setIsFetching] = useState(true)
  const [subscriptions, setSubscriptions] = useState([])

  useEffect(() => {
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
    <Box heading="Email notifications">
      {apiError && <Info mode="error">Error verifying: {apiError}</Info>}
      {isFetching && <LoadingRing />}
      <SubscriptionsForm apps={apps} />
      {!isFetching && <SubscriptionsTable subscriptions={subscriptions} />}
    </Box>
  )
}

Subscriptions.propTypes = {
  apps: PropTypes.arrayOf(AppType).isRequired,
  email: PropTypes.string,
  token: PropTypes.string,
}

function SubscriptionsForm({ apps }) {
  console.log(apps)
  const subscriptionApps = apps.filter(
    ({ isAragonOsInternalApp }) => !isAragonOsInternalApp
  )

  const appNames = ['', ...subscriptionApps.map(app => app.appName)]

  const [selectedApp, setSelectedApp] = useState(0)
  const [selectedEvent, setSelectedEvent] = useState(0)

  const handleAppChange = (index, items) => {
    setSelectedApp(index)
    // TODO: update the events
  }

  const handleEventChange = (index, items) => {
    setSelectedEvent(index)
    // TODO: update the events
  }

  return (
    <React.Fragment>
      <Label>App</Label>
      <DropDown
        items={appNames}
        active={selectedApp}
        onChange={handleAppChange}
      />
      <Label>Events</Label>
      <DropDown
        items={['', 'Event1', 'Event2']}
        active={selectedEvent}
        onChange={handleEventChange}
      />
    </React.Fragment>
  )
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
