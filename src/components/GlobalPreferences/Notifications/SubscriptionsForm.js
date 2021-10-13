import React, { useEffect, useState, useCallback } from 'react'
import {
  Box,
  Button,
  DropDown,
  GU,
  IconMail,
  LoadingRing,
  textStyle,
  useLayout,
  useTheme,
} from '@aragon/ui'
import { AppType } from '../../../prop-types'
import { useRouting } from '../../../routing'
import PropTypes from 'prop-types'
import memoize from 'lodash.memoize'
import styled from 'styled-components'
import { createSubscription } from './notification-service-api'
import notificationImage from './notification.png'
import LocalLabelAppBadge from '../../LocalLabelAppBadge/LocalLabelAppBadge'
import { useWallet } from '../../../contexts/wallet'

const getEventNamesFromAbi = memoize(abi =>
  abi.filter(item => item.type === 'event').map(item => item.name)
)

const filterSubscribedEvents = (abiEvents, subscribedEvents) =>
  abiEvents.filter(
    eventName =>
      !subscribedEvents.includes(eventName) &&
      // Ignore rare / internal events
      eventName !== 'ScriptResult' &&
      eventName !== 'RecoverToVault'
  )

// Get subscribable events for the contractAddress from the ABI and filter out existing subscriptions
function getSubscribableEvents({ subscriptions, abi, contractAddress } = {}) {
  const subscribedEvents = subscriptions
    .filter(subscription => subscription.contractAddress === contractAddress)
    .map(({ eventName }) => eventName)

  const abiEvents = getEventNamesFromAbi(abi)
  return filterSubscribedEvents(abiEvents, subscribedEvents)
}

function getSubscribables(apps, subscriptions) {
  const subscribableApps = apps.filter(
    app =>
      !app.isAragonOsInternalApp &&
      getSubscribableEvents({
        subscriptions,
        abi: app.abi,
        contractAddress: app.proxyAddress,
      }).length > 0 // When subscribed to all events of an app, filter out apps with no subscribable events
  )
  const subscribableEvents = subscribableApps.map(app =>
    getSubscribableEvents({
      subscriptions,
      abi: app.abi,
      contractAddress: app.proxyAddress,
    })
  )

  return [subscribableApps, subscribableEvents]
}

export default function SubscriptionsForm({
  apps,
  isFetchingSubscriptions,
  onApiError,
  fetchSubscriptions,
  subscriptions,
  token,
}) {
  const theme = useTheme()
  const { layoutName } = useLayout()
  const { mode } = useRouting()
  const { orgAddress } = mode
  const { networkType } = useWallet()

  const [selectedAppIdx, setSelectedAppIdx] = useState(-1)
  const [selectedEventIdx, setSelectedEventIdx] = useState(-1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [subscribableApps, setSubscribableApps] = useState([])
  const [subscribableEvents, setSubscribableEvents] = useState([])

  const selectedApp =
    selectedAppIdx === -1 ? null : subscribableApps[selectedAppIdx]
  const eventNames = selectedApp ? subscribableEvents[selectedAppIdx] : ['']

  const handleAppChange = useCallback(index => {
    setSelectedAppIdx(index)
    setSelectedEventIdx(-1)
  }, [])

  const handleEventChange = useCallback(index => {
    setSelectedEventIdx(index)
  }, [])

  const handleSubscribe = useCallback(
    async e => {
      setIsSubmitting(true)
      const { abi, appName, proxyAddress } = selectedApp
      const eventName = eventNames[selectedEventIdx]
      const abiEventSubset = abi.filter(({ name, type }) => type === 'event')

      try {
        const payload = {
          abi: abiEventSubset,
          appName,
          appContractAddress: proxyAddress,
          ensName: orgAddress,
          eventName,
          token,
          networkType,
        }
        await createSubscription(payload)
        setSelectedEventIdx(-1)

        await fetchSubscriptions()
      } catch (e) {
        onApiError(e)
      }
      setIsSubmitting(false)
    },
    [
      eventNames,
      fetchSubscriptions,
      onApiError,
      orgAddress,
      selectedApp,
      selectedEventIdx,
      token,
      networkType,
    ]
  )
  useEffect(() => {
    const [newSubscribableApps, newSubscribableEvents] = getSubscribables(
      apps,
      subscriptions
    )
    if (
      !newSubscribableApps[selectedAppIdx] || // case 1: selection is no longer valid
      (subscribableApps[selectedAppIdx] && // case 2: The selection has changed due to a new array of subscribable apps
        newSubscribableApps[selectedAppIdx].proxyAddress !==
          subscribableApps[selectedAppIdx].proxyAddress)
    ) {
      // Reset the app if the selected app is no longer unavailable
      setSelectedAppIdx(-1)
    }

    setSubscribableApps(newSubscribableApps)
    setSubscribableEvents(newSubscribableEvents)

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apps, subscriptions])

  // Every DAO must have apps, if apps.length is 0, the DAO is still loading
  if (apps.length === 0) {
    return (
      <SubscriptionsFormBox>
        <div
          css={`
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: ${25 * GU}px;
          `}
        >
          <LoadingRing />
          <p
            css={`
              margin-left: ${GU}px;
              ${textStyle('body1')};
            `}
          >
            Loading…
          </p>
        </div>
      </SubscriptionsFormBox>
    )
  }

  if (
    !isFetchingSubscriptions &&
    subscribableApps.length === 0 &&
    apps.length > 0
  ) {
    return (
      <SubscriptionsFormBox>
        <div
          css={`
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
          `}
        >
          <img
            src={notificationImage}
            alt=""
            height="193"
            css={`
              display: block;
              margin: 0 auto ${3 * GU}px;
            `}
          />
          You have subscribed to all app events available on this organization!
        </div>
      </SubscriptionsFormBox>
    )
  }

  const appLabels = subscribableApps.map(app => {
    return <LocalLabelAppBadge app={app} apps={apps} badgeOnly compact />
  })
  const isSubscribeDisabled =
    selectedAppIdx === -1 || selectedEventIdx === -1 || isSubmitting

  return (
    <SubscriptionsFormBox>
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
          header="App"
          placeholder="Select an App"
          items={appLabels}
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
        <Button
          mode="strong"
          wide={layoutName === 'small'}
          disabled={isSubscribeDisabled}
          onClick={handleSubscribe}
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
                color: ${isSubscribeDisabled
                  ? theme.disabledIcon
                  : theme.accentContent};
                margin-right: ${GU}px;
              `}
            />
          )}{' '}
          Subscribe
        </Button>
      </div>
    </SubscriptionsFormBox>
  )
}

SubscriptionsForm.propTypes = {
  apps: PropTypes.arrayOf(AppType).isRequired,
  isFetchingSubscriptions: PropTypes.bool,
  onApiError: PropTypes.func,
  fetchSubscriptions: PropTypes.func,
  subscriptions: PropTypes.array,
  token: PropTypes.string,
}

const SubscriptionsFormBox = props => {
  return <Box heading="Create Subscriptions" {...props} />
}

const Label = styled.label`
  display: block;
  margin-bottom: ${GU}px;
`
