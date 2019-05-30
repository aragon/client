import React from 'react'
import styled from 'styled-components'

import ImageMenu from '../ImageMenu'
import { useProfile } from '../../hooks'

import defaultImage from '../../assets/profile_avatar.svg'

const ProfilePicture = () => {
  const {
    imageCid,
    ethereumAddress,
    userLoaded,
    viewMode,
    onSignatures,
  } = useProfile()
  const hasImage = !!imageCid

  // image upload menu can have either 3 or 2 rows, depending on hasImage
  const topMenuPos = hasImage ? 26 : 32

  return (
    <Container className="imageHover" imageCid={imageCid}>
      {userLoaded && !viewMode && (
        <ImageMenu
          ethereumAddress={ethereumAddress}
          top={topMenuPos}
          right={-6}
          imageExists={!!hasImage}
          imageTag="image"
          imageTitle="Profile"
          onSignatures={onSignatures}
        />
      )}
    </Container>
  )
}

const getBackground = props => {
  const imageContentHash = props.imageCid

  return imageContentHash
    ? `url(https://ipfs.infura.io/ipfs/${imageContentHash})`
    : `url(${defaultImage})`
}

const Container = styled.div`
  cursor: ${props => props.isEditing && 'pointer'};
  padding: 16px;
  border: 2px solid #f2f2f2;
  background-image: ${props => getBackground(props)};
  background-size: 150px 150px;
  background-repeat: no-repeat;
  background-position: center;
  background-color: #eeeeeef5;
  transition: border 0.24s ease-in-out;
  border-radius: 50%;
  width: 150px;
  height: 150px;
  position: absolute;
  top: 52px;
  left: 52px;
  z-index: 4;
`

export default ProfilePicture
