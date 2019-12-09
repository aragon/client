import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { ReactTerminalStateless } from 'react-terminal-component'
import {
  EmulatorState,
  CommandMapping,
  OutputFactory,
  defaultCommandMapping,
} from 'javascript-terminal'

import { log } from '../../utils'

function Console({ handleAct, handleExec, handleInstall, ...rest }) {
  const customCommandMapping = CommandMapping.create({
    ...defaultCommandMapping,
    print: {
      function: (state, opts) => {
        const input = opts.join(' ')
        return {
          output: OutputFactory.makeTextOutput(input),
        }
      },
      optDef: {},
    },
    install: {
      function: (state, opts) => {
        const input = opts.join(' ')
        handleInstall(opts)
        return {
          output: OutputFactory.makeTextOutput(input),
        }
      },
      optDef: {},
    },
    exec: {
      function: (state, opts) => {
        const input = opts.join(' ')
        handleExec(opts)
        return {
          output: OutputFactory.makeTextOutput(
            'Executing DAO Install command...'
          ),
        }
      },
      optDef: {},
    },
    act: {
      function: (state, opts) => {
        const input = opts.join(' ')
        log(state, opts)
        return {
          output: OutputFactory.makeTextOutput(input),
        }
      },
      optDef: {},
    },
  })

  const [termState, setTermState] = useState({
    emulatorState: EmulatorState.create({
      commandMapping: customCommandMapping,
    }),
    inputStr: '',
    history: [],
  })
  return (
    <ReactTerminalStateless
      emulatorState={termState.emulatorState}
      inputStr={termState.inputStr}
      onInputChange={input => setTermState({ ...termState, inputStr: input })}
      onStateChange={emulatorState => setTermState({ emulatorState })}
      {...rest}
    />
  )
}

Console.propTypes = {
  handleAct: PropTypes.func.isRequired,
  handleExec: PropTypes.func.isRequired,
  handleInstall: PropTypes.func.isRequired,
}

export default Console
