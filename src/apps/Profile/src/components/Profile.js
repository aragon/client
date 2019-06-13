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
      <CoverImage />
      <Viewport>
        {({ below }) =>
          below(640) ? (
            <SingleColumn>
              <InformationPanel />
              <OrganizationPanel />
              <WorkHistoryPanel />
              <EducationPanel />
            </SingleColumn>
          ) : (
            <DoubleColumn>
              <LeftColumn>
                <InformationPanel />
                <EducationPanel />
              </LeftColumn>
              <RightColumn>
                <OrganizationPanel />
                <WorkHistoryPanel />
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
  max-width: 400px;

  margin: 13px;
  > * {
    margin-bottom: 26px;
  }
`
const RightColumn = styled(LeftColumn)`
  width: 100%;
  max-width: 600px;
`
const SingleColumn = styled(RightColumn)`
  width: auto;
  align-content: stretch;
`
const DoubleColumn = styled.div`
  display: flex;
  flex-direction: row;
  padding: 0 26px;
`

export default Profile
