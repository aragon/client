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
import { hash } from 'eth-ens-namehash'
import ConsoleFeedback from './ConsoleFeedback'
import IconPrompt from './IconPrompt'
import IconEnter from './IconEnter'
import { useWallet } from '../../wallet'
import {
  encodeFunctionCall,
  parseCommand,
  parseMethodCall,
  parseInitParams,
  parsePermissions,
} from './utils'
import { log } from '../../utils'
import { AragonType, AppType } from '../../prop-types'

// Maximum time (in milliseconds) to wait for a response
// from the aragon.js apm repo content fetcher
const REPO_FETCH_TIMEOUT = 3000
const ENTER_KEY = 13
const UP_KEY = 38
const DOWN_KEY = 40
const APP_POSTFIX = '.aragonpm.eth'

function Console({ apps, wrapper }) {
  const [command, setCommand] = useState('')
  const [commandHistory, setCommandHistory] = useState([])
  const [currentHistory, setCurrentHistory] = useState(0)
  const [loading, setLoading] = useState(false)
  const [parsedState, setParsedState] = useState([])
  const theme = useTheme()
  const toast = useToast()
  const { isConnected, web3 } = useWallet()

  useEffect(() => {
    log('apps observable', apps, wrapper)
  }, [apps, wrapper, parsedState])

  function handleChange(input) {
    const parsingResult = parseCommand(input)
    log(parsingResult)
    setParsedState(parsingResult)
    setCommand(input)
  }

  function handleCommandClick(clickedCommand) {
    const newCommand = `${command}${clickedCommand.toLowerCase()}/`
    const parsingResult = parseCommand(newCommand)
    setParsedState(parsingResult)
    setCommand(newCommand)
  }

  // Handle console input
  function handleSubmit() {
    if (parsedState[0] === 'exec') {
      handleDaoExec(parsedState.slice(1))
    } else if (parsedState[0] === 'install') {
      handleDaoInstall(parsedState.slice(1))
    } else if (parsedState[0] === 'act') {
      handleDaoAct(parsedState.slice(1))
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
      try {
        if (!isConnected) {
          toast('You need to have a Dapp browser extension for this command')
          setLoading(false)
          return
        }
        // Get & properly parse arguments
        const [appName, initArgs, permArgs] = params
        const parsedInitArgs = parseInitParams(initArgs)
        const parsedPermArgs = parsePermissions(permArgs)
        // Resolve namehash and ens domain to fetch the app's repo content
        const appId = hash(`${appName}${APP_POSTFIX}`)
        const ensDomain = await wrapper.ens.resolve(appId)
        const {
          abi,
          contractAddress,
          roles,
        } = await wrapper.apm.fetchLatestRepoContent(ensDomain, {
          fetchTimeout: REPO_FETCH_TIMEOUT,
        })
        // get the initialize function to properly install the app
        const { name, type, inputs } = abi.find(
          ({ name }) => name === 'initialize'
        )

        const functionObject = {
          name: name,
          type: type,
          inputs: inputs,
        }
        const encodedInitializeFunc = web3.eth.abi.encodeFunctionCall(
          functionObject,
          parsedInitArgs
        )

        const kernelProxyAddress = apps.find(
          app => app.name.toLowerCase() === 'kernel'
        ).proxyAddress

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

        const aclProxyAddress = apps.find(
          app => app.name.toLowerCase() === 'acl'
        ).proxyAddress

        const permissionIntents = parsedPermArgs.map(([role, from, to]) => {
          const roleBytes = roles.find(
            availableRole => availableRole.id === role
          ).bytes

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
      } catch (error) {
        console.error(error)
        toast('Command execution failed')
      } finally {
        setLoading(false)
      }
    },
    [toast, apps, wrapper, isConnected, web3, performIntents]
  )
  // Handle DAO execution
  const handleDaoExec = useCallback(
    async params => {
      try {
        setLoading(true)
        const [proxyAddress, methodWithArgs] = params
        const [methodSignature, args] = parseMethodCall(methodWithArgs)
        log('utility method', methodSignature, args)
        const path = await wrapper.getTransactionPath(
          proxyAddress,
          methodSignature,
          args
        )

        performIntents(path)
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    },
    [wrapper, performIntents]
  )

  const handleDaoAct = useCallback(
    async params => {
      try {
        setLoading(true)
        const [selectedAgentInstance, targetAddress, methodWithArgs] = params
        const [methodName, methodParams, methodArgs] = parseMethodCall(
          methodWithArgs
        )
        const methodSignature = `${methodName}(${methodParams.join(',')})`
        const encodedFunctionCall = encodeFunctionCall(
          methodSignature,
          methodArgs,
          web3
        )

        const path = await wrapper.getTransactionPath(
          selectedAgentInstance,
          'execute(address,uint256,bytes)',
          [targetAddress, 0, encodedFunctionCall]
        )

        performIntents(path)
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    },
    [wrapper, performIntents, web3]
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
            handleChange={handleChange}
            handleDaoAct={handleDaoAct}
            handleDaoExec={handleDaoExec}
            handleDaoInstall={handleDaoInstall}
            handleSubmit={handleSubmit}
            commandHistory={commandHistory}
            currentHistory={currentHistory}
            setCommandHistory={setCommandHistory}
            setCurrentHistory={setCurrentHistory}
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
            currentParsedCommand={parsedState}
            handleCommandClick={handleCommandClick}
            apps={apps}
            loading={loading}
          />
        </Info>
        {!loading && (
          <Info
            css={`
              margin-top: ${2 * GU}px;
            `}
          >
            You can use the top/down arrow on your keyboard to display the
            console history.
          </Info>
        )}
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
  handleChange,
  handleSubmit,
  commandHistory,
  currentHistory,
  setCommandHistory,
  setCurrentHistory,
}) {
  function isDisabled() {
    const parsedCommand = parseCommand(command)
    const isValidInstall =
      parsedCommand[0] === 'install' && parsedCommand.length === 4
    const isValidExec =
      parsedCommand[0] === 'exec' && parsedCommand.length === 3
    const isValidAct = parsedCommand[0] === 'act' && parsedCommand.length === 4
    return !(isValidInstall || isValidExec || isValidAct)
  }
  return (
    <>
      <TextInput
        value={command}
        adornment={<IconPrompt />}
        adornmentPosition="start"
        onChange={e => handleChange(e.target.value)}
        onKeyDown={e => {
          if (e.keyCode === ENTER_KEY && !isDisabled()) {
            setCommandHistory([...commandHistory, command])
            handleSubmit()
          } else if (e.keyCode === UP_KEY) {
            // calculate prev
            if (commandHistory.length === 0) {
              return
            }
            // Don't allow values that are not in the range of 0...commandHistory.length
            const prevHistory =
              (((currentHistory - 1) % commandHistory.length) +
                commandHistory.length) %
              commandHistory.length
            // set the current history number to prevHistory
            setCurrentHistory(prevHistory)
            // set the current command to the previous one
            handleChange(commandHistory[prevHistory])
          } else if (e.keyCode === DOWN_KEY) {
            if (commandHistory.length === 0) {
              return
            }
            // Ditto
            const nextHistory = (currentHistory + 1) % commandHistory.length
            setCurrentHistory(nextHistory)
            handleChange(commandHistory[nextHistory])
          }
        }}
        css={`
          margin-right: ${1.5 * GU}px;
        `}
        wide
      />
      <Button
        mode="strong"
        icon={<IconEnter />}
        label="Enter"
        disabled={isDisabled()}
        onClick={handleSubmit}
      />
    </>
  )
}

Prompt.propTypes = {
  command: PropTypes.string.isRequired,
  handleChange: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  commandHistory: PropTypes.array,
  currentHistory: PropTypes.number,
  setCommandHistory: PropTypes.func,
  setCurrentHistory: PropTypes.func,
}

export default Console
