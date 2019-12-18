import React, { useCallback, useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import { textStyle, GU, IconCheck, useTheme } from '@aragon/ui'
import { TransactionStatusType } from '../../prop-types'
import {
  TRANSACTION_STATUS_UPCOMING,
  TRANSACTION_STATUS_SIGNING,
  TRANSACTION_STATUS_PENDING,
  TRANSACTION_STATUS_SUCCESS,
} from '../../symbols'
import styled from 'styled-components'
import { addMinutes } from 'date-fns'

function DeploymentStepsItem({ index, name, status, dateStart, gasPrice }) {
  const theme = useTheme()
  const [remainingTime, setRemainingTime] = useState(0)
  const [remainingTimeUnit, setRemainingTimeUnit] = useState('')
  const [completedFraction, setCompletedFraction] = useState(0)

  const updateTime = useCallback(
    dateEnd => {
      const now = new Date()
      if (now > dateEnd) {
        setRemainingTime(0)
        setRemainingTimeUnit('sec')
        setCompletedFraction(1)
        return
      }
      const time = (dateEnd - now) / 1000
      const unit = time < 60 ? 'sec' : time < 3600 ? 'min' : 'hr'
      const amount = Math.floor(
        unit === 'sec' ? time : unit === 'min' ? 1 + time / 60 : 1 + time / 3600
      )
      const fraction = (now - dateStart) / (dateEnd - dateStart)
      setRemainingTime(amount)
      setRemainingTimeUnit(unit)
      setCompletedFraction(fraction)
    },
    [dateStart]
  )

  useMemo(() => {
    if (gasPrice === undefined) return
    fetch('https://ethgasstation.info/json/predictTable.json')
      .then(response =>
        response
          .json()
          .then(data => {
            const index = data.findIndex(d => d.gasprice >= gasPrice)
            const priceAbove = data[index]
            const priceBelow = data[index > 0 ? index - 1 : index]
            const priceCloser =
              priceAbove - gasPrice < gasPrice - priceBelow
                ? priceAbove
                : priceBelow
            const expectedTime = priceCloser.expectedTime
            const dateEnd = addMinutes(dateStart, expectedTime)
            updateTime(dateEnd)
            setInterval(() => updateTime(dateEnd), 1000)
            return null
          })
          .catch(console.err)
      )
      .catch(console.err)
  }, [dateStart, gasPrice, updateTime])

  const stepStyles = useMemo(() => {
    if (status === TRANSACTION_STATUS_PENDING) {
      return `
        border: 2px solid ${theme.selected};
      `
    }
    if (status === TRANSACTION_STATUS_SUCCESS) {
      return `
        border: 2px solid ${theme.positive};
        color: ${theme.positive};
      `
    }
    return `
      padding-top: 2px;
      background: #ECEFF4;
      color: #9CA7B8;
    `
  }, [status, theme])

  return (
    <div
      css={`
        display: flex;
        align-items: center;
        height: ${5 * GU}px;
        margin-top: ${3 * GU}px;
      `}
    >
      {status === TRANSACTION_STATUS_PENDING ? (
        <ProgressRing value={completedFraction} diameter={5 * GU} />
      ) : (
        <div
          css={`
            width: ${5 * GU}px;
            height: ${5 * GU}px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            font-size: 18px;
            font-weight: 600;
            ${stepStyles};
            flex-shrink: 0;
            flex-grow: 0;
          `}
        >
          {status === TRANSACTION_STATUS_SUCCESS ? (
            <IconCheck />
          ) : (
            (status === TRANSACTION_STATUS_UPCOMING ||
              status === TRANSACTION_STATUS_SIGNING) &&
            index + 1
          )}
        </div>
      )}
      <div
        css={`
          margin-left: ${3 * GU}px;
          font-size: 18px;
          font-weight: ${status === TRANSACTION_STATUS_PENDING ? '600' : '400'};
          overflow: hidden;
          text-overflow: ellipsis;
        `}
      >
        <div>{name}</div>
        <div
          css={`
            ${textStyle('body3')};
            color: ${theme.surfaceContentSecondary};
          `}
        >
          <StatusMessage
            status={status}
            remainingTime={remainingTime}
            remainingTimeUnit={remainingTimeUnit}
          />
        </div>
      </div>
    </div>
  )
}

DeploymentStepsItem.propTypes = {
  index: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  status: TransactionStatusType.isRequired,
  dateStart: PropTypes.objectOf(Date),
  gasPrice: PropTypes.number,
}

const StatusMessage = ({ status, remainingTime, remainingTimeUnit }) => {
  switch (status) {
    case TRANSACTION_STATUS_UPCOMING:
      return ''
    case TRANSACTION_STATUS_SIGNING:
      return 'Waiting for signature'
    case TRANSACTION_STATUS_PENDING:
      const displayTime = ` - ${remainingTime} ${remainingTimeUnit}`
      return `Transaction in progress${displayTime}`
    case TRANSACTION_STATUS_SUCCESS:
      return ''
  }
}

StatusMessage.propTypes = {
  status: TransactionStatusType.isRequired,
  remainingTime: PropTypes.number,
  remainingTimeUnit: PropTypes.string,
}

const ProgressRing = ({ value, diameter }) => {
  const theme = useTheme()
  return (
    <RingContainer diameter={diameter}>
      <RingBorder diameter={diameter} theme={theme} />
      <Half side="right" value={value} diameter={diameter} />
      <Half side="left" value={value} diameter={diameter} />
    </RingContainer>
  )
}

ProgressRing.propTypes = {
  value: PropTypes.number.isRequired,
  diameter: PropTypes.number.isRequired,
}

const Half = ({ side, value, diameter }) => {
  const theme = useTheme()
  let angle
  if (side === 'right') {
    if (value <= 0.5) {
      angle = value * 360
    } else {
      angle = 180
    }
  } else {
    if (value > 0.5) {
      angle = value * 360
    } else {
      angle = 180
    }
  }
  return (
    <HalfHider side={side} diameter={diameter}>
      <HalfRing angle={angle} diameter={diameter} theme={theme} />
    </HalfHider>
  )
}

Half.propTypes = {
  side: PropTypes.oneOf(['right', 'left']),
  value: PropTypes.number.isRequired,
  diameter: PropTypes.number.isRequired,
}

const RingContainer = styled.div`
  position: relative;
  width: ${({ diameter }) => diameter}px;
`

const RingBorder = styled.div`
  height: ${({ diameter }) => diameter}px;
  border: 2px solid ${({ theme }) => theme.border};
  border-radius: 50%;
`

const HalfHider = styled.div`
  position: absolute;
  top: 0px;
  width: ${({ diameter }) => diameter}px;
  height: ${({ diameter }) => diameter}px;
  clip-path: inset(
    ${({ side, diameter }) =>
      side === 'right'
        ? `0px 0px 0px ${diameter / 2}px`
        : `0px ${diameter / 2}px 0px 0px`}
  );
`

const HalfRing = styled.div.attrs(({ angle }) => ({
  style: {
    transform: `rotate(${angle}deg)`,
  },
}))`
  position: absolute;
  top: 0px;
  width: ${({ diameter }) => diameter}px;
  height: ${({ diameter }) => diameter}px;
  border: 2px solid ${({ theme }) => theme.selected};
  border-radius: 50%;
  clip-path: inset(0px ${({ diameter }) => diameter / 2}px 0px 0px);
`

export default DeploymentStepsItem
