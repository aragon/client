import { useState, useEffect } from 'react'

function useFilterIdentities(identities) {
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredIdentities, setFilteredIdentities] = useState(identities)

  useEffect(() => {
    setFilteredIdentities(
      identities.filter(
        ({ address, name }) =>
          searchTerm === '' ||
          name.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1 ||
          address.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1
      )
    )
  }, [searchTerm, identities])

  return {
    filteredIdentities,
    handleSearchTermChange: setSearchTerm,
    searchTerm,
  }
}

export default useFilterIdentities
