import React, { useState, useCallback, useMemo } from 'react'
import PropTypes from 'prop-types'
import {
  Box,
  Header,
  Button,
  Info,
  TextInput,
  IconEnter,
  useTheme,
  useToast,
  GU,
} from '@aragon/ui'
import { hash as namehash } from 'eth-ens-namehash'
import { encodeFunctionCall } from 'web3-eth-abi'
import ConsoleFeedback from './ConsoleFeedback'
import {
  parseCommand,
  parseMethodCall,
  parseInitParams,
  parsePermissions,
} from './console-utils'
import IconPrompt from './IconPrompt'
import KEYCODES from '../../keycodes'
import { clamp } from '../../math-utils'
import { AragonType, AppType } from '../../prop-types'
import { encodeFunctionCallFromSignature } from './web3-encoding-utils'
import { useWallet } from '../../wallet'
// Maximum time (in milliseconds) to wait for a response
// from the aragon.js apm repo content fetcher
const REPO_FETCH_TIMEOUT = 3000
const APP_POSTFIX = '.aragonpm.eth'

function Console({ apps, wrapper }) {
  const [command, setCommand] = useState('')
  const [loading, setLoading] = useState(false)
  const [parsedState, setParsedState] = useState([])
  const theme = useTheme()
  const toast = useToast()
  const { web3 } = useWallet()

  const performIntents = useCallback(
    async (intentPaths, transactionPaths) => {
      if (Array.isArray(intentPaths) && intentPaths.length) {
        await wrapper.performTransactionPath(intentPaths)
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
        // Get & properly parse arguments
        const [appName, initArgs, permArgs] = params
        const parsedInitArgs = parseInitParams(initArgs)
        const parsedPermArgs = parsePermissions(permArgs)
        // Resolve namehash and ens domain to fetch the app's repo content
        const appId = namehash(`${appName}${APP_POSTFIX}`)
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
        const encodedInitializeFunc = encodeFunctionCall(
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
    [toast, apps, wrapper, performIntents]
  )
  // Handle DAO execution
  const handleDaoExec = useCallback(
    async params => {
      try {
        setLoading(true)
        const [proxyAddress, methodWithArgs] = params
        const [methodSignature, args] = parseMethodCall(methodWithArgs)
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
        const encodedFunctionCall = encodeFunctionCallFromSignature(
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
        toast('Command execution failed.')
      } finally {
        setLoading(false)
      }
    },
    [wrapper, performIntents, toast, web3]
  )

  // handle input change
  function handleChange(input) {
    const parsingResult = parseCommand(input)
    setParsedState(parsingResult)
    setCommand(input)
  }

  // Handle command clicks
  const handleCommandClick = useCallback(
    clickedCommand => {
      const newCommand = `${command}${clickedCommand.toLowerCase()}/`
      const parsingResult = parseCommand(newCommand)
      setParsedState(parsingResult)
      setCommand(newCommand)
    },
    [command]
  )

  // Handle console command submission
  const handleSubmit = useCallback(() => {
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
  }, [handleDaoAct, handleDaoExec, handleDaoInstall, parsedState, toast])

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
            apps={apps}
            currentParsedCommand={parsedState}
            handleCommandClick={handleCommandClick}
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

function Prompt({ command, handleChange, handleSubmit }) {
  const [commandHistory, setCommandHistory] = useState([])
  const [historyIndex, setHistoryIndex] = useState(0)
  const isDisabled = useMemo(() => {
    const parsedCommand = parseCommand(command)
    const isValidInstall =
      parsedCommand[0] === 'install' && parsedCommand.length === 4
    const isValidExec =
      parsedCommand[0] === 'exec' && parsedCommand.length === 3
    const isValidAct = parsedCommand[0] === 'act' && parsedCommand.length === 4
    return !(isValidInstall || isValidExec || isValidAct)
  }, [command])

  return (
    <>
      <TextInput
        value={command}
        adornment={<IconPrompt />}
        adornmentPosition="start"
        onChange={e => handleChange(e.target.value)}
        onKeyDown={e => {
          if (e.keyCode === KEYCODES.enter && !isDisabled) {
            const newCommandHistory = [...commandHistory, command]
            setCommandHistory(newCommandHistory)
            setHistoryIndex(newCommandHistory.length - 1)
            handleSubmit()
          } else if (e.keyCode === KEYCODES.up || e.keyCode === KEYCODES.down) {
            if (commandHistory.length === 0) {
              return
            }
            const nextHistory = clamp(
              historyIndex + e.keyCode === KEYCODES.up ? -1 : 1,
              0,
              commandHistory.length - 1
            )
            setHistoryIndex(nextHistory)
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
        disabled={isDisabled}
        onClick={handleSubmit}
      />
    </>
  )
}

Prompt.propTypes = {
  command: PropTypes.string.isRequired,
  handleChange: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
}

export default Console
