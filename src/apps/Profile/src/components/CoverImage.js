import React from 'react'
import styled from 'styled-components'
import ImageMenu from './ImageMenu'
import { useProfile } from '../hooks'

const CoverImage = () => {
  const {
    userLoaded,
    coverPhotoCid,
    ethereumAddress,
    viewMode,
    onSignatures,
  } = useProfile()
  const hasImage = !!coverPhotoCid

  const imageMenuProps = {
    ethereumAddress,
    top: 26,
    right: 26,
    imageExists: !!hasImage,
    open,
    imageTag: 'coverPhoto',
    imageTitle: 'Cover',
    onSignatures,
  }

  return (
    <CoverBase className="imageHover">
      {hasImage ? (
        <CoverPicture imageCid={coverPhotoCid} />
      ) : (
        <CoverPlaceholder />
      )}
      {userLoaded && !viewMode && <ImageMenu {...imageMenuProps} />}
    </CoverBase>
  )
}

const getBackground = props =>
  `url(https://ipfs.infura.io/ipfs/${props.imageCid})`

const CoverBase = styled.div`
  width: 100%;
  height: 156px;
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
