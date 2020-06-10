import React, { useMemo, useCallback } from 'react'
import {
  IconGrid,
  textStyle,
  GU,
  DropDown,
  Tag,
  useTheme,
  IconCheck,
  useLayout,
  IconWrite,
  IconShare,
} from '@aragon/ui'
import PropTypes from 'prop-types'
import { STATUS_PENDING, STATUS_ACTIVE } from './agreement-statuses'
import icon from './assets/icon.svg'

function AgreementHeader({ title, status, onSign, onShare }) {
  const theme = useTheme()
  const { layoutName } = useLayout()

  const handleDropdownChange = useCallback(
    index => {
      if (index === 0) {
        onSign()
      }
      if (index === 1) {
        onShare()
      }
    },
    [onSign, onShare]
  )

  const dropdownItems = useMemo(
    () => [
      <DropdownItem Icon={IconWrite} label="Sign" />,
      <DropdownItem Icon={IconShare} label="Share" />,
    ],
    []
  )

  return (
    <div
      css={`
        display: flex;
        align-items: center;
        margin-bottom: ${layoutName === 'small' ? 4 * GU : 5 * GU}px;
      `}
    >
      {layoutName !== 'small' && <DecorativeIcon />}
      <div
        css={`
          display: flex;
          flex: 1;
          justify-content: space-between;
        `}
      >
        <div>
          <h1
            css={`
              ${layoutName === 'small'
                ? textStyle('title3')
                : textStyle('title2')};
              line-height: 1.3;
              margin-bottom: ${1 * GU}px;
            `}
          >
            {title}
          </h1>
          <div
            css={`
              display: flex;
            `}
          >
            {status === STATUS_PENDING && (
              <Tag
                label="Pending Approval"
                color={`${theme.warningSurfaceContent}`}
                background={`${theme.warningSurface}`}
              />
            )}
            {status === STATUS_ACTIVE && (
              <Tag
                icon={<IconCheck size="small" />}
                label="Active"
                color={`${theme.positiveSurfaceContent}`}
                background={`${theme.positiveSurface}`}
              />
            )}
          </div>
        </div>
        <DropDown
          header="Actions"
          items={dropdownItems}
          placeholder={
            <div
              css={`
                display: flex;
                flex-shrink: 0;
                align-items: center;
              `}
            >
              <span
                css={`
                  display: inline-flex;

                  color: ${theme.surfaceIcon};
                `}
              >
                <IconGrid size="medium" />
              </span>

              <span
                css={`
                  margin-left: ${1 * GU}px;
                `}
              >
                Actions
              </span>
            </div>
          }
          css={`
            flex-shrink: 0;
          `}
          onChange={handleDropdownChange}
        />
      </div>
    </div>
  )
}

/* eslint-disable react/prop-types */
function DropdownItem({ Icon, label }) {
  const theme = useTheme()

  return (
    <div
      css={`
        display: flex;
      `}
    >
      <span
        css={`
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          color: ${theme.surfaceIcon};
        `}
      >
        <Icon />
      </span>
      <span
        css={`
          margin-left: ${GU}px;
        `}
      >
        {label}
      </span>
    </div>
  )
}
/* eslint-disable react/prop-types */

function DecorativeIcon() {
  return (
    <div
      css={`
        position: relative;
        overflow: hidden;
        border-radius: 100%;
        flex-shrink: 0;
        margin-right: ${2 * GU}px;
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
  )
}

AgreementHeader.defaultProps = {
  status: STATUS_PENDING,
}

AgreementHeader.propTypes = {
  title: PropTypes.string,
  status: PropTypes.oneOf([STATUS_PENDING, STATUS_ACTIVE]).isRequired,
  onSign: PropTypes.func,
  onShare: PropTypes.func,
}

export default AgreementHeader
