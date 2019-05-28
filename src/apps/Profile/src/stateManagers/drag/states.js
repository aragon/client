export const initialState = { counter: 0, dragging: false }

export const startDrag = state => ({
  counter: state.counter + 1,
  dragging: true,
})

export const stopDrag = state => ({
  counter: state.counter - 1,
  dragging: state.counter > 1,
})

export const cancelDrag = state => ({
  counter: 0,
  dragging: false,
})
