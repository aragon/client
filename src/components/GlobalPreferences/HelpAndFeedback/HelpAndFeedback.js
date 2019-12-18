import React, { useCallback } from 'react'
import PropTypes from 'prop-types'
import { Box, Switch, Info, Button, GU, textStyle, useTheme } from '@aragon/ui'
import { useHelpScout } from '../../HelpScoutBeacon/useHelpScout'
import helpAndFeedbackPng from './assets/help-and-feedback.png'
import { getAppPath } from '../../../routing'

function HelpAndFeedback({ historyPush, onClose, locator }) {
  const theme = useTheme()
  const { optedOut, setOptedOut } = useHelpScout()
  const handleOptOutChange = useCallback(() => setOptedOut(!optedOut), [
    setOptedOut,
    optedOut,
  ])

  const handleGoToEmbeddedConsole = useCallback(() => {
    onClose()
    historyPush(
      getAppPath({
        dao: locator.dao,
        instanceId: 'console',
      })
    )
  }, [onClose, historyPush, locator.dao])

  return (
    <>
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
          `}
        >
          <Button
            css={`
              margin-bottom: ${GU}px;
            `}
            label="Go to the embedded console"
            mode="strong"
            onClick={handleGoToEmbeddedConsole}
          />
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
