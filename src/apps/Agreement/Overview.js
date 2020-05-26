import React from 'react'
import PropTypes from 'prop-types'
import { Box, Tag, IconCheck, useTheme, textStyle, GU } from '@aragon/ui'
import icon from './icon.svg'

const STATUS_PENDING = 'pending'
const STATUS_ACTIVE = 'active'

function TagPending() {
  const theme = useTheme()

  return (
    <Tag
      icon={<IconCheck size="small" />}
      label="Pending Approval"
      color={theme.warningSurfaceContent}
      background={theme.warningSurface}
    />
  )
}

function TagActive() {
  const theme = useTheme()

  return (
    <Tag
      icon={<IconCheck size="small" />}
      label="Active"
      color={theme.positiveSurfaceContent}
      background={theme.positiveSurface}
    />
  )
}

function Overview({ status = STATUS_PENDING }) {
  return (
    <Box>
      <div
        css={`
          display: flex;
          align-items: center;
        `}
      >
        <div
          css={`
            position: relative;
            overflow: hidden;
            border-radius: 100%;
          `}
        >
          <img
            src={icon}
            alt=""
            width="70"
            height="70"
            css={`
              display: block;
            `}
          />
        </div>
        <div
          css={`
            margin-left: ${GU * 2}px;
          `}
        >
          <h1
            css={`
              ${textStyle('title2')};
              line-height: 1.2;
              margin-bottom: ${GU}px;
            `}
          >
            DAO Agreement
          </h1>
          <div
            css={`
              display: flex;
            `}
          >
            {status === STATUS_PENDING && <TagPending />}
            {status === STATUS_ACTIVE && <TagActive />}
          </div>
        </div>
      </div>
    </Box>
  )
}

Overview.defaultProps = {
  status: STATUS_PENDING,
}

Overview.propTypes = {
  status: PropTypes.oneOf([STATUS_PENDING, STATUS_ACTIVE]).isRequired,
}

export default Overview
