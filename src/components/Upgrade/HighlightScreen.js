import React from 'react'
import PropTypes from 'prop-types'
import { Button } from '@aragon/ui'

// Ratios based on the the design files
export const RATIO_LEFT = 500 / 1055
export const RATIO_TOP = 560 / 950

const HighlightScreen = ({
  compactMode,
  description,
  onUpgrade,
  title,
  upgrade,
  verticalMode,
  visual,
}) => (
  <div
    css={`
      flex-shrink: 0;
      width: 100%;
      height: ${verticalMode ? 'auto' : '100%'};
      display: flex;
      flex-direction: ${verticalMode ? 'column-reverse' : 'row'};
      justify-content: ${verticalMode ? 'flex-end' : 'flex-start'};
      align-items: center;
      text-align: ${verticalMode ? 'center' : 'left'};
    `}
  >
    <div
      css={`
        flex-shrink: 0;
        width: ${verticalMode ? 'auto' : `${RATIO_LEFT * 100}%`};
        height: ${verticalMode ? 'auto' : '100%'};
        padding: ${verticalMode ? '30px 20px 90px' : '10vh 60px 90px'};
        max-width: ${verticalMode ? '420px' : 'none'};
        display: flex;
        flex-direction: column;
      `}
    >
      <p
        css={`
          color: rgba(0, 0, 0, 0.5);
          text-transform: uppercase;
          font-size: ${compactMode ? 12 : 16}px;
        `}
      >
        New Bella 0.7
      </p>
      <h1
        css={`
          font-size: ${compactMode ? 30 : 42}px;
          line-height: 1.6;
          margin: 10px 0 10px;
        `}
      >
        {compactMode && (title.small || title.large)}
      </h1>
      <p
        css={`
          line-height: 1.8;
          font-size: ${compactMode ? 16 : 18}px;
          color: ${compactMode ? '#8E97B5' : '#000000'};
        `}
      >
        {compactMode && description.small
          ? description.small
          : description.large}
      </p>
      {upgrade && (
        <div css="margin-top: 30px">
          <Button
            wide
            mode="strong"
            onClick={onUpgrade}
            css={`
              height: 56px;
              font-size: 18px;
              font-weight: 600;
            `}
          >
            {compactMode && upgrade.small ? upgrade.small : upgrade.large}
          </Button>
        </div>
      )}
    </div>
    <div
      css={`
        flex-shrink: 1;
        width: 100%;
        height: ${verticalMode ? `${RATIO_TOP * 100}%` : '100%'};
        background: ${`
          ${visual.color}
          ${verticalMode ? '50% 40%' : '0 50%'} / cover
          url(${compactMode && visual.small ? visual.small : visual.large})
          no-repeat
        `};
      `}
    />
  </div>
)

HighlightScreen.propTypes = {
  compactMode: PropTypes.bool,
  description: PropTypes.shape({
    small: PropTypes.string,
    large: PropTypes.string.isRequired,
  }),
  onUpgrade: PropTypes.func.isRequired,
  title: PropTypes.shape({
    small: PropTypes.string,
    large: PropTypes.string.isRequired,
  }),
  upgrade: PropTypes.shape({
    small: PropTypes.string,
    large: PropTypes.string.isRequired,
  }).isRequired,
  verticalMode: PropTypes.bool,
  visual: PropTypes.shape({
    small: PropTypes.string,
    large: PropTypes.string.isRequired,
    color: PropTypes.string.isRequired,
  }).isRequired,
}

export default HighlightScreen
