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
  const handleSubscribe = async e => {
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
        <Button
          disabled={isSubscribeDisabled || isSubmitting}
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
