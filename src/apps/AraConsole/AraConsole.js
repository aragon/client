import React, { useState, useEffect, useCallback } from 'react'
import PropTypes from 'prop-types'
import { Box, Header, textStyle, GU, TextInput, useToast } from '@aragon/ui'
import Web3 from 'web3'
import { AragonType, AppType } from '../../prop-types'
import { log } from '../../utils'
import { getInjectedProvider } from '../../web3-utils'
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

  const handleDaoInstall = useCallback(
    async params => {
      // we need to create an array of intents for the install calls
      // 1 - call newAppInstance & initialize (will be done on the same call)
      // 2 - get contract address & set permissions

      // testing impl for now with just creating the app instance & init
      const [appName, ...initArgs] = params
      const web3 = new Web3(getInjectedProvider())
      console.log(web3)

      if (!web3) {
        toast('You need to have a Dapp browser extension for this command')
      }
      log('initArgs', initArgs)

      const abiEntries = apps.filter(
        app => app.name.toLowerCase() === appName
      )[0].abi
      log('abiEntries', abiEntries)
      const inputs = abiEntries.filter(
        abiEntry => abiEntry.name === 'initialize'
      )[0].inputs
      log('inputs', inputs)

      const kernelProxyAddress = apps.filter(
        app => app.name.toLowerCase() === 'kernel'
      )[0].proxyAddress

      const appId = apps.filter(app => app.name.toLowerCase() === appName)[0]
        .appId
      // const

      const ensDomain = await wrapper.ens.resolve(appId)
      log('ensDomain', ensDomain)
      const { abi, contractAddress } = await wrapper.apm.fetchLatestRepoContent(
        ensDomain,
        {
          fetchTimeout: 3000,
        }
      )
      const initializeAbi = abi.find(({ name }) => name === 'initialize')

      const encodedInitializeFunc = web3.eth.abi.encodeFunctionCall(
        initializeAbi,
        [...initArgs]
      )
      log('encoded', encodedInitializeFunc)

      // we actually need to get an intent basket
      const path = await wrapper.getTransactionPath(
        kernelProxyAddress,
        'newAppInstance',
        [appId, contractAddress]
      )

      log('path', path)

      // Get the second to last item in the path, as it is the account that will execute kernel.newAppInstance
      const scriptExecutor = path[path.length - 2].to
      const counterfactualAppAddr = await wrapper.kernelProxy.call(
        'newAppInstance',
        appId,
        contractAddress,
        '0x',
        false,
        { from: scriptExecutor }
      )

      log('counter', counterfactualAppAddr)

      if (Array.isArray(path) && path.length) {
        const transId = await wrapper.performTransactionPath(path)
        log(transId)
      } else {
        await wrapper.performTransactionPath([])
      }
      log('trans path', path)

      // todo create permission
      // dao install vault -p TRANSFER_TOKENS_ROLE 0xab 0xcd -p X_ROLE 0x12 0x34
    },
    [toast, apps, wrapper]
  )

  // Handle DAO execution
  const handleDaoExec = useCallback(
    async params => {
      if (params.length < 3) {
        toast('Not enough arguments for DAO EXEC')
        return
      }
      const [appName, methodSignature, ...args] = params
      log(params)
      const proxyAddress = apps.filter(
        app => app.name.toLowerCase() === appName
      )[0].proxyAddress
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
      } else {
        await wrapper.performTransactionPath([])
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
      handleDaoInstall(command.split(' ').slice(2))
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
