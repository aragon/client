import React, { useState, useCallback } from 'react'
import {
  Box,
  Button,
  DropDown,
  GU,
  IconMail,
  LoadingRing,
  useTheme,
} from '@aragon/ui'
import { AppType } from '../../../prop-types'
import PropTypes from 'prop-types'
import memoize from 'lodash.memoize'
import styled from 'styled-components'
import { getEthNetworkType } from '../../../local-settings'
import { createSubscription } from './notification-service-api'

const getEventNamesFromAbi = memoize(abi =>
  abi.filter(item => item.type === 'event').map(item => item.name)
)

const filterSubscribedEvents = (abiEvents, subscribedEvents) =>
  abiEvents.filter(event => !subscribedEvents.includes(event))

function getSubscribableEvents(subscriptions, abi) {
  const subscribedEvents = subscriptions.map(({ eventName }) => eventName)
  const abiEvents = getEventNamesFromAbi(abi)
  return filterSubscribedEvents(abiEvents, subscribedEvents)
}

function getSubscribableApps(apps, subscriptions) {
  const subscribableApps = apps.filter(
    app =>
      !app.isAragonOsInternalApp &&
      getSubscribableEvents(subscriptions, app.abi).length > 0 // When subscribed to all events of an app, filter out apps with no subscribable events
  )

  const subscribableEvents = subscribableApps.map(app =>
    getSubscribableEvents(subscriptions, app.abi)
  )

  return [subscribableApps, subscribableEvents]
}

export function SubscriptionsForm({
  apps,
  dao,
  isFetchingSubscriptions,
  onApiError,
  onCreate,
  subscriptions,
  token,
}) {
  const [selectedAppIdx, setSelectedAppIdx] = useState(-1)
  const [selectedEventIdx, setSelectedEventIdx] = useState(-1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const theme = useTheme()
  const [subscribableApps, subscribableEvents] = getSubscribableApps(
    apps,
    subscriptions
  )

  const appNames = subscribableApps.map(
    app => `${app.name} ${app.identifier ? `(${app.identifier})` : ''}`
  )
  const selectedApp =
    selectedAppIdx === -1 ? null : subscribableApps[selectedAppIdx]

  let eventNames = ['']

  if (selectedApp) {
    // Once an app is selected, get corresponding events
    eventNames = subscribableEvents[selectedAppIdx]
    if (eventNames.length === 0) {
      // if subscribed to all events reset the app
      setSelectedAppIdx(-1)
    }
  }

  const handleAppChange = useCallback(
    index => {
      setSelectedAppIdx(index)
      setSelectedEventIdx(-1)
    },
    [setSelectedAppIdx, setSelectedEventIdx]
  )
  const handleEventChange = useCallback(
    index => {
      setSelectedEventIdx(index)
    },
    [setSelectedEventIdx]
  )

  const handleSubscribe = useCallback(
    async e => {
      setIsSubmitting(true)
      const { abi, appName, proxyAddress } = selectedApp
      const eventName = eventNames[selectedEventIdx]

      const abiSubset = [
        abi.find(({ name, type }) => type === 'event' && name === eventName),
      ]

      try {
        const payload = {
          abi: abiSubset,
          appName,
          appContractAddress: proxyAddress,
          ensName: dao,
          eventName: eventNames[selectedEventIdx],
          network: getEthNetworkType(),
          token,
        }
        await createSubscription(payload)
        setSelectedEventIdx(-1)
        setSelectedAppIdx(-1) // Reset app as it may be unavailable if subscribed to all that app's events
        onCreate()
      } catch (e) {
        onApiError(e.message)
      }
      setIsSubmitting(false)
    },
    [
      dao,
      eventNames,
      onApiError,
      onCreate,
      selectedApp,
      selectedEventIdx,
      token,
    ]
  )
  const isSubscribeDisabled =
    selectedAppIdx === -1 || selectedEventIdx === -1 || isSubmitting

  if (isFetchingSubscriptions) {
    return (
      <Box heading="Create Subscriptions">
        <LoadingRing />
      </Box>
    )
  }

  if (subscribableApps.length === 0 && !isFetchingSubscriptions) {
    return (
      <Box heading="Create Subscriptions">You are subscribed to all events</Box>
    )
  }

  return (
    <Box heading="Create Subscriptions">
      <div
        css={`
          margin-bottom: ${2 * GU}px;
        `}
      >
        <Label
          css={`
            color: ${theme.surfaceContentSecondary};
          `}
        >
          App
        </Label>
        <DropDown
          wide
          placeholder="Select an App"
          items={appNames}
          selected={selectedAppIdx}
          onChange={handleAppChange}
        />
      </div>
      <div>
        <Label
          css={`
            color: ${theme.surfaceContentSecondary};
          `}
        >
          Event
        </Label>
        <DropDown
          disabled={selectedAppIdx === -1}
          placeholder="Select an Event"
          width="100%"
          items={eventNames}
          selected={selectedEventIdx}
          onChange={handleEventChange}
        />
      </div>
      <div
        css={`
          margin-top: ${4 * GU}px;
        `}
      >
        <Button disabled={isSubscribeDisabled} onClick={handleSubscribe}>
          {isSubmitting ? (
            <LoadingRing
              css={`
                margin-right: ${GU}px;
              `}
            />
          ) : (
            <IconMail
              css={`
                color: ${theme.surfaceContentSecondary};
                margin-right: ${GU}px;
              `}
            />
          )}{' '}
          Subscribe
        </Button>
      </div>
    </Box>
  )
}

export const Label = styled.label`
  display: block;
  margin-bottom: ${GU}px;
`

SubscriptionsForm.propTypes = {
  apps: PropTypes.arrayOf(AppType).isRequired,
  dao: PropTypes.string,
  isFetchingSubscriptions: PropTypes.bool,
  onApiError: PropTypes.func,
  onCreate: PropTypes.func,
  subscriptions: PropTypes.array,
  token: PropTypes.string,
}
