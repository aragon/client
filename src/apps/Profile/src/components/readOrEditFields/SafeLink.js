import React from 'react'
import PropTypes from 'prop-types'
import { SafeLink, Text, theme } from '@aragon/ui'

const style = { color: theme.accent }

const Link = ({ value, placeholder, size }) => (
  <div>
    {value ? (
      <SafeLink style={style} href={value} target="_blank" size={size}>
        {value}
      </SafeLink>
    ) : (
      <Text size={size} color="grey">
        {placeholder}
      </Text>
    )}
  </div>
)

Link.propTypes = {
  value: PropTypes.string.isRequired,
  placeholder: PropTypes.string.isRequired,
  size: PropTypes.string.isRequired,
}

export default Link
