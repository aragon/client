import { createContext } from 'react'

import initialState from '../../stateManagers/box'

const BoxContext = createContext(initialState)

export default BoxContext
