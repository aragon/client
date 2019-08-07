import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import {
  Box,
  GU,
  IdentityBadge,
  Text,
  LoadingRing,
  breakpoint,
  font,
  theme,
} from '@aragon/ui'
import { getSubscriptions } from './notification-service-api'

export default function Subscriptions({ email, token }) {
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
        console.log(error)
        setApiError(error.message)
      })
  }, [email, token])

  if (apiError) {
    return (
      <Box heading="Email notifications">
        <Text color={theme.negative} size="xsmall">
          Error {apiError.toString()}
        </Text>
      </Box>
    )
  }
  return (
    <Box heading="Email notifications">
      {isFetching && <LoadingRing />}
      {!isFetching && !subscriptions.length ? (
        'No subscriptions'
      ) : (
        <SubscriptionsTable subscriptions={subscriptions} />
      )}
    </Box>
  )
}

Subscriptions.propTypes = {
  email: PropTypes.string,
  token: PropTypes.string,
}

function SubscriptionsTable({ subscriptions }) {
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
