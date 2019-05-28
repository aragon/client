import React, { useContext } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import ImageMenu from '../ImageMenu'
import { BoxContext } from '../../wrappers/box'

import defaultImage from '../../assets/profile_avatar.svg'

const ProfilePicture = ({ ethereumAddress }) => {
  const { boxes } = useContext(BoxContext)
  const userLoaded = !!boxes[ethereumAddress]
  const imageTag = 'image'

  const hasImage = userLoaded && boxes[ethereumAddress].publicProfile[imageTag]

  const imageCid =
    hasImage &&
    boxes[ethereumAddress].publicProfile[imageTag][0].contentUrl['/']

  // image upload menu can have either 3 or 2 rows, depending on hasImage
  const topMenuPos = hasImage ? 26 : 32

  return (
    <Container className="imageHover" imageCid={imageCid}>
      <ImageMenu
        ethereumAddress={ethereumAddress}
        top={topMenuPos}
        right={-6}
        imageExists={!!hasImage}
        imageTag={imageTag}
        imageTitle="Profile"
      />
    </Container>
  )
}

ProfilePicture.propTypes = {
  ethereumAddress: PropTypes.string.isRequired,
}

const getBackground = props => {
  const imageContentHash = props.imageCid

  return imageContentHash
    ? `url(https://ipfs.infura.io/ipfs/${imageContentHash})`
    : `url(${defaultImage})`
}

const Container = styled.div`
  cursor: ${props => props.isEditing && 'pointer'};
  padding: 1.2rem;
  border: 0.15rem solid #f2f2f2;
  background-image: ${props => getBackground(props)};
  background-size: 11.5rem 11.5rem;
  background-repeat: no-repeat;
  background-position: center;
  background-color: #eeeeeef5;
  transition: border 0.24s ease-in-out;
  border-radius: 50%;
  width: 11.5rem;
  height: 11.5rem;
  position: absolute;
  top: 4rem;
  left: 4rem;
  z-index: 4;
`

export default ProfilePicture
