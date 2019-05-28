import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import { Text, theme } from '@aragon/ui'
import { IconPencil, IconTrash } from '../assets/'
import { displayStartEndDates } from '../utils/'

const WorkHistoryTile = ({ workHistoryData, openModal, removeItem }) => (
  <SingleWorkItem>
    <Details>
      <Text.Block size="large" style={{ fontWeight: '700' }}>
        {workHistoryData.workPlace}
      </Text.Block>
      <Text.Block size="normal" style={{ fontWeight: '600' }}>
        {workHistoryData.jobTitle}
        <Text
          size="xsmall"
          color={theme.textTertiary}
          style={{ marginLeft: '1rem' }}
        >
          {displayStartEndDates(workHistoryData)}
        </Text>
      </Text.Block>
      <Text.Block size="normal">{workHistoryData.description}</Text.Block>
    </Details>
    <Icons>
      <IconPencil
        color={theme.accent}
        width="16px"
        onClick={() => openModal()}
      />
      <IconTrash
        color={theme.accent}
        width="16px"
        onClick={() => removeItem()}
      />
    </Icons>
  </SingleWorkItem>
)

const SingleWorkItem = styled.div`
  display: flex;
  > :not(:last-child) {
    margin-bottom: 0.4rem;
  }
`
const Icons = styled.div`
  display: inline-flex;
  width: auto;
  flex-direction: column;
  visibility: hidden;
  > * {
    margin: 0 0 0.6rem 0.6rem;
    cursor: pointer;
  }
  ${SingleWorkItem}:hover & {
    visibility: visible;
  }
}
`
const Details = styled.div`
  width: 100%;
  > :not(:last-child) {
    margin-bottom: 0.5rem;
  }
`

WorkHistoryTile.propTypes = {
  workHistoryData: PropTypes.shape({
    workPlace: PropTypes.string.isRequired,
    jobTitle: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    startDate: PropTypes.number,
    endDate: PropTypes.number,
  }).isRequired,
  openModal: PropTypes.func.isRequired,
  removeItem: PropTypes.func.isRequired,
}

export default WorkHistoryTile
