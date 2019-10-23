import React, { useCallback } from 'react'
import { Box, Switch, Info, GU, textStyle, useTheme } from '@aragon/ui'
import { useHelpScout } from '../../HelpScoutBeacon/useHelpScout'
import helpAndFeedbackPng from './assets/help-and-feedback.png'

function HelpAndFeedback() {
  const theme = useTheme()
  const { optedOut, setOptedOut } = useHelpScout()
  const handleOptOutChange = useCallback(() => setOptedOut(!optedOut), [
    setOptedOut,
    optedOut,
  ])

  return (
    <Box heading="Help Scout">
      <div
        css={`
          display: flex;
          justify-content: center;
          margin-bottom: ${4 * GU}px;
        `}
      >
        <label
          css={`
            cursor: pointer;
            display: flex;
            align-items: center;
          `}
        >
          <Switch onChange={handleOptOutChange} checked={!optedOut} />
          <span
            css={`
              color: ${theme.surfaceContentSecondary};
              padding-left: ${1.5 * GU}px;
              ${textStyle('title4')}
            `}
          >
            Allow Help Scout feedback module
          </span>
        </label>
      </div>
      <img
        src={helpAndFeedbackPng}
        alt="Help Scout"
        css={`
          display: block;
          margin: 0 auto;
          margin-bottom: ${4 * GU}px;
          width: 300px;
          height: 156px;
        `}
      />
      <Info>
        Help Scout lets you easily browse the knowledge base and open tickets so
        you can get support when using Aragon organizations. Disabling it will
        disable that functionality as well.
      </Info>
    </Box>
  )
}

export default React.memo(HelpAndFeedback)
