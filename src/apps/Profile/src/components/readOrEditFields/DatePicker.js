import React from 'react'
import PropTypes from 'prop-types'
import { Text } from '@aragon/ui'

import { toUnix, unixToCalendar } from '../../utils'
import { FlexDirectionCol } from '../styled-components'

const DatePicker = ({ onChange, value, label }) => {
  const returnUnixTime = ({ target: { value } }) => onChange(toUnix(value))
  return (
    <FlexDirectionCol>
      <Text>{label}</Text>
      <input
        type="date"
        value={unixToCalendar(value)}
        onChange={returnUnixTime}
      />
    </FlexDirectionCol>
  )
}

DatePicker.propTypes = {
  onChange: PropTypes.func.isRequired,
  label: PropTypes.string.isRequired,
  value: PropTypes.number,
}

export default DatePicker
