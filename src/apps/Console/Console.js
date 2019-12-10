import React, { useState, useEffect, useCallback } from 'react'
import PropTypes from 'prop-types'
import {
  Box,
  Header,
  Button,
  Info,
  TextInput,
  useTheme,
  useToast,
  GU,
} from '@aragon/ui'
import IconPrompt from './IconPrompt'
import IconEnter from './IconEnter'
import { useWallet } from '../../wallet'
import { encodeFunctionCall, Parse } from './utils'
import { log } from '../../utils'
import { AragonType, AppType } from '../../prop-types'

// Maximum time (in milliseconds) to wait for a response
// from the aragon.js apm repo content fetcher
const REPO_FETCH_TIMEOUT = 3000
const ENTER_KEY = 13
const KNOWN_COMMANDS = ['install', 'exec', 'act']
const KNOWN_APPS = ['voting', 'finance', 'vault', 'agent', 'tokens']

function Console({ apps, wrapper }) {
  const [command, setCommand] = useState('')
  const theme = useTheme()

  useEffect(() => {
    log('apps observable', apps, wrapper)
  }, [apps, wrapper])

  const toast = useToast()
  const { isConnected, web3 } = useWallet()

  const performIntents = useCallback(
    async (intentPaths, transactionPaths) => {
      if (Array.isArray(intentPaths) && intentPaths.length) {
        const transId = await wrapper.performTransactionPath(intentPaths)
        log(transId)
      } else if (Array.isArray(transactionPaths) && transactionPaths.length) {
        for (const transaction of transactionPaths) {
          await wrapper.performTransactionPath([transaction])
        }
      } else {
        await wrapper.performTransactionPath([])
      }
    },
    [wrapper]
  )

  const handleDaoInstall = useCallback(
    async params => {
      const [appName, ...initArgs] = params
      const permIndex = initArgs.indexOf('-p')
      let permParams = []
      let initParams = []

      if (permIndex !== -1) {
        permParams = initArgs
          .slice(permIndex + 1)
          .map(permission => permission.split(':'))
      }
      initParams =
        permIndex === -1 ? [...initArgs] : initArgs.slice(0, permIndex)
      log('initParams', initParams)

      if (!isConnected) {
        toast('You need to have a Dapp browser extension for this command')
      }

      const kernelProxyAddress = apps.find(
        app => app.name.toLowerCase() === 'kernel'
      ).proxyAddress

      const appId = apps.find(app => app.name.toLowerCase() === appName).appId

      const ensDomain = await wrapper.ens.resolve(appId)
      log('ensDomain', ensDomain)

      const repoContent = await wrapper.apm.fetchLatestRepoContent(ensDomain, {
        fetchTimeout: REPO_FETCH_TIMEOUT,
      })
      const { abi, contractAddress, roles } = repoContent

      const { name, type, inputs } = abi.find(
        ({ name }) => name === 'initialize'
      )

      const encodedInitializeFunc = web3.eth.abi.encodeFunctionCall(
        {
          name,
          type,
          inputs,
        },
        [...initParams]
      )

      const path = await wrapper.getTransactionPath(
        kernelProxyAddress,
        'newAppInstance(bytes32,address,bytes,bool)',
        [appId, contractAddress, encodedInitializeFunc, false]
      )

      // Get the second to last item in the path, as it is the account that will execute kernel.newAppInstance
      const scriptExecutor = path[path.length - 2].to
      const counterfactualAppAddr = await wrapper.kernelProxy.call(
        'newAppInstance',
        appId,
        contractAddress,
        encodedInitializeFunc,
        false,
        { from: scriptExecutor }
      )

      const installAppIntent = [
        [
          kernelProxyAddress,
          'newAppInstance(bytes32,address,bytes,bool)',
          [appId, contractAddress, encodedInitializeFunc, false],
        ],
      ]

      const aclProxyAddress = apps.find(app => app.name.toLowerCase() === 'acl')
        .proxyAddress

      const permissionIntents = permParams.map(([role, from, to]) => {
        const roleBytes = roles.find(availableRole => availableRole.id === role)
          .bytes

        return [
          aclProxyAddress,
          'createPermission',
          [to, counterfactualAppAddr, roleBytes, from],
        ]
      })

      const intentBasket = [...installAppIntent, ...permissionIntents]
      log(intentBasket, permissionIntents)
      const {
        path: pathForBasket,
        transactions,
      } = await wrapper.getTransactionPathForIntentBasket(intentBasket)
      log('DONE', pathForBasket, transactions)
      performIntents(path, transactions)
    },
    [toast, apps, wrapper, isConnected, web3, performIntents]
  )
  // Handle DAO execution
  const handleDaoExec = useCallback(
    async params => {
      if (params.length < 3) {
        toast('Not enough arguments for DAO EXEC')
        return
      }
      const [appName, methodSignature, ...args] = params
      log('params', appName, methodSignature, args)
      apps.find(app => {
        console.log(`comparing ${app.name.toLowerCase()} to ${appName}`)
        return app.name.toLowerCase() === appName
      })

      const proxyAddress = apps.find(app => app.name.toLowerCase() === appName)
        .proxyAddress
      const path = await wrapper.getTransactionPath(
        proxyAddress,
        methodSignature,
        args
      )

      performIntents(path)
      log('trans path', path)
    },
    [apps, wrapper, toast, performIntents]
  )

  const handleDaoAct = useCallback(
    async params => {
      if (params.length < 3) {
        toast('Not enough arguments for DAO EXEC')
        return
      }

      const [
        selectedAgentInstance,
        targetAddress,
        methodSignature,
        ...args
      ] = params

      const encodedFunctionCall = encodeFunctionCall(methodSignature, [...args])

      const path = await wrapper.getTransactionPath(
        selectedAgentInstance,
        'execute(address,uint256,bytes)',
        [targetAddress, 0, encodedFunctionCall]
      )

      performIntents(path)
    },
    [toast, wrapper, performIntents]
  )

  return (
    <>
      <Header primary="Console" />
      <Box>
        <div
          css={`
            display: flex;
          `}
        >
          <Prompt
            command={command}
            onChange={setCommand}
            handleDaoAct={handleDaoAct}
            handleDaoExec={handleDaoExec}
            handleDaoInstall={handleDaoInstall}
          />
        </div>
        <Info
          css={`
            margin: ${2 * GU}px 0 ${2 * GU}px 0;
          `}
          background={`${theme.background}`}
          borderColor={`#ABBECF`}
          color={`${theme.content}`}
        >
          Available commands
        </Info>
        <Info
          css={`
            margin-top: ${2 * GU}px;
          `}
        >
          You can use the top/down arrow on your keyboard to display the console
          history.
        </Info>
      </Box>
    </>
  )
}

