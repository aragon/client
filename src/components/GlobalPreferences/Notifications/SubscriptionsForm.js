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
export function SubscriptionsForm({ apps, dao, onApiError, onCreate, token }) {
  // TODO: get subscriptions and filter out existing options
  const [selectedAppIdx, setSelectedAppIdx] = useState(-1)
  const [selectedEventIdx, setSelectedEventIdx] = useState(-1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const theme = useTheme()
  const subscriptionApps = apps.filter(
    ({ isAragonOsInternalApp }) => !isAragonOsInternalApp
  )
  const appNames = subscriptionApps.map(
    app => `${app.name} ${app.identifier ? `(${app.identifier})` : ''}`
  )
  const selectedApp =
    selectedAppIdx === -1 ? null : subscriptionApps[selectedAppIdx]
  const eventNames =
    selectedAppIdx === -1 ? [''] : getEventNamesFromAbi(selectedApp.abi)

  const handleAppChange = index => {
    setSelectedAppIdx(index)
    setSelectedEventIdx(-1)
  }
  const handleEventChange = index => {
    setSelectedEventIdx(index)
  }
  const handeSubscribe = async e => {
    console.log(eventNames[selectedAppIdx])
    setIsSubmitting(true)
    const { abi, appName, proxyAddress } = selectedApp

    try {
      const payload = {
        abi,
        appName,
        appContractAddress: proxyAddress,
        ensName: dao,
        eventName: eventNames[selectedEventIdx],
        network: getEthNetworkType(),
        token,
      }
      console.log(selectedApp)
      console.log(payload)
      const response = await createSubscription(payload)
      setSelectedAppIdx(-1)
      setSelectedEventIdx(-1)
      onCreate()
    } catch (e) {
      onApiError(e.message)
    }
    setIsSubmitting(false)

    // console.log('', selectedApp)
    // console.log()
    // console.log(`eventName: `, eventNames[selectedAppIdx])
    // console.log(`contractAddress: ${selectedApp.contractAddress}`)
    // console.log(`ensName: ${dao}`)
    // console.log()
    // console.log(selectedApp.abi)
  }
  // const isSubscribeDisabled = selectedAppIdx !== 0 && selectedEvent !== 0
  const isSubscribeDisabled = false
  return (
    <Box
      css={`
        color: ${theme.surfaceContentSecondary};
      `}
      heading="Create Subscriptions"
    >
      <div
        css={`
          margin-bottom: ${2 * GU}px;
        `}
      >
        <Label>App</Label>
        <DropDown
          width="100%"
          placeholder="Select an App"
          items={appNames}
          selected={selectedAppIdx}
          onChange={handleAppChange}
        />
      </div>
      <div>
        <Label>Event</Label>
        <DropDown
          disabled={selectedAppIdx === -1}
          placeholder="Select an App"
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
        <Button disabled={isSubscribeDisabled} onClick={handeSubscribe}>
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
  onApiError: PropTypes.func,
  onCreate: PropTypes.func,
  token: PropTypes.string,
}
