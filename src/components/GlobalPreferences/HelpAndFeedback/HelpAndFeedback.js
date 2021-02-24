import React, { useCallback } from 'react'
import { Box, Switch, Info, Link, GU, textStyle, useTheme } from '@aragon/ui'
import { useRouting } from '../../../routing'
import { useHelpScout } from '../../HelpScoutBeacon/useHelpScout'
import helpAndFeedbackPng from './assets/help-and-feedback.png'
import { useConsole } from '../../../apps/Console/useConsole'

function HelpAndFeedback() {
  const theme = useTheme()
  const routing = useRouting()
  const { optedOut, setOptedOut } = useHelpScout()
  const { consoleVisible, setConsoleVisible } = useConsole()

  const toggleOptedOut = useCallback(() => {
    setOptedOut(optedOut => !optedOut)
  }, [setOptedOut])

  const toggleConsole = useCallback(() => {
    setConsoleVisible(visible => !visible)
  }, [setConsoleVisible])

  const handleConsoleLinkClick = useCallback(() => {
    routing.update(({ mode }) => ({
      mode: {
        ...mode,
        instanceId: 'console',
      },
      preferences: {},
    }))
  }, [routing])

  return (
    <>
      <Box heading="Help Scout">
        <img
          src={helpAndFeedbackPng}
          alt="Help Scout"
          css={`
            display: block;
            margin: 0 auto;
            margin-bottom: ${7 * GU}px;
            margin-top: ${4 * GU}px;
            width: 300px;
            height: 156px;
          `}
        />
        <div
          css={`
            display: flex;
            margin-bottom: ${2 * GU}px;
          `}
        >
          <label
            css={`
              display: flex;
              align-items: center;
            `}
          >
            <Switch onChange={toggleOptedOut} checked={!optedOut} />
            <span
              css={`
                color: ${theme.surfaceContent};
                padding-left: ${1.5 * GU}px;
                ${textStyle('body2')}
              `}
            >
              Allow Help Scout feedback module
            </span>
          </label>
        </div>
        <Info>
          Help Scout lets you easily browse the knowledge base and open tickets
          so you can get support when using Aragon organizations. Disabling it
          will disable that functionality as well.
        </Info>
      </Box>
      <Box heading="Embedded Console">
        <div
          css={`
            display: flex;
            flex-direction: column;
            justify-content: center;
          `}
        >
          <label
            css={`
              display: flex;
              align-items: center;
              margin-bottom: ${2 * GU}px;
            `}
          >
            <Switch onChange={toggleConsole} checked={consoleVisible} />
            <span
              css={`
                color: ${theme.surfaceContent};
                padding-left: ${1.5 * GU}px;
                align-items: center;
                ${textStyle('body2')}
              `}
            >
              Display the{' '}
              {routing.locator.mode.name === 'org' ? (
                <Link onClick={handleConsoleLinkClick}>console</Link>
              ) : (
                <>console</>
              )}{' '}
              in the System apps menu
            </span>
          </label>
          <Info>
            <p>
              The embedded console lets you interact with your organization as
              you would with aragonCLI, but inside the frontend client.
            </p>
            <p
              css={`
                margin-top: ${1 * GU}px;
              `}
            >
              Note that this feature is currently experimental. Please read the{' '}
              <Link
                external
                href="https://github.com/aragon/aragon/blob/master/docs/CONSOLE.md"
              >
                documentation
              </Link>
              .
            </p>
          </Info>
        </div>
      </Box>
    </>
  )
}

export default React.memo(HelpAndFeedback)
