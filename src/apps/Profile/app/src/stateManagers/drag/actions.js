import { STOP_DRAG, START_DRAG, CANCEL_DRAG } from './actionTypes'

export const startDrag = () => ({
  type: START_DRAG,
})

export const stopDrag = () => ({
  type: STOP_DRAG,
})

export const cancelDrag = () => ({
  type: CANCEL_DRAG,
})
