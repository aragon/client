import React from 'react'
import PropTypes from 'prop-types'
import { Button } from '@aragon/ui'
import { set, removeAll } from '../../mockCustomLabelsManager'

const isString = str => typeof str === 'string' || str instanceof String

const verifyCustomLabelObject = obj => {
  return (
    Array.isArray(obj) &&
    obj.every(
      ({ address, label }) =>
        isString(address) &&
        isString(label) &&
        !!address.trim() &&
        !!label.trim()
    )
  )
}

const fileImport = cb => file => {
  const reader = new FileReader()
  reader.onload = event => {
    const list = JSON.parse(event.target.result)
    if (verifyCustomLabelObject(list)) {
      removeAll()
      list.forEach(({ address, label }) => set({ address, label }))
    }
    cb()
  }
  reader.readAsText(event.target.files[0])
}

const Import = ({ onImport }) => (
  <label
    css={`
      position: relative;
      display: inline-block;
      overflow: hidden;
    `}
  >
    <Button label="Import" mode="secondary">
      Import
    </Button>
    <input
      type="file"
      onChange={fileImport(onImport)}
      accept=".json"
      css={`
        display: block;
        filter: alpha(opacity=0);
        opacity: 0;
        position: absolute;
        z-index: 1;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
      `}
    />
  </label>
)

Import.propTypes = { onImport: PropTypes.func.isRequired }

export default Import
