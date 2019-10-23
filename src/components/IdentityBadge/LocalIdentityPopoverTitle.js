import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Tag, GU } from '@aragon/ui'

const LocalIdentityPopoverTitle = ({ label }) => {
  return (
    <WrapTitle>
      <Label>{label}</Label>
      <Tag
        mode="identifier"
        css={`
          margin-left: ${1 * GU}px;
        `}
      >
        Custom label
      </Tag>
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
`

const Label = styled.span`
  display: inline-block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

export default LocalIdentityPopoverTitle
