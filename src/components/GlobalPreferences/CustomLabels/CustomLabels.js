import React, { useCallback } from 'react'
import PropTypes from 'prop-types'
import { AragonType } from '../../../prop-types'
import ShareModal from './ShareModal'
import RemoveModal from './RemoveModal'
import EmptyIdentities from './EmptyIdentities'
import LocalIdentities from './LocalIdentities'
import useLocalIdentities from './useLocalIdentities'
import useFilterIdentities from './useFilterIdentities'
import useSelectIdentities from './useSelectIdentities'
import useIdentitiesActions from './useIdentitiesActions'
import useLocalIdentityModal from './useLocalIdentityModal'
import useSort from './useSort'

function CustomLabels({ wrapper, dao, locator }) {
  const { identities } = useLocalIdentities(wrapper)
  const {
    filteredIdentities,
    handleSearchTermChange,
    onSearchTerm,
    searchTerm,
  } = useFilterIdentities(identities)
  const {
    allSelected,
    handleToggleAll,
    handleToggleIdentity,
    identitiesSelected,
    someSelected,
  } = useSelectIdentities(identities, filteredIdentities)
  const {
    handleExport,
    handleImport,
    handleRemove,
    handleRemoveModalClose,
    handleRemoveModalOpen,
    handleShareModalClose,
    handleShareModalOpen,
    removeModalOpened,
    shareLink,
    shareModalOpened,
  } = useIdentitiesActions({
    locator,
    filteredIdentities,
    identitiesSelected,
    someSelected,
    wrapper,
  })
  const { handleShowLocalIdentityModal } = useLocalIdentityModal()
  const handleClearSearchTerm = useCallback(() => handleSearchTermChange(''), [
    handleSearchTermChange,
  ])
  const { sortedIdentities, sort, handleToggleSort } = useSort(
    filteredIdentities
  )

  return (
    <React.Fragment>
      <ShareModal
        link={shareLink}
        onClose={handleShareModalClose}
        visible={shareModalOpened}
      />
      <RemoveModal
        visible={removeModalOpened}
        onClose={handleRemoveModalClose}
        onConfirm={handleRemove}
      />
      {!identities.length && searchTerm === '' ? (
        <EmptyIdentities onImport={handleImport} />
      ) : (
        <LocalIdentities
          allSelected={allSelected}
          identities={sortedIdentities}
          identitiesSelected={identitiesSelected}
          onClear={handleClearSearchTerm}
          onExport={handleExport}
          onImport={handleImport}
          onRemove={handleRemoveModalOpen}
          onSearchChange={handleSearchTermChange}
          onSearchTerm={onSearchTerm}
          onShare={handleShareModalOpen}
          onToggleAll={handleToggleAll}
          onToggleIdentity={handleToggleIdentity}
          onToggleSort={handleToggleSort}
          searchTerm={searchTerm}
          onShowLocalIdentityModal={handleShowLocalIdentityModal}
          someSelected={someSelected}
          sort={sort}
        />
      )}
    </React.Fragment>
  )
}

CustomLabels.propTypes = {
  dao: PropTypes.string,
  wrapper: AragonType,
  locator: PropTypes.object,
}

export default React.memo(CustomLabels)
