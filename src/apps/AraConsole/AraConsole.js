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
      // we need to create an array of intents (intent basket) for the install calls
      // 1 - call newAppInstance & initialize
      // 2 - get contract address & set permissions

      // process the initArgs
      const [appName, ...initArgs] = params
      const permIndex = initArgs.indexOf('-p')
      let permParams = []
      let initParams = []
      if (permIndex !== -1) {
        permParams = initArgs
          .slice(permIndex + 1)
          .map(permission => permission.split(':'))
      }
      initParams = initArgs.slice(0, permIndex)

      log('permParams', permParams, initParams)
      const web3 = new Web3(getInjectedProvider())

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

      const appId = apps.find(app => app.name.toLowerCase() === appName).appId

      const ensDomain = await wrapper.ens.resolve(appId)
      log('ensDomain', ensDomain)
      const repoContent = await wrapper.apm.fetchLatestRepoContent(ensDomain, {
        fetchTimeout: 3000,
      })
      const { abi, contractAddress, roles } = repoContent
      log('roles', roles)
      const initializeAbi = abi.find(({ name }) => name === 'initialize')
      log('repoContent', repoContent)
      const encodedInitializeFunc = web3.eth.abi.encodeFunctionCall(
        initializeAbi,
        [...initParams]
      )
      log('encoded', encodedInitializeFunc)

      const path = await wrapper.getTransactionPath(
        kernelProxyAddress,
        'newAppInstance',
        [appId, contractAddress]
      )

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

      const installAppIntent = [
        [kernelProxyAddress, 'newAppInstance', [appId, contractAddress]],
      ]

      const aclProxyAddress = apps.find(app => app.name.toLowerCase() === 'acl')
        .proxyAddress
      log('aclProxy', aclProxyAddress)
      const permissionIntents = permParams.map(([role, from, to]) => {
        const roleBytes = apps
          .find(app => app.name.toLowerCase() === appName)
          .roles.find(availableRole => availableRole.id === role).bytes
        return [
          aclProxyAddress,
          'createPermission',
          [to, counterfactualAppAddr, roleBytes, from],
        ]
      })
      log('permissionIntents', permissionIntents)
      const intentBasket = [...installAppIntent, ...permissionIntents]
      log('intentbasket', intentBasket)
      const {
        pathForBasket,
        transactions,
      } = await wrapper.getTransactionPathForIntentBasket(intentBasket)
      log('DONE', pathForBasket, transactions)
      if (Array.isArray(pathForBasket) && pathForBasket.length) {
        const transId = await wrapper.performTransactionPath(pathForBasket)
        log(transId)
      } else if (Array.isArray(transactions) && transactions.length) {
        for (const transaction of transactions) {
          await wrapper.performTransactionPath([transaction])
        }
      } else {
        await wrapper.performTransactionPath([])
      }
      log('trans pathForBasket', pathForBasket)
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

  // Handle console input
  const handleConsoleInput = useCallback(() => {
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
