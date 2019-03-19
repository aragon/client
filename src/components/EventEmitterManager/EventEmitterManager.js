import React from 'react'
import PropTypes from 'prop-types'
import EventEmitter from 'events'

const eventEmitter = new EventEmitter()

const EventEmitterContext = React.createContext({})

const EventEmitterProvider = ({ children }) => {
  return (
    <EventEmitterContext.Provider value={{ eventEmitter }}>
      {children}
    </EventEmitterContext.Provider>
  )
}

EventEmitterProvider.propTypes = { children: PropTypes.node.isRequired }

const EventEmitterConsumer = EventEmitterContext.Consumer

export { EventEmitterProvider, EventEmitterConsumer, EventEmitterContext }
