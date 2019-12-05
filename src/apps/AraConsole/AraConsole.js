import React, { useState, useCallback } from 'react'
import { AragonType } from '../../prop-types'
import { Box, Header, textStyle, GU, TextInput } from '@aragon/ui'

// const DEFAULT_ADDRESS_NAME = '.aragonpm.eth'
// const DEFAULT_VERSION = 'latest'

function AraConsole({ wrapper }) {
  return (
    <>
      <Header primary="Aragon Console" />
      <ConsoleInfo />
      <Console wrapper={wrapper} />
    </>
  )
}

AraConsole.propTypes = {
  wrapper: AragonType,
}

const ENTER_KEY = 13

function Console({ wrapper }) {
  const [command, setCommand] = useState('')

  const handleDaoInstall = useCallback(() => {}, [])
  const handleDaoExec = useCallback(() => {}, [])

  const handleConsoleInput = useCallback(() => {
    console.log(command)
    if (command.toLowercase.contains('dao exec')) {
      handleDaoExec()
    } else if (command.toLowercase.contains('dao install')) {
      handleDaoInstall()
    }
  }, [command, handleDaoExec, handleDaoInstall])

  return (
    <Box heading="Console">
      <TextInput
        value={command}
        onChange={e => setCommand(e.target.value)}
        onKeyDown={e => {
          if (e.keyCode === ENTER_KEY) {
            handleConsoleInput()
          }
        }}
        wide
      />
    </Box>
  )
}

Console.propTypes = {
  wrapper: AragonType,
}

function ConsoleInfo() {
  return (
    <>
      <Box heading="Information">
        <h3
          css={`
            ${textStyle('title3')}
          `}
        >
          Available console commands
        </h3>
        <p
          css={`
            margin-top: ${2 * GU}px;
          `}
        >
          <span
            css={`
              ${textStyle('label1')}
            `}
          >
            Dao Install{' '}
          </span>
          - Can be used to install a new instance of an app in your DAO.
        </p>
        <p
          css={`
            margin-top: ${2 * GU}px;
          `}
        >
          <span
            css={`
              ${textStyle('label1')}
            `}
          >
            Dao exec{' '}
          </span>
          - Performs transactions in your DAO.
        </p>
        <p
          css={`
            margin-top: ${2 * GU}px;
          `}
        >
          <span
            css={`
              ${textStyle('label1')}
            `}
          >
            Dao Act{' '}
          </span>
          - syntax sugar over{' '}
          <span
            css={`
              ${textStyle('label1')}
            `}
          >
            Dao Exec{' '}
          </span>
          for doing transactions with an Agent app instance from your DAO.
        </p>
      </Box>
    </>
  )
}

export default AraConsole
