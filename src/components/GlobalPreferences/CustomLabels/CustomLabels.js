import React from 'react'
import { Toast } from '@aragon/ui'
import ShareModal from './ShareModal'
import RemoveModal from './RemoveModal'
import EmptyLocalIdentities from './EmptyLocalIdentities'
import LocalIdentities from './LocalIdentities'
import useLocalIdentities from './useLocalIdentities'
import useFilterIdentities from './useFilterIdentities'
import useSelectIdentities from './useSelectIdentities'
import useIdentitiesActions from './useIdentitiesActions'

const TIMEOUT_TOAST = 4000

function CustomLabels({ wrapper, dao, toast }) {
  const { identities } = useLocalIdentities(wrapper)
  const {
    filteredIdentities,
    handleSearchTermChange,
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
    dao,
    identities,
    filteredIdentities,
    identitiesSelected,
    someSelected,
    toast,
    wrapper,
  })

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
        <EmptyLocalIdentities onImport={handleImport} />
      ) : (
        <LocalIdentities
          allSelected={allSelected}
          identities={filteredIdentities}
          identitiesSelected={identitiesSelected}
          onExport={handleExport}
          onImport={handleImport}
          onRemove={handleRemoveModalOpen}
          onSearchChange={handleSearchTermChange}
          onShare={handleShareModalOpen}
          onToggleAll={handleToggleAll}
          onToggleIdentity={handleToggleIdentity}
          searchTerm={searchTerm}
          someSelected={someSelected}
        />
      )}
    </React.Fragment>
  )
}

export default props => (
  <Toast timeout={TIMEOUT_TOAST}>
    {toast => <CustomLabels {...props} toast={toast} />}
  </Toast>
)