Console.propTypes = {
  apps: PropTypes.arrayOf(AppType).isRequired,
  wrapper: AragonType,
}

function Prompt({
  command,
  onChange,
  handleDaoAct,
  handleDaoExec,
  handleDaoInstall,
}) {
  const toast = useToast()
  // Handle console input
  function handleConsoleInput() {
    if (command.includes('exec')) {
      handleDaoExec(command.split(' ').slice(2))
    } else if (command.includes('install')) {
      handleDaoInstall(command.split(' ').slice(2))
    } else if (command.includes('act')) {
      handleDaoAct()
    } else {
      toast('Unrecognized Command')
      onChange('')
    }
  }

  return (
    <>
      <TextInput
        value={command}
        adornment={<IconPrompt />}
        adornmentPosition="start"
        onChange={e => onChange(e.target.value)}
        onKeyDown={e => e.keyCode === ENTER_KEY && handleConsoleInput()}
        css={`
          margin-right: ${1.5 * GU}px;
        `}
        wide
      />
      <Button
        mode="strong"
        icon={<IconEnter />}
        label="Execute"
        onClick={handleConsoleInput}
      />
    </>
  )
}

Prompt.propTypes = {
  command: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  handleDaoAct: PropTypes.func.isRequired,
  handleDaoExec: PropTypes.func.isRequired,
  handleDaoInstall: PropTypes.func.isRequired,
}

export default Console
