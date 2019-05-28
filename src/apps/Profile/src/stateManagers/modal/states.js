export const initialState = {
  type: null,
  id: null,
  itemType: null,
  sigsRequired: [],
}

export const openedModal = (state, type, id) => ({
  ...state,
  type,
  id,
})

export const closedModal = state => ({
  type: null,
  id: null,
  itemType: null,
  sigsRequired: [],
})

export const removeItem = (state, id, itemType) => ({
  ...state,
  type: 'removeItem',
  itemType,
  id,
})

export const openedBoxStateModal = (state, sigsRequired) => ({
  ...state,
  type: '3boxState',
  sigsRequired,
})
