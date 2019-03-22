import React from 'react'
import PropTypes from 'prop-types'
import { useDropzone } from 'react-dropzone'
import { Button } from '@aragon/ui'
import { isString } from '../../utils'
import { isAddress } from '../../web3-utils'

// What is the answer to the ultimate question of Life, the Universe, and Everything?
const MAX_LENGTH = 42

const verifyLocalIdentityObject = obj => {
  return (
    Array.isArray(obj) &&
    obj.every(
      ({ address, name, createdAt }) =>
        !!address.trim() &&
        !!name.trim() &&
        !!createdAt &&
        isAddress(address) &&
        isString(name) &&
        name.length <= MAX_LENGTH
    )
  )
}

const fileImport = cb => files => {
  if (!files || !files.length) {
    return
  }

  const reader = new FileReader()
  reader.onload = event => {
    try {
      const list = JSON.parse(event.target.result)
      if (verifyLocalIdentityObject(list)) {
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

const Import = ({ onImport }) => {
  const { getRootProps, getInputProps } = useDropzone({
    onDrop: fileImport(onImport),
  })

  return (
    <label
      css={`
        position: relative;
        display: inline-block;
        overflow: hidden;
      `}
      {...getRootProps()}
    >
      <input {...getInputProps()} />
      <Button label="Import" mode="secondary">
        Import
      </Button>
    </label>
  )
}

Import.propTypes = { onImport: PropTypes.func.isRequired }

export default Import
