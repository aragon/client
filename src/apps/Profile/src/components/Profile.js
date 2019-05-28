import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Viewport } from '@aragon/ui'

import InformationPanel from './informationPanel'
import OrganizationPanel from './OrganizationPanel'
import EducationPanel from './EducationPanel'
import WorkHistoryPanel from './WorkHistoryPanel'
import CoverImage from './CoverImage'

const Profile = ({ ethereumAddress }) => {
  return (
    <div style={{ width: '100%' }}>
      <CoverImage ethereumAddress={ethereumAddress} />
      <Viewport>
        {({ below }) =>
          below(640) ? (
            <SingleColumn>
              <InformationPanel ethereumAddress={ethereumAddress} />
              <OrganizationPanel />
              <WorkHistoryPanel ethereumAddress={ethereumAddress} />
              <EducationPanel ethereumAddress={ethereumAddress} />
            </SingleColumn>
          ) : (
            <DoubleColumn>
              <LeftColumn>
                <InformationPanel ethereumAddress={ethereumAddress} />
                <EducationPanel ethereumAddress={ethereumAddress} />
              </LeftColumn>
              <RightColumn>
                <OrganizationPanel />
                <WorkHistoryPanel ethereumAddress={ethereumAddress} />
              </RightColumn>
            </DoubleColumn>
          )
        }
      </Viewport>
    </div>
  )
}
Profile.propTypes = {
  ethereumAddress: PropTypes.string.isRequired,
}

const LeftColumn = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 25rem;

  margin: 1rem;
  > * {
    margin-bottom: 2rem;
  }
`
const RightColumn = styled(LeftColumn)`
  width: 100%;
  max-width: 46rem;
`
const SingleColumn = styled(RightColumn)`
  width: auto;
  padding: 0 1rem;
  background-color: #ffffff;
  align-content: stretch;
`
const DoubleColumn = styled.div`
  display: flex;
  flex-direction: row;
  padding: 0 2rem;
`

export default Profile
