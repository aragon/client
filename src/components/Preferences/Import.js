import React from 'react'
import PropTypes from 'prop-types'
import { Button } from '@aragon/ui'
import { isString } from '../../utils'
import { isAddress } from '../../web3-utils'
import { set, removeAll } from '../../mockCustomLabelsManager'

const verifyCustomLabelObject = obj => {
  return (
    Array.isArray(obj) &&
    obj.every(
      ({ address, label }) =>
        !!address.trim() &&
        !!label.trim() &&
        isAddress(address) &&
        isString(label)
    )
  )
}

const fileImport = cb => file => {
  const reader = new FileReader()
  reader.onload = event => {
    try {
      const list = JSON.parse(event.target.result)
      if (verifyCustomLabelObject(list)) {
        removeAll()
        list.forEach(({ address, label }) => set({ address, label }))
      }
      cb()
    } catch (e) {
      console.warn(e)
    }
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
