import React, { useState, useEffect, useCallback } from 'react'
import PropTypes from 'prop-types'
import {
  Box,
  Header,
  Button,
  Info,
  TextInput,
  IconDown,
  useToast,
  GU,
} from '@aragon/ui'
import Web3 from 'web3'
import { AragonType, AppType } from '../../prop-types'
import { log } from '../../utils'
import { getInjectedProvider } from '../../web3-utils'

function AraConsole({ apps, wrapper }) {
  return (
    <>
      <Header primary="Console" />
      <ConsoleWrapper apps={apps} wrapper={wrapper} />
    </>
  )
}

AraConsole.propTypes = {
  apps: PropTypes.arrayOf(AppType).isRequired,
  wrapper: AragonType,
}

function ConsoleWrapper({ apps, wrapper }) {
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
      // TODO: fix this, not right (-1 doesn't mean slice until end)
      initParams = initArgs.slice(0, permIndex)
      log('initParams', initParams)
      log('permParams', permParams, initParams)

      const web3 = new Web3(getInjectedProvider())

      if (!web3) {
        toast('You need to have a Dapp browser extension for this command')
      }

      const kernelProxyAddress = apps.find(
        app => app.name.toLowerCase() === 'kernel'
      ).proxyAddress

      const appId = apps.find(app => app.name.toLowerCase() === appName).appId

      const ensDomain = await wrapper.ens.resolve(appId)
      log('ensDomain', ensDomain)

      const repoContent = await wrapper.apm.fetchLatestRepoContent(ensDomain, {
        fetchTimeout: 3000,
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

  const handleDaoAct = useCallback(() => {}, [])

  // Handle console input
  const handleConsoleInput = useCallback(() => {
    if (command.includes('exec')) {
      handleDaoExec(command.split(' ').slice(2))
    } else if (command.includes('install')) {
      handleDaoInstall(command.split(' ').slice(2))
    } else if (command.includes('act')) {
      handleDaoAct()
    } else {
      toast('Unrecognized Command')
      setCommand('')
    }
  }, [command, handleDaoExec, handleDaoInstall, handleDaoAct, toast])

  return (
    <Box>
      <div
        css={`
          display: flex;
        `}
      >
        <TextInput
          value={command}
          onChange={e => setCommand(e.target.value)}
          onKeyDown={e => {
            if (e.keyCode === 13) {
              handleConsoleInput()
            }
          }}
          css={`
            margin-right: ${1.5 * GU}px;
          `}
          wide
        />
        <Button
          mode="strong"
          icon={<IconDown />}
          label="Execute"
          display="icon"
        />
      </div>
      <Info
        css={`
          margin: ${2 * GU}px 0 ${2 * GU}px 0;
        `}
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
  )
}

ConsoleWrapper.propTypes = {
  apps: PropTypes.arrayOf(AppType).isRequired,
  wrapper: AragonType,
}

// function ConsoleInfo() {
//   return (
//     <>
//       <Box heading="Information">
//         <h3
//           css={`
//             ${textStyle('title3')}
//           `}
//         >
//           Available console commands
//         </h3>
//         <p
//           css={`
//             margin-top: ${2 * GU}px;
//           `}
//         >
//           <span
//             css={`
//               ${textStyle('label1')}
//             `}
//           >
//             Dao Install{' '}
//           </span>
//           - Can be used to install a new instance of an app in your DAO.
//         </p>
//         <p
//           css={`
//             margin-top: ${2 * GU}px;
//           `}
//         >
//           <span
//             css={`
//               ${textStyle('label1')}
//             `}
//           >
//             Dao exec{' '}
//           </span>
//           - Performs transactions in your DAO.
//         </p>
//         <p
//           css={`
//             margin-top: ${2 * GU}px;
//           `}
//         >
//           <span
//             css={`
//               ${textStyle('label1')}
//             `}
//           >
//             Dao Act{' '}
//           </span>
//           - syntax sugar over{' '}
//           <span
//             css={`
//               ${textStyle('label1')}
//             `}
//           >
//             Dao Exec{' '}
//           </span>
//           for doing transactions with an Agent app instance from your DAO.
//         </p>
//       </Box>
//     </>
//   )
// }

export default AraConsole
