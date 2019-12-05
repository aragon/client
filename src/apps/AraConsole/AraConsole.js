import React, { useState, useEffect, useCallback } from 'react'
import PropTypes from 'prop-types'
import { Box, Header, textStyle, GU, TextInput, useToast } from '@aragon/ui'
import { AragonType, AppType } from '../../prop-types'
import { log } from '../../utils'

function AraConsole({ apps, wrapper }) {
  return (
    <>
      <Header primary="Aragon Console" />
      <ConsoleInfo />
      <Console apps={apps} wrapper={wrapper} />
    </>
  )
}

AraConsole.propTypes = {
  apps: PropTypes.arrayOf(AppType).isRequired,
  wrapper: AragonType,
}

const ENTER_KEY = 13

function Console({ apps, wrapper }) {
  const [command, setCommand] = useState('')
  useEffect(() => {
    log('apps observable', apps, wrapper)
  }, [apps, wrapper])
  const toast = useToast()

  const handleDaoInstall = useCallback(() => {
    toast('DAO Install')
  }, [toast])

  // Handle DAO execution
  const handleDaoExec = useCallback(
    async params => {
      if (params.length < 3) {
        toast('Not enough arguments for DAO EXEC')
        return
      }
      const [appName, methodSignature, ...args] = params
      log(params)
      const proxyAddress = apps.filter(app => {
        return app.name.toLowerCase() === appName
      })[0].proxyAddress
      log(proxyAddress)
      const path = await wrapper.getTransactionPath(
        proxyAddress,
        methodSignature,
        args
      )

      // futureAppAddr = await wrapper.kernelProxy.call('newAppInstance', appId, appCode, ...)

      if (Array.isArray(path) && path.length) {
        const transId = await wrapper.performTransactionPath(path)
        log(transId)
      }
      log('trans path', path)
    },
    [apps, wrapper, toast]
  )

  // dao exec tokens mint 0x5790dB5E4D9e868BB86F5280926b9838758234DD 1000
  // Handle console input
  const handleConsoleInput = useCallback(() => {
    console.log(command)
    if (command.includes('dao exec')) {
      handleDaoExec(command.split(' ').slice(2))
    } else if (command.includes('dao install')) {
      handleDaoInstall()
    } else {
      toast('Unrecognized Command')
      setCommand('')
    }
  }, [command, handleDaoExec, handleDaoInstall, toast])

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
  apps: PropTypes.arrayOf(AppType).isRequired,
  wrapper: AragonType,
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
