import React from 'react'
import styled from 'styled-components'

import ProfilePicture from './ProfilePicture'
import InformationCard from './InformationCard'

const LeftPanel = () => {
  return (
    <AlignCenter>
      <ProfilePicture />
      <InformationCard />
    </AlignCenter>
  )
}

const AlignCenter = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: -1rem;
`

export default LeftPanel
