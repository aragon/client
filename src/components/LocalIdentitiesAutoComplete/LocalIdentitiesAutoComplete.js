import React, { useState, useEffect, useCallback } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { EthIdenticon, IdentityBadge, theme } from '@aragon/ui'
import AutoCompleteSelected from '../AutoComplete/AutoCompleteSelected'
import { AragonType } from '../../prop-types'

const withKey = item => ({ key: item.address, ...item })
const sortAlphAsc = (a, b) => a.name.localeCompare(b.name)

function LocalIdentitiesAutoComplete({
  forwardedRef,
  onChange,
  placeholder,
  required,
  value,
  wide,
  wrapper,
}) {
  const ref = forwardedRef
  const [items, setItems] = useState([])
  const [selected, setSelected] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')

  const handleSearch = useCallback(
    async term => {
      if (!wrapper) {
        return
      }
      if (term.length < 3) {
        setItems([])
        return
      }
      const items = await wrapper.searchIdentities(term)
      setItems(items.map(withKey).sort(sortAlphAsc))
    },
    [wrapper]
  )
  const handleChange = useCallback(
    value => {
      setSearchTerm(value)
      handleSearch(value)
      onChange(value)
    },
    [onChange, handleSearch]
  )
  const handleSelect = useCallback(
    selected => {
      const { name, address } = selected
      setSearchTerm(name)
      handleSearch(name)
      setSelected(selected)
      onChange(address)
    },
    [onChange, handleSearch]
  )
  const handleSelectedClick = () => {
    setSelected(null)
    onChange(selected.name)
  }

  useEffect(() => {
    const effect = async () => {
      // reset
      if (value === '') {
        setSelected(null)
        setSearchTerm(value)
        handleSearch(value)
        return
      }
      // value coming from up the tree not from typing
      if (searchTerm === '' && wrapper) {
        const exists = await wrapper.searchIdentities(value)
        if (exists && exists.length === 1) {
          const item = exists[0]
          if (
            item.name.toLowerCase() === value.toLowerCase() ||
            item.address.toLowerCase() === value.toLowerCase()
          ) {
            setSelected(item)
            setSearchTerm(item.name)
            handleSearch(item.name)
            return
          }
        }
        setSearchTerm(value)
      }
    }
    effect()
  }, [selected, value, wrapper, handleSearch, searchTerm])

  return (
    <AutoCompleteSelected
      itemButtonStyles={`
          border-left: 3px solid transparent;
          cursor: pointer;
          border-radius: 0;

          &:hover,
          &:focus {
            outline: 2px solid ${theme.accent};
            background: #f9fafc;
            border-left: 3px solid ${theme.accent}
          }
        `}
      items={items}
      onChange={handleChange}
      onSelect={handleSelect}
      onSelectedClick={handleSelectedClick}
      placeholder={placeholder}
      ref={ref}
      renderItem={Item}
      renderSelected={Selected}
      required={required}
      selected={selected}
      selectedButtonStyles={`
          &:hover,
          &:focus {
            outline: none;
            border: 1px solid ${theme.accent};
            border-radius: 3px;
          }
        `}
      value={searchTerm}
      wide={wide}
    />
  )
}

LocalIdentitiesAutoComplete.propTypes = {
  onChange: PropTypes.func.isRequired,
  forwardedRef: PropTypes.object,
  placeholder: PropTypes.string,
  required: PropTypes.bool,
  value: PropTypes.string,
  wide: PropTypes.bool,
  wrapper: AragonType,
}

const Item = ({ address, name }, searchTerm) => {
  if (searchTerm.indexOf('0x') === 0) {
    return (
      <Option>
        <IdentityBadge compact badgeOnly entity={address} />
        <Name>{name}</Name>
      </Option>
    )
  }
  return (
    <Option>
      <Name>{name}</Name>
      <IdentityBadge compact badgeOnly entity={address} />
    </Option>
  )
}

Item.propTypes = {
  address: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
}

const Selected = ({ address, name }) => {
  return (
    <Option selected>
      <EthIdenticon address={address} scale={0.6} radius={2} />
      <Name>{name}</Name>
    </Option>
  )
}

Selected.propTypes = {
  address: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
}

const Option = styled.div`
  padding: 8px;
  display: grid;
  grid-template-columns: auto minmax(140px, 1fr);
  grid-gap: 8px;
  align-items: center;
`

const Name = styled.div`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: inline-block;
  text-align: left;
  color: #000;
`

const LocalIdentitiesAutoCompleteMemo = React.memo(LocalIdentitiesAutoComplete)

export default React.forwardRef((props, ref) => (
  <LocalIdentitiesAutoCompleteMemo {...props} forwardedRef={ref} />
))
