import React, { useCallback } from 'react'
import PropTypes from 'prop-types'
import { Box, Switch, Info, Link, GU, textStyle, useTheme } from '@aragon/ui'
import { useHelpScout } from '../../HelpScoutBeacon/useHelpScout'
import helpAndFeedbackPng from './assets/help-and-feedback.png'
import { useConsole } from '../../../apps/Console/useConsole'
import { getAppPath } from '../../../routing'

function HelpAndFeedback({ historyPush, locator, onClose }) {
  const theme = useTheme()
  const { optedOut, setOptedOut } = useHelpScout()
  const {
    optedOut: optedOutFromConsole,
    setOptedOut: setOptedOutFromConsole,
  } = useConsole()

  const handleOptOutChange = useCallback(() => setOptedOut(!optedOut), [
    setOptedOut,
    optedOut,
  ])

  const handleOptOutConsoleChange = useCallback(
    () => setOptedOutFromConsole(!optedOutFromConsole),
    [optedOutFromConsole, setOptedOutFromConsole]
  )

  const handleConsoleLinkClick = useCallback(() => {
    onClose()
    historyPush(
      getAppPath({
        dao: locator.dao,
        instanceId: 'console',
      })
    )
  }, [historyPush, locator, onClose])

  return (
    <>
      <Box heading="Help Scout">
        <img
          src={helpAndFeedbackPng}
          alt="Help Scout"
          css={`
            display: block;
            margin: 0 auto;
            margin-bottom: ${5 * GU}px;
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
              cursor: pointer;
              display: flex;
              align-items: center;
              margin-bottom: ${2 * GU}px;
            `}
          >
            <Switch
              onChange={handleOptOutConsoleChange}
              checked={!optedOutFromConsole}
            />
            <span
              css={`
                color: ${theme.surfaceContentSecondary};
                padding-left: ${1.5 * GU}px;
                align-items: center;
                ${textStyle('title4')}
              `}
            >
              Display the <Link onClick={handleConsoleLinkClick}>console</Link>{' '}
              in the System apps menu
            </span>
          </label>
          <Info>
            The embedded console lets you interact with your DAO as you would
            with Aragon CLI, but inside the client. Be noted that this feature
            is highly experimental.
          </Info>
        </div>
      </Box>
    </>
  )
}

HelpAndFeedback.propTypes = {
  historyPush: PropTypes.func,
  onClose: PropTypes.func,
  locator: PropTypes.object,
}

export default React.memo(HelpAndFeedback)
