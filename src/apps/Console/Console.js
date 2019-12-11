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
import ConsoleFeedback from './ConsoleFeedback'
import IconPrompt from './IconPrompt'
import IconEnter from './IconEnter'
import { useWallet } from '../../wallet'
import { encodeFunctionCall, Parse, STAGES } from './utils'
import { log } from '../../utils'
import { AragonType, AppType } from '../../prop-types'

// Maximum time (in milliseconds) to wait for a response
// from the aragon.js apm repo content fetcher
const REPO_FETCH_TIMEOUT = 3000
const ENTER_KEY = 13

function Console({ apps, wrapper }) {
  const [command, setCommand] = useState('')
  const [loading, setLoading] = useState(false)
  const [parsedState, setParsedState] = useState({
    isDisabled: true,
    stage: STAGES.INITIAL_STAGE,
  })
  const theme = useTheme()
  const toast = useToast()
  const { isConnected, web3 } = useWallet()

  useEffect(() => {
    log('apps observable', apps, wrapper)
  }, [apps, wrapper])

  function handleChange(input) {
    const parsingResult = Parse(input)
    setParsedState(parsingResult)
    setCommand(input)
  }

  function handleCommandClick(clickedCommand) {
    const newCommand = `${command}${clickedCommand.toLowerCase()}/`
    const parsingResult = Parse(newCommand)
    setParsedState(parsingResult)
    setCommand(newCommand)
  }

  // Handle console input
  function handleSubmit() {
    if (parsedState.input[0] === 'exec') {
      handleDaoExec(parsedState.input.slice(1))
    } else if (parsedState.input[0] === 'install') {
      handleDaoInstall(parsedState.input.slice(1))
    } else if (parsedState.input[0] === 'act') {
      handleDaoAct(parsedState.input.slice(1))
    } else {
      toast('Unrecognized Command')
      handleChange('')
    }
  }

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
      setLoading(true)
      const [appName, initArgs] = params
      const permIndex = initArgs.indexOf('-p')
      let permParams = []
      let initParams = []

      if (permIndex !== -1) {
        permParams = initArgs
          .split('-p')
          .filter(permission => permission !== '')
          .map(permission => permission.trim(' '))
          .map(permission => permission.split(':'))
      }
      initParams =
        permIndex === -1
          ? initArgs.split(' ').filter(arg => arg !== '')
          : initArgs
              .slice(0, permIndex)
              .split(' ')
              .filter(arg => arg !== '')
      if (initParams.length) {
        permParams.splice(0, 1)
      }

      if (!isConnected) {
        toast('You need to have a Dapp browser extension for this command')
      }

      const kernelProxyAddress = apps.find(
        app => app.name.toLowerCase() === 'kernel'
      ).proxyAddress
      const appId = apps.find(app => app.name.toLowerCase() === appName).appId

      const ensDomain = await wrapper.ens.resolve(appId)

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
      const {
        path: pathForBasket,
        transactions,
      } = await wrapper.getTransactionPathForIntentBasket(intentBasket)
      performIntents(pathForBasket, transactions)
      setLoading(false)
    },
    [toast, apps, wrapper, isConnected, web3, performIntents]
  )
  // Handle DAO execution
  const handleDaoExec = useCallback(
    async params => {
      if (params.length < 2) {
        toast('Not enough arguments for DAO EXEC')
        return
      }
      setLoading(true)
      const [appName, methodSignature, args] = params

      const splitArgs = args
        .split(' ')
        .map(arg => arg.trim(' '))
        .filter(arg => arg !== '')

      apps.find(app => app.name.toLowerCase() === appName)

      const proxyAddress = apps.find(app => app.name.toLowerCase() === appName)
        .proxyAddress
      const path = await wrapper.getTransactionPath(
        proxyAddress,
        methodSignature,
        splitArgs
      )

      performIntents(path)
      setLoading(false)
    },
    [apps, wrapper, toast, performIntents]
  )

  const handleDaoAct = useCallback(
    async params => {
      if (params.length < 2) {
        toast('Not enough arguments for DAO EXEC')
        return
      }
      setLoading(true)
      const [
        selectedAgentInstance,
        targetAddress,
        methodSignature,
        args,
      ] = params

      const splitArgs = args
        .split(' ')
        .map(arg => arg.trim(' '))
        .filter(arg => arg !== '')

      const encodedFunctionCall = encodeFunctionCall(
        methodSignature,
        [...splitArgs],
        web3
      )

      const path = await wrapper.getTransactionPath(
        selectedAgentInstance,
        'execute(address,uint256,bytes)',
        [targetAddress, 0, encodedFunctionCall]
      )

      performIntents(path)
      setLoading(false)
    },
    [toast, wrapper, performIntents, web3]
  )
  const currentStage = parsedState.stage || ''
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
            disabled={parsedState.isDisabled}
            handleChange={handleChange}
            handleDaoAct={handleDaoAct}
            handleDaoExec={handleDaoExec}
            handleDaoInstall={handleDaoInstall}
            handleSubmit={handleSubmit}
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
          <ConsoleFeedback
            stage={currentStage}
            handleCommandClick={handleCommandClick}
            apps={apps}
            loading={loading}
          />
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

function Prompt({ command, disabled, handleChange, handleSubmit }) {
  return (
    <>
      <TextInput
        value={command}
        adornment={<IconPrompt />}
        adornmentPosition="start"
        onChange={e => handleChange(e.target.value)}
        onKeyDown={e => e.keyCode === ENTER_KEY && !disabled && handleSubmit()}
        css={`
          margin-right: ${1.5 * GU}px;
        `}
        wide
      />
      <Button
        mode="strong"
        icon={<IconEnter />}
        label="Execute"
        disabled={disabled}
        onClick={handleSubmit}
      />
    </>
  )
}

Prompt.propTypes = {
  command: PropTypes.string.isRequired,
  disabled: PropTypes.bool.isRequired,
  handleChange: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
}

export default Console
