import React from 'react'
import { Toast } from '@aragon/ui'
import ShareModal from './ShareModal'
import RemoveModal from './RemoveModal'
import EmptyIdentities from './EmptyIdentities'
import LocalIdentities from './LocalIdentities'
import useLocalIdentities from './useLocalIdentities'
import useFilterIdentities from './useFilterIdentities'
import useSelectIdentities from './useSelectIdentities'
import useIdentitiesActions from './useIdentitiesActions'
import useLocalIdentityModal from './useLocalIdentityModal'

const TIMEOUT_TOAST = 4000

function CustomLabels({
  wrapper,
  dao,
  toast,
  isSharedLink,
  isSavingSharedLink,
  sharedIdentities,
  handleSharedIdentitiesSave,
  handleSharedIdentitiesCancel,
}) {
  const { identities } = useLocalIdentities(wrapper)
  const identitiesToUse = isSharedLink ? sharedIdentities : identities

  const {
    filteredIdentities,
    handleSearchTermChange,
    searchTerm,
  } = useFilterIdentities(identitiesToUse)
  const {
    allSelected,
    handleToggleAll,
    handleToggleIdentity,
    identitiesSelected,
    someSelected,
  } = useSelectIdentities(identitiesToUse, filteredIdentities)
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
    filteredIdentities,
    identitiesSelected,
    someSelected,
    toast,
    wrapper,
  })
  const { handleShowLocalIdentityModal } = useLocalIdentityModal()
  const handleClearSearchTerm = () =>
    handleSearchTermChange({ currentTarget: { value: '' } })

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
      {!identitiesToUse.length && searchTerm === '' ? (
        <EmptyIdentities onImport={handleImport} />
      ) : (
        <LocalIdentities
          allSelected={allSelected}
          identities={filteredIdentities}
          identitiesSelected={identitiesSelected}
          onClear={handleClearSearchTerm}
          onExport={handleExport}
          onImport={handleImport}
          onRemove={handleRemoveModalOpen}
          onSearchChange={handleSearchTermChange}
          onShare={handleShareModalOpen}
          onToggleAll={handleToggleAll}
          onToggleIdentity={handleToggleIdentity}
          searchTerm={searchTerm}
          onShowLocalIdentityModal={handleShowLocalIdentityModal}
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
