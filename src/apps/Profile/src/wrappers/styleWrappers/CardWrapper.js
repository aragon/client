import React from 'react'
import PropTypes from 'prop-types'
import { Card, Text, theme } from '@aragon/ui'
import styled from 'styled-components'

const CardWrapper = ({ children, title, addMore, addSeparators }) => (
  <div style={{ width: '100%' }}>
    {title && (
      <Text style={{ padding: '0.5rem 0' }} size="xlarge">
        {title}
      </Text>
    )}
    {addMore && (
      <Text
        style={{ paddingLeft: '1rem', cursor: 'pointer' }}
        size="small"
        color={theme.accent}
        onClick={() => addMore()}
      >
        Add more
      </Text>
    )}
    {children && (
      <StyledCard addSeparators={addSeparators}>{children}</StyledCard>
    )}
  </div>
)

CardWrapper.defaultProps = {
  addSeparators: false,
  addMore: null,
}

CardWrapper.propTypes = {
  children: PropTypes.node,
  title: PropTypes.string,
  addMore: PropTypes.func,
  addSeparators: PropTypes.bool,
}

const StyledCard = styled(Card).attrs({ width: '100%', height: 'auto' })`
  padding: 1.2rem;
  > :not(:last-child) {
    margin-bottom: 1rem;
    border-bottom: ${({ addSeparators }) =>
      addSeparators ? '1px solid #EEE' : '0'};
  }
`

export default CardWrapper
