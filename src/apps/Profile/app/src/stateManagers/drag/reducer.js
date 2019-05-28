import { START_DRAG, STOP_DRAG, CANCEL_DRAG } from './actionTypes'

import { startDrag, stopDrag, cancelDrag } from './states'

import { log } from '../../../utils'

const logStateUpdate = (action, prevState, nextState) => {
  log('ACTION: ', action, 'PREV STATE: ', prevState, 'NEXT STATE:', nextState)
}

const dragReducer = (prevState, action) => {
  switch (action.type) {
    case START_DRAG: {
      const nextState = startDrag({ ...prevState })
      logStateUpdate(action, prevState, nextState)
      return nextState
    }
    case STOP_DRAG: {
      const nextState = stopDrag({ ...prevState })
      logStateUpdate(action, prevState, nextState)
      return nextState
    }
    case CANCEL_DRAG: {
      const nextState = cancelDrag({ ...prevState })
      logStateUpdate(action, prevState, nextState)
      return nextState
    }
    default: {
      return prevState
    }
  }
}

export default dragReducer
