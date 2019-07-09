import React from 'react'
import ErrorCard from './ErrorCard'

const GenericError = props => (
  <ErrorCard title="Oops." {...props}>
    Something went wrong and the application crashed. Reloading might solve the
    problem, or you can report the error so we can help.
  </ErrorCard>
)

export default GenericError
