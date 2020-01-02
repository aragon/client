import React from 'react'
import PropTypes from 'prop-types'
import { GU, Help, Inside, Radio, unselectable, useTheme } from '@aragon/ui'

const RadioCardItem = React.memo(function RadioCardItem({
  description,
  helpHint,
  helpText,
  illustration,
  index,
  title,
}) {
  const theme = useTheme()

  return (
    <label
      css={`
        display: flex;
        align-items: center;
        ${unselectable()};
        & + & {
          margin-top: ${2 * GU}px;
        }
      `}
    >
      <Radio
        id={index}
        css={`
          flex-shrink: 0;
          margin-top: ${2 * GU}px;
        `}
      />
      <div
        css={`
          background-color: ${theme.surface};
          display: flex;
          flex-grow: 1;
          margin-left: 12px;
          padding: 63px 24px;
          box-shadow: 0px 2px 4px rgba(221, 228, 233, 0.5);
          border-radius: 4px;
          transition: border 100ms ease-in-out;
          cursor: pointer;
          border: 1px ${theme.border} solid;
          &:hover {
            border-color: ${theme.accent.alpha(0.35)};
          }
        `}
      >
        <img
          src={illustration}
          alt=""
          height="120"
          css={`
            padding-right: 24px;
          `}
        />
        <div>
          <h1
            css={`
              display: flex;
              align-items: center;
              height: ${4 * GU}px;
            `}
          >
            <Inside name="Box:heading">
              {title} {helpText && <Help hint={helpHint}>{helpText}</Help>}
            </Inside>
          </h1>
          <div
            css={`
              margin-top: ${0.5 * GU}px;
              color: ${theme.surfaceContentSecondary};
            `}
          >
            {description}
          </div>
        </div>
      </div>
    </label>
  )
})

RadioCardItem.propTypes = {
  description: PropTypes.string.isRequired,
  helpHint: PropTypes.string,
  helpText: PropTypes.string,
  illustration: PropTypes.string.isRequired,
  index: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
}

RadioCardItem.defaultProps = {
  helpHint: '',
}

export default RadioCardItem
