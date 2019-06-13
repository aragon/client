import React from 'react'
import PropTypes from 'prop-types'
import { Card, Text, theme } from '@aragon/ui'
import styled from 'styled-components'

const CardWrapper = ({ children, title, addMore, addSeparators, viewMode }) => (
  <div style={{ width: '100%' }}>
    {title && (
      <Text style={{ padding: '7px 0' }} size="xlarge">
        {title}
      </Text>
    )}
    {addMore && !viewMode && (
      <Text
        style={{ paddingLeft: '13px', cursor: 'pointer' }}
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
  viewMode: true,
}

CardWrapper.propTypes = {
  children: PropTypes.node,
  title: PropTypes.string,
  addMore: PropTypes.func,
  addSeparators: PropTypes.bool,
  viewMode: PropTypes.bool,
}

const StyledCard = styled(Card).attrs({ width: '100%', height: 'auto' })`
  padding: 16px;
  > :not(:last-child) {
    margin-bottom: 13px;
    padding-bottom: 13px;
    border-bottom: ${({ addSeparators }) =>
      addSeparators ? '1px solid #EEE' : '0'};
  }
`

export default CardWrapper
