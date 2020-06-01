import React, { useCallback, useMemo } from 'react'
import {
  IconGrid,
  textStyle,
  GU,
  DropDown,
  Tag,
  useTheme,
  IconCheck,
  noop,
  useLayout,
  IconWrite,
  IconShare,
} from '@aragon/ui'
import PropTypes from 'prop-types'
import icon from './assets/icon.svg'

const STATUS_PENDING = 'pending'
const STATUS_ACTIVE = 'active'

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

function AgreementHeader({ status }) {
  const theme = useTheme()
  const { layoutName } = useLayout()

  const dropdownItems = useMemo(
    () => [
      <DropdownItem Icon={IconWrite} label="Sign" />,
      <DropdownItem Icon={IconShare} label="Share" />,
    ],
    []
  )

  const renderDecorativeIcon = useCallback(() => {
    if (layoutName === 'medium' || layoutName === 'large') {
      return (
        <div
          css={`
            position: relative;
            overflow: hidden;
            border-radius: 100%;
            flex-shrink: 0;
            margin-right: ${GU * 2}px;
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
  }, [layoutName])

  return (
    <div
      css={`
        display: flex;
        align-items: center;
        margin-bottom: ${layoutName === 'small' ? GU * 4 : GU * 5}px;
      `}
    >
      {renderDecorativeIcon()}
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
          onChange={noop}
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
                  margin-left: ${GU}px;
                `}
              >
                Actions
              </span>
            </div>
          }
          items={dropdownItems}
          header="Actions"
          css={`
            flex-shrink: 0;
          `}
        />
      </div>
    </div>
  )
}

AgreementHeader.defaultProps = {
  status: STATUS_PENDING,
}

AgreementHeader.propTypes = {
  status: PropTypes.oneOf([STATUS_PENDING, STATUS_ACTIVE]).isRequired,
}

export default AgreementHeader
