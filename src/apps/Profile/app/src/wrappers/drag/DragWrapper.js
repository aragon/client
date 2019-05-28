import React, { useReducer } from 'react'
import PropTypes from 'prop-types'

import { DragContext } from '.'
import {
  initialState,
  dragReducer,
  startDrag,
  stopDrag,
  cancelDrag,
} from '../../stateManagers/drag'

const DragWrapper = ({ children }) => {
  const [dragState, dispatchDrag] = useReducer(dragReducer, initialState)

  const handleDrag = dragAction => e => {
    e.preventDefault()
    e.stopPropagation()
    e.stopImmediatePropagation()
    dispatchDrag(dragAction())
  }

  window.addEventListener('dragenter', handleDrag(startDrag))
  window.addEventListener('dragleave', handleDrag(stopDrag))
  window.addEventListener('dragend', handleDrag(cancelDrag))
  window.addEventListener('drop', handleDrag(cancelDrag))

  return (
    <DragContext.Provider value={{ dragState, dispatchDrag }}>
      {children}
    </DragContext.Provider>
  )
}

DragWrapper.propTypes = {
  children: PropTypes.node.isRequired,
}

export default DragWrapper
