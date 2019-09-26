import { useMemo, useState } from 'react'

const ASC = Symbol('asc')
const DESC = Symbol('desc')
const sortDesc = (a, b) => b.name.localeCompare(a.name)
const sortAsc = (a, b) => a.name.localeCompare(b.name)

function useSort(filteredIdentities) {
  const [sort, setSort] = useState(ASC)
  const sortedIdentities = useMemo(
    () => filteredIdentities.sort(sort === ASC ? sortAsc : sortDesc),
    [filteredIdentities, sort]
  )
  return {
    sortedIdentities,
    sort,
    handleToggleSort: () => setSort(sort === ASC ? DESC : ASC),
  }
}

export { ASC, DESC }
export default useSort
