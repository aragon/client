import React from 'react'
import styled, { css } from 'styled-components'

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

const Container = styled.div`
  cursor: ${props => props.isEditing && 'pointer'};
  padding: 16px;
  border: 2px solid #f2f2f2;
  background-repeat: no-repeat;
  background-position: center;
  transition: border 0.24s ease-in-out;
  border-radius: 50%;
  width: 150px;
  height: 150px;
  position: absolute;
  top: 52px;
  left: 52px;
  z-index: 4;
  ${props =>
    props.imageCid
      ? css`
          background-image: url(https://ipfs.infura.io/ipfs/${props.imageCid});
          background-size: 100%;
          background-color: white;
        `
      : css`
          background-image: url(${defaultImage});
          background-size: 50%;
          background-color: #e5e8eb;
        `}
`

export default ProfilePicture
