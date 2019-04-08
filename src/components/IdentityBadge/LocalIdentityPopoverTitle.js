import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Badge, font } from '@aragon/ui'

const LocalIdentityPopoverTitle = ({ label }) => {
  return (
    <WrapTitle>
      <Label>{label}</Label>
      <Badge
        css={`
          margin-left: 16px;
          text-transform: uppercase;
          ${font({ size: 'xsmall' })};
        `}
      >
        Custom label
      </Badge>
    </WrapTitle>
  )
}

LocalIdentityPopoverTitle.propTypes = {
  label: PropTypes.string.isRequired,
}

const WrapTitle = styled.div`
  display: grid;
  align-items: center;
  grid-template-columns: auto 1fr;
  padding-right: 24px;
`

const Label = styled.span`
  display: inline-block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

export default LocalIdentityPopoverTitle
