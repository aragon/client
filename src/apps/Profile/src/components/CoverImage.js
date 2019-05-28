import React, { useContext } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import ImageMenu from './ImageMenu'
import { BoxContext } from '../wrappers/box'

const CoverImage = ({ ethereumAddress }) => {
  const { boxes } = useContext(BoxContext)
  const userLoaded = !!boxes[ethereumAddress]
  const imageTag = 'coverPhoto'

  const hasImage = userLoaded && boxes[ethereumAddress].publicProfile[imageTag]

  const imageCid =
    hasImage &&
    boxes[ethereumAddress].publicProfile[imageTag][0].contentUrl['/']

  const imageMenuProps = {
    ethereumAddress,
    top: 26,
    right: 26,
    imageExists: !!hasImage,
    open,
    imageTag: 'coverPhoto',
    imageTitle: 'Cover',
  }

  return (
    <CoverBase className="imageHover">
      {hasImage ? <CoverPicture imageCid={imageCid} /> : <CoverPlaceholder />}
      {userLoaded && <ImageMenu {...imageMenuProps} />}
    </CoverBase>
  )
}

CoverImage.propTypes = {
  ethereumAddress: PropTypes.string.isRequired,
}

const getBackground = props =>
  `url(https://ipfs.infura.io/ipfs/${props.imageCid})`

const CoverBase = styled.div`
  width: 100%;
  height: 12rem;
  position: relative;
`
const CoverPicture = styled(CoverBase)`
  background-image: ${props => getBackground(props)};
`
const CoverPlaceholder = styled(CoverBase)`
  border: ${({ dragBorder }) => dragBorder};
  filter: grayscale(100);
  background: black;
  opacity: 0.1;
`

export default CoverImage
