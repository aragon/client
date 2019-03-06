import React from 'react'
import PropTypes from 'prop-types'
import { useDropzone } from 'react-dropzone'
import { Button } from '@aragon/ui'
import { isString } from '../../utils'
import { isAddress } from '../../web3-utils'
import { set, removeAll } from '../../mockCustomLabelsManager'

const MAX_LENGTH = 42

const verifyCustomLabelObject = obj => {
  return (
    Array.isArray(obj) &&
    obj.every(
      ({ address, label }) =>
        !!address.trim() &&
        !!label.trim() &&
        isAddress(address) &&
        isString(label) &&
        label.length <= MAX_LENGTH
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
      if (verifyCustomLabelObject(list)) {
        removeAll()
        list.forEach(({ address, label }) => set({ address, label }))
        cb()
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
