import {
  OPENED_MODAL,
  OPENED_BOX_MODAL,
  CLOSED_MODAL,
  REMOVE_ITEM,
} from './actionTypes'

export const open = (type, id) => ({
  type: OPENED_MODAL,
  meta: {
    type,
    id,
  },
})

export const openBoxState = sigsRequired => ({
  type: OPENED_BOX_MODAL,
  meta: {
    sigsRequired,
  },
})

export const close = () => ({
  type: CLOSED_MODAL,
})

export const removeItem = (id, itemType) => ({
  type: REMOVE_ITEM,
  meta: {
    id,
    itemType,
  },
})
