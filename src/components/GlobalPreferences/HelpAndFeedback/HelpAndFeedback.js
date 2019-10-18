import React, { useCallback } from 'react'
import {
  Box,
  Button,
  GU,
  Info,
  Link,
  Switch,
  textStyle,
  useLayout,
  useTheme,
} from '@aragon/ui'
import { clearCache } from '../../../utils'
import { useHelpScout } from '../../HelpScoutBeacon/useHelpScout'
import helpAndFeedbackPng from './assets/help-and-feedback.png'

function HelpAndFeedback() {
  const theme = useTheme()
  const { layoutName } = useLayout()
  const { optedOut, setOptedOut } = useHelpScout()

  const handleOptOutChange = useCallback(() => setOptedOut(!optedOut), [
    setOptedOut,
    optedOut,
  ])

  const handleClearCache = useCallback(async () => {
    await clearCache()
    window.location.reload()
  }, [])

  return (
    <React.Fragment>
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
            `}
          >
            <span
              css={`
                flex-shrink: 0;
                margin-top: ${0.5 * GU}px;
              `}
            >
              <Switch onChange={handleOptOutChange} checked={!optedOut} />
            </span>
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
          Help Scout lets you easily browse the knowledge base and open tickets
          so you can get support when using Aragon organizations. Disabling it
          will disable that functionality as well.
        </Info>
      </Box>
      <Box heading="Troubleshooting">
        <div
          css={`
            margin-bottom: ${2 * GU}px;
          `}
        >
          <span>
            Press this button to refresh the data stored by the application in
            your browser.
          </span>
        </div>
        <Button
          onClick={handleClearCache}
          wide={layoutName === 'small'}
          css={`
            margin-bottom: ${2 * GU}px;
          `}
        >
          Clear application data
        </Button>
        <Info>
          This will only delete the data stored in your browser by the
          application. No data related to the organization itself will be
          altered. You might want to <Link>export your custom labels</Link>{' '}
          before proceeding.
        </Info>
      </Box>
    </React.Fragment>
  )
}

export default React.memo(HelpAndFeedback)
