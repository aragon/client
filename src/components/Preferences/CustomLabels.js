import React from 'react'
import PropTypes from 'prop-types'
import { Badge, IdentityBadge, font } from '@aragon/ui'
import { CustomLabelModalConsumer } from '../CustomLabelModal/CustomLabelModalManager'
import { getAll, resolve, set, removeAll } from '../../mockCustomLabelsManager'
import EmptyCustomLabels from './EmptyCustomLabels'

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

const CustomLabels = () => {
  const [list, setList] = React.useState(getAll)
  const clearAll = () => {
    removeAll()
    setList(getAll)
  }
  const href = window.URL.createObjectURL(
    new Blob([JSON.stringify(getAll())], { type: 'text/json' })
  )
  const fileImport = file => {
    const reader = new FileReader()
    reader.onload = event => {
      const list = JSON.parse(event.target.result)
      if (verifyCustomLabelObject(list)) {
        list.forEach(({ address, label }) => set({ address, label }))
        setList(getAll)
      }
    }
    reader.readAsText(event.target.files[0])
  }

  return (
    <React.Fragment>
      <Labels list={list} />
      <div>
        <label
          css={`
            position: relative;
            display: inline-block;
            overflow: hidden;
          `}
        >
          <button>Import</button>
          <input
            type="file"
            onChange={fileImport}
            accept=".json"
            css={`
              border: 1px solid red;
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
        <a download="customLabels.json" href={href}>
          Export
        </a>
        <button onClick={clearAll}>Remove all labels</button>
      </div>
      <Warning />
    </React.Fragment>
  )
}

const Labels = ({ list }) => {
  if (!list.length) {
    return <EmptyCustomLabels />
  }
  const updateLabel = (fn, address) => () => {
    fn(address)
  }

  return (
    <ul>
      <li key="headers">
        <div>Custom label</div>
        <div>Address</div>
      </li>
      {list.map(({ address }) => (
        <li key={address}>
          <div>{resolve(address)}</div>
          <div>
            <CustomLabelModalConsumer>
              {({ showCustomLabelModal }) => (
                <IdentityBadge
                  entity={address}
                  popoverAction={{
                    title: (
                      <div
                        css={`
                          display: grid;
                          align-items: center;
                          grid-template-columns: auto 1fr;
                          padding-right: 24px;
                        `}
                      >
                        <span
                          css={`
                            display: inline-block;
                            overflow: hidden;
                            text-overflow: ellipsis;
                            white-space: nowrap;
                          `}
                        >
                          {resolve(address)}
                        </span>
                        <Badge
                          css={`
                            margin-left: 16px;
                            text-transform: uppercase;
                            ${font({ size: 'xxsmall' })};
                          `}
                        >
                          Custom label
                        </Badge>
                      </div>
                    ),
                    label: 'Edit custom label',
                    onClick: updateLabel(showCustomLabelModal, address),
                  }}
                />
              )}
            </CustomLabelModalConsumer>
          </div>
        </li>
      ))}
    </ul>
  )
}

const Warning = () => (
  <div>
    <div>i All labels are local to your device</div>
    <div>
      If you want to share the labels with others, you will need to export them
      and share the .json file
    </div>
  </div>
)

Labels.defaultProps = {
  list: [],
}

Labels.propTypes = {
  list: PropTypes.array,
}

export default CustomLabels
