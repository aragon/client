import React from 'react'
import PropTypes from 'prop-types'
import {
  ButtonIcon,
  IconClose,
  IconError,
  SafeLink,
  blockExplorerUrl,
  theme,
} from '@aragon/ui'
import { network } from '../../environment'
import { activityStatusTypes } from '../../contexts/ActivityContext'
import TimeTag from './TimeTag'
import AppIcon from '../AppIcon/AppIcon'
import IconSuccess from '../../icons/IconSuccess'
import IconPending from '../../icons/IconPending'

const ActivityItem = ({ activity, getAppByProxyAddress, onClose }) => {
  const app = getAppByProxyAddress(activity.targetAppProxyAddress)

  return (
    <section
      css={`
        display: grid;
        grid-template-rows: 1fr;
        grid-template-areas:
          'title time'
          'content content';
        overflow: hidden;
        position: relative;
        width: 100%;
        padding: 20px;
        transition: background 0.5s;
        background: rgba(255, 255, 255, ${activity.read ? '0' : '0.6'});
        border-bottom: 1px solid ${theme.contentBorder};
      `}
    >
      <CloseButton onClick={onClose} />
      <h1
        css={`
          grid-area: title;
          display: flex;
          align-items: center;
          font-size: 16px;
          color: #000000;
          line-height: 22px;
        `}
      >
        <div css="flex-shrink: 0">
          <AppIcon app={app} />
        </div>
        <div
          css={`
            margin-left: 5px;
            white-space: nowrap;
          `}
        >
          {app ? app.name : 'Unknown'}
        </div>
      </h1>
      <div
        css={`
          grid-area: time;
          opacity: 0.7;
          font-size: 12px;
          font-weight: 600;
          color: #6d777b;
          letter-spacing: 0;
          text-align: right;
          line-height: 16px;
          white-space: nowrap;
          & > span {
            vertical-align: sub;
          }
        `}
      >
        <TimeTag date={activity.createdAt} style={{ marginRight: 10 }} />
      </div>
      <div
        css={`
          grid-area: content;
          position: relative;
          margin-top: 10px;
          margin-bottom: 0;
          line-height: 22px;
          font-size: 15px;
          color: #000000;
          letter-spacing: 0;
          line-height: 22px;
        `}
      >
        <p>{activity.description}</p>
        <StatusMessage activity={activity} />
      </div>
    </section>
  )
}

ActivityItem.propTypes = {
  activity: PropTypes.object.isRequired,
  getAppByProxyAddress: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
}

function getStatusData(activity) {
  const txLink = (
    <SafeLink
      target="_blank"
      href={blockExplorerUrl('transaction', activity.transactionHash, {
        networkType: network.type,
      })}
    >
      Transaction
    </SafeLink>
  )
  if (activity.status === activityStatusTypes.CONFIRMED) {
    return [<IconSuccess />, <span>{txLink} confirmed.</span>]
  }
  if (activity.status === activityStatusTypes.FAILED) {
    return [<IconError />, <span>{txLink} failed.</span>]
  }
  if (activity.status === activityStatusTypes.TIMED_OUT) {
    return [<IconError />, <span>The {txLink} timed out.</span>]
  }
  return [<IconPending />, <span>{txLink} pending.</span>]
}

const StatusMessage = ({ activity }) => {
  const [icon, content] = getStatusData(activity)
  return (
    <div
      css={`
        display: flex;
        align-items: center;
        margin-top: 10px;
        font-size: 14px;
        a {
          color: ${theme.accent};
        }
      `}
    >
      {icon} <div css="margin-left: 5px">{content}</div>
    </div>
  )
}

StatusMessage.propTypes = {
  activity: PropTypes.object.isRequired,
}

const CloseButton = props => (
  <ButtonIcon
    {...props}
    label="Close"
    css={`
      position: absolute;
      top: 0;
      right: 0;
    `}
  >
    <IconClose />
  </ButtonIcon>
)

export default ActivityItem
