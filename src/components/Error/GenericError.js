import React from 'react'
import ErrorCard from './ErrorCard'

const SUPPORT_URL = 'https://github.com/aragon/aragon/issues/new'

const GenericError = props => (
  <ErrorCard title="Oops." supportUrl={SUPPORT_URL} {...props}>
    Something went wrong and the application crashed. Reloading might solve the
    problem, or you can report the error so we can help.
  </ErrorCard>
)

export default GenericError
