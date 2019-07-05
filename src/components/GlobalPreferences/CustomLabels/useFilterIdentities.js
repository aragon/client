import { useState, useEffect } from 'react'

function useFilterIdentities(identities) {
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredIdentities, setFilteredIdentities] = useState(identities)

  useEffect(() => {
    setFilteredIdentities(
      identities.filter(
        ({ address, name }) =>
          searchTerm === '' ||
          name.toLowerCase().indexOf(searchTerm) > -1 ||
          address.toLowerCase().indexOf(searchTerm) > -1
      )
    )
  }, [searchTerm, identities])

  return {
    filteredIdentities,
    handleSearchTermChange: ({ currentTarget: { value } }) =>
      setSearchTerm(value),
    searchTerm,
  }
}

export default useFilterIdentities
