import React, { useContext, useCallback } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { useDropzone } from 'react-dropzone'
import { Buffer } from 'ipfs-http-client'
import infuraIpfs from '../../ipfs'
import { removeItem } from '../stateManagers/modal'
import { BoxContext } from '../wrappers/box'
import { ModalContext } from '../wrappers/modal'
import { DragContext } from '../wrappers/drag'
import { image } from '../../modules/things'
import { unlockAndCreateBoxIfRequired } from '../utils'

import {
  uploadingImage,
  uploadedImage,
  uploadedImageFailure,
  savingProfile,
  savedProfile,
  saveProfileError,
} from '../stateManagers/box'

const ImageMenu = ({
  ethereumAddress,
  top,
  right,
  imageExists,
  imageTag,
  imageTitle,
  onSignatures,
}) => {
  const { boxes, dispatch } = useContext(BoxContext)
  const { dispatchModal } = useContext(ModalContext)
  const { dragState } = useContext(DragContext)

  const onDrop = useCallback(
    acceptedFiles => {
      dispatch(uploadingImage(ethereumAddress))

      const reader = new FileReader()

      reader.onerror = error => {
        reader.onabort = () =>
          console.log('file reading failed and was aborted')
        dispatch(uploadedImageFailure(error))
      }

      reader.onload = async () => {
        try {
          const file = Buffer.from(reader.result)
          const unlockedBox = await unlockAndCreateBoxIfRequired(
            boxes[ethereumAddress],
            dispatch,
            dispatchModal,
            ethereumAddress,
            onSignatures
          )
          if (unlockedBox) {
            const result = await infuraIpfs.add(file)
            dispatch(uploadedImage(ethereumAddress, imageTag, result[0].hash))

            try {
              dispatch(savingProfile(ethereumAddress))
              await unlockedBox.setPublicFields(
                [imageTag],
                [image(result[0].hash)]
              )
              dispatch(
                savedProfile(ethereumAddress, {
                  [imageTag]: image(result[0].hash),
                })
              )
            } catch (error2) {
              dispatch(saveProfileError(ethereumAddress, error2))
            }
          }
        } catch (error) {
          dispatch(uploadedImageFailure(error))
        }
      }

      acceptedFiles.forEach(file => reader.readAsArrayBuffer(file))
    },
    [boxes, dispatch, dispatchModal, ethereumAddress, imageTag, onSignatures]
  )

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject,
    open,
  } = useDropzone({
    accept: 'image/*',
    onDrop,
    noDragEventsBubbling: true,
    noClick: true,
    noKeyboard: true,
  })

  const imageCid =
    imageExists &&
    boxes[ethereumAddress].publicProfile[imageTag][0].contentUrl['/']

  return (
    <ImageMenuStyled
      top={top}
      right={right}
      dragging={dragState.dragging}
      {...getRootProps({
        className: 'dropzone',
        isDragActive,
        isDragAccept,
        isDragReject,
        imageCid,
      })}
    >
      {' '}
      <div>Update {imageTitle} photo</div>
      <input {...getInputProps({ disabled: false })} />
      <div onClick={open}>Upload new image</div>
      {imageExists && (
        <div onClick={() => dispatchModal(removeItem(imageCid, imageTag))}>
          Delete
        </div>
      )}
    </ImageMenuStyled>
  )
}

ImageMenu.propTypes = {
  ethereumAddress: PropTypes.string.isRequired,
  top: PropTypes.number.isRequired,
  right: PropTypes.number.isRequired,
  imageExists: PropTypes.bool.isRequired,
  imageTag: PropTypes.oneOf(['image', 'coverPhoto']),
  imageTitle: PropTypes.string.isRequired,
}

const getBorder = props => {
  let color

  if (props.isDragAccept) color = '#00e676'
  else if (props.isDragReject) color = '#ff1744'
  else if (props.isDragActive) color = '#2196f3'
  else if (props.dragging) color = '#446fe9'
  if (color) return `2px ${color} dashed`
  else return '2px white solid'
}

const isVisible = props =>
  props.isDragAccept ||
  props.isDragReject ||
  props.isDragActive ||
  props.dragging

const getVisibility = props => {
  if (isVisible(props)) return 'visible'
  else return 'hidden'
}
const getOpacity = props => {
  if (isVisible(props)) return '0.8'
  else return '0'
}

const ImageMenuStyled = styled.div`
  .imageHover:hover & {
    visibility: visible;
    transition: visibility 0.3s linear, opacity 0.3s linear;
    visibility: visible;
    opacity: 0.8;
  }
  border: ${props => getBorder(props)};
  border-radius: 3px;
  font-size: 0.9rem;
  transition: visibility 0.3s linear, opacity 0.3s linear;
  visibility: ${props => getVisibility(props)};
  opacity: ${props => getOpacity(props)};
  width: 12rem;
  z-index: 1;
  position: absolute;
  top: ${({ top }) => `${top}px`};
  right: ${({ right }) => `${right}px`};
  padding: 1px;
  background: white;
  > :first-child {
    background: #d1d1d1;
    opacity: 0.6;
    font-weight: bold;
    font-size: 1rem;
  }
  > :not(:first-child) {
    background: white;
    opacity: 0.9;
    :hover {
      opacity: 1;
      background: #eee;
      cursor: pointer;
    }
  }
  > :not(:last-child) {
    margin-bottom: 1px;
  }
  > * {
    padding: 0.5rem 0.9rem;
  }
`

export default ImageMenu
