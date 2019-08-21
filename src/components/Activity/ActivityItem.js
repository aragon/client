import React from 'react'
import PropTypes from 'prop-types'
import { IconCross, IconCheck, GU, textStyle, useTheme } from '@aragon/ui'
import { cssgu } from '../../utils'
import { transformAddresses } from '../../web3-utils'
import AppIcon from '../AppIcon/AppIcon'
import LocalIdentityBadge from '../IdentityBadge/LocalIdentityBadge'
import TimeTag from './TimeTag'
import TransactionProgress from './TransactionProgress'
import {
  ACTIVITY_STATUS_CONFIRMED,
  ACTIVITY_STATUS_FAILED,
  ACTIVITY_STATUS_TIMED_OUT,
} from '../../symbols'

const ActivityItem = ({ activity }) => {
  const theme = useTheme()
  const { app } = activity

  return (
    <section
      css={`
        display: grid;
        align-items: center;
        grid-template-areas:
          'title time'
          'content content';
        overflow: hidden;
        position: relative;
        width: 100%;
        padding: ${cssgu`2gu`};
        background: ${theme.surface};
      `}
    >
      <h1
        css={`
          grid-area: title;
          display: flex;
          align-items: center;
        `}
      >
        <div css="flex-shrink: 0">
          <AppIcon app={app} />
        </div>
        <div
          css={`
            margin-left: ${cssgu`1gu`};
            white-space: nowrap;
            ${textStyle('body2')}
            color: ${theme.surfaceContent};
          `}
        >
          {app ? app.name : 'Unknown'}
        </div>
      </h1>
      <div
        css={`
          grid-area: time;
          justify-self: end;
        `}
      >
        <TimeTag date={activity.createdAt} />
      </div>
      <div
        css={`
          grid-area: content;
          position: relative;
          margin-top: ${2 * GU}px;
        `}
      >
        <ItemContent text={activity.description} />
        <StatusMessage activity={activity} />
        <TransactionProgress
          status={activity.status}
          createdAt={activity.createdAt}
        />
      </div>
    </section>
  )
}

ActivityItem.propTypes = {
  activity: PropTypes.object.isRequired,
}

const ItemContent = React.memo(
  ({ text = '' }) => (
    <p
      css={`
        ${textStyle('body2')}
      `}
    >
      {transformAddresses(text, (part, isAddress, index) =>
        isAddress ? (
          <span title={part} key={index}>
            <LocalIdentityBadge entity={part} compact />
          </span>
        ) : (
          <span key={index}>{part}</span>
        )
      )}
    </p>
  ),
  (prevProps, nextProps) => prevProps.text === nextProps.text
)

ItemContent.propTypes = {
  text: PropTypes.string.isRequired,
}

function getStatusData(activity, theme) {
  if (activity.status === ACTIVITY_STATUS_CONFIRMED) {
    return [
      <IconCheck size="small" />,
      <span>Transaction confirmed</span>,
      theme.positive,
    ]
  }
  if (activity.status === ACTIVITY_STATUS_FAILED) {
    return [
      <IconCross size="small" />,
      <span>Transaction failed</span>,
      theme.negative,
    ]
  }
  if (activity.status === ACTIVITY_STATUS_TIMED_OUT) {
    return [
      <IconCross size="small" />,
      <span>Transaction timed out</span>,
      theme.negative,
    ]
  }
  return [null, <span>Transaction pending</span>, theme.surfaceContentSecondary]
}

const StatusMessage = ({ activity }) => {
  const theme = useTheme()
  const [icon, content, color] = getStatusData(activity, theme)
  return (
    <div
      css={`
        display: flex;
        align-items: center;
        margin-top: ${2 * GU}px;
        ${textStyle('label2')}
        color: ${color}
      `}
    >
      {icon}
      {content}
    </div>
  )
}

StatusMessage.propTypes = {
  activity: PropTypes.object.isRequired,
}

export default ActivityItem
