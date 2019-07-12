import React, { useCallback } from 'react'
import PropTypes from 'prop-types'
import { Toast } from '@aragon/ui'
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

const TIMEOUT_TOAST = 4000

function CustomLabels({ wrapper, dao, toast, locator }) {
  const { identities, sortIdentities, handleToggleSort } = useLocalIdentities(
    wrapper
  )
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
    locator,
    filteredIdentities,
    identitiesSelected,
    someSelected,
    toast,
    wrapper,
  })
  const { handleShowLocalIdentityModal } = useLocalIdentityModal()
  const handleClearSearchTerm = useCallback(
    () => handleSearchTermChange({ currentTarget: { value: '' } }),
    [handleSearchTermChange]
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
          onToggleSort={handleToggleSort}
          searchTerm={searchTerm}
          onShowLocalIdentityModal={handleShowLocalIdentityModal}
          someSelected={someSelected}
          sortIdentities={sortIdentities}
        />
      )}
    </React.Fragment>
  )
}

CustomLabels.propTypes = {
  dao: PropTypes.string,
  toast: PropTypes.func.isRequired,
  wrapper: AragonType,
  locator: PropTypes.object,
}

const CustomLabelsMemo = React.memo(CustomLabels)

export default React.memo(props => (
  <Toast timeout={TIMEOUT_TOAST}>
    {toast => <CustomLabelsMemo {...props} toast={toast} />}
  </Toast>
))
