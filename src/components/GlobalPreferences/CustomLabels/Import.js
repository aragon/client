import React from 'react'
import PropTypes from 'prop-types'
import { useDropzone } from 'react-dropzone'
import { Button, useToast } from '@aragon/ui'
import { isString } from '../../../util/utils'
import { isAddress } from '../../../util/web3'

// What is the answer to the ultimate question of Life, the Universe, and Everything?
const MAX_LENGTH = 42

const verifyLocalIdentityObject = obj => {
  return (
    Array.isArray(obj) &&
    obj.every(
      ({ address, name, createdAt }) =>
        isAddress(address.trim()) &&
        !!createdAt &&
        !!name.trim() &&
        isString(name) &&
        name.length <= MAX_LENGTH
    )
  )
}

const fileImport = (cb, toast) => files => {
  if (!files || !files.length) {
    return
  }

  const reader = new FileReader()
  reader.onload = event => {
    try {
      const list = JSON.parse(event.target.result)
      if (verifyLocalIdentityObject(list)) {
        toast('Custom labels imported successfully')
        cb(list)
      } else {
        throw new Error('There was an error reading from the file')
      }
    } catch (e) {
      console.warn(e)
    }
  }
  reader.readAsText(files[0])
}

const Import = ({ onImport, button }) => {
  const toast = useToast()
  const { getRootProps, getInputProps } = useDropzone({
    onDrop: fileImport(onImport, toast),
    multiple: false,
  })

  return (
    <label
      {...getRootProps()}
      css={`
        position: relative;
        display: inline-block;
        &:focus,
        &:active {
          outline: none;
        }
      `}
    >
      <input
        {...getInputProps()}
        css={`
          position: absolute;
          z-index: 1;
          display: inline-block;
          opacity: 0;
          height: 100%;
          width: 100%;
        `}
      />
      {button || (
        <Button label="Import labels" mode="strong">
          Import labels
        </Button>
      )}
    </label>
  )
}

Import.propTypes = {
  button: PropTypes.node,
  onImport: PropTypes.func.isRequired,
}

export { fileImport }
export default Import
