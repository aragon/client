import React, { useState, useEffect, useCallback, useMemo } from 'react'
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
import { performTransactionPaths } from '../../aragonjs-wrapper'
import ConsoleFeedback from './ConsoleFeedback'
import { buildCommand, parseCommand } from './console-utils'
import handlers from './handlers'
import IconPrompt from './IconPrompt'
import KEYCODES from '../../keycodes'
import { clamp } from '../../util/math'
import { AragonType, AppType } from '../../prop-types'
import { CONSOLE_COMMAND_HISTORY_KEY } from './useConsole'

function Console({ apps, wrapper }) {
  const [command, setCommand] = useState('')
  const [loading, setLoading] = useState(false)
  const [parsedState, setParsedState] = useState([])
  const theme = useTheme()
  const toast = useToast()
  const performIntents = useMemo(
    () => transactionPaths => {
      performTransactionPaths(wrapper, transactionPaths)
    },
    [wrapper]
  )

  const executeCommand = useCallback(
    async (commandHandler, params) => {
      setLoading(true)
      try {
        const path = await commandHandler(params, { apps, wrapper })
        performIntents([path])
      } catch (error) {
        console.error(error)
        toast('Command execution failed')
      } finally {
        setLoading(false)
      }
    },
    [toast, apps, wrapper, performIntents]
  )

  // handle input change
  const handleChange = useCallback(input => {
    const parsingResult = parseCommand(input)
    setParsedState(parsingResult)
    setCommand(input)
  }, [])

  // Handle command clicks
  const handleCommandClick = useCallback(
    clickedCommand => {
      const newCommand = buildCommand(command, clickedCommand)
      const parsingResult = parseCommand(newCommand)
      setParsedState(parsingResult)
      setCommand(newCommand)
    },
    [command]
  )

  const handleSubmit = useCallback(() => {
    const [commandName, ...params] = parsedState
    const handler = handlers.get(commandName)

    if (typeof handler !== 'function') {
      toast('Unrecognized command')
      handleChange('')
      return
    }

    executeCommand(handler, params)
  }, [parsedState, toast, handleChange, executeCommand])

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
            loading={loading}
            onChange={handleChange}
            onSubmit={handleSubmit}
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
            onCommandClick={handleCommandClick}
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

function Prompt({ command, loading, onChange, onSubmit }) {
  const [commandHistory, setCommandHistory] = useState([])
  const [historyIndex, setHistoryIndex] = useState(0)

  const isDisabled = useMemo(() => {
    const parsedCommand = parseCommand(command)
    const isValidInstall =
      parsedCommand[0] === 'install' && parsedCommand.length === 4
    const isValidExec =
      parsedCommand[0] === 'exec' && parsedCommand.length === 3
    const isValidAct =
      parsedCommand[0] === 'act' &&
      (parsedCommand.length === 4 || parsedCommand.length === 5)
    return !(isValidInstall || isValidExec || isValidAct) || loading
  }, [command, loading])

  const handleChange = useCallback(e => onChange(e.target.value), [onChange])
  const handleKeyDown = useCallback(
    e => {
      if (e.keyCode === KEYCODES.enter && !isDisabled) {
        const newCommandHistory = [...commandHistory, command]
        localStorage.setItem(
          CONSOLE_COMMAND_HISTORY_KEY,
          JSON.stringify(newCommandHistory)
        )
        setCommandHistory(newCommandHistory)
        setHistoryIndex(newCommandHistory.length - 1)
        onSubmit()
      } else if (e.keyCode === KEYCODES.up || e.keyCode === KEYCODES.down) {
        if (commandHistory.length === 0) {
          return
        }
        const nextHistory = clamp(
          historyIndex + (e.keyCode === KEYCODES.up ? -1 : 1),
          0,
          commandHistory.length - 1
        )

        if (e.keyCode === KEYCODES.down && nextHistory === historyIndex) {
          onChange('')
          return
        }

        setHistoryIndex(nextHistory)
        onChange(commandHistory[nextHistory])
      }
    },
    [command, commandHistory, historyIndex, isDisabled, onChange, onSubmit]
  )

  useEffect(() => {
    const historyArray = localStorage.getItem(CONSOLE_COMMAND_HISTORY_KEY)
    if (!historyArray) {
      return
    }
    const parsedHistoryArray = JSON.parse(historyArray)
    setCommandHistory(parsedHistoryArray)
    setHistoryIndex(parsedHistoryArray.length - 1)
  }, [])

  return (
    <>
      <TextInput
        value={command}
        adornment={<IconPrompt />}
        adornmentPosition="start"
        onChange={handleChange}
        onKeyDown={handleKeyDown}
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
        onClick={onSubmit}
      />
    </>
  )
}

Prompt.propTypes = {
  command: PropTypes.string.isRequired,
  loading: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
}

export default Console
