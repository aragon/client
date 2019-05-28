import React, { useContext, useState } from 'react'
import PropTypes from 'prop-types'
import { Modal } from '@aragon/ui'
import uuidv1 from 'uuid/v1'

import { BoxContext } from '../../wrappers/box'
import { ModalContext } from '../../wrappers/modal'
import {
  editField,
  savingProfile,
  savedProfile,
  saveProfileError,
  removingItem,
  removedItem,
  removedItemError,
} from '../../stateManagers/box'
import { unlockAndCreateBoxIfRequired } from '../../utils'
import { close } from '../../stateManagers/modal'
import WorkHistoryModal from './WorkHistory'
import BasicInformationModal from './BasicInformation'
import EducationHistoryModal from './EducationHistory'
import RemoveItem from './RemoveItem'
import BoxState from './BoxState'

const UserInfoModal = ({ ethereumAddress }) => {
  const { boxes, dispatch } = useContext(BoxContext)
  const { modal, dispatchModal } = useContext(ModalContext)
  // const { api } = useAragonApi()
  const api = {}
  const [key, setKey] = useState(uuidv1())

  const userLoaded = !!boxes[ethereumAddress]

  const onChange = (value, field, uniqueId, nestedField) => {
    dispatch(editField(ethereumAddress, field, value, uniqueId, nestedField))
  }

  const getFormValue = (field, uniqueId, nestedField) => {
    let value
    if (!userLoaded) value = ''
    else if (!uniqueId) value = boxes[ethereumAddress].forms[field]
    else if (!nestedField) value = boxes[ethereumAddress].forms[field][uniqueId]
    else
      value =
        boxes[ethereumAddress].forms[field][uniqueId] &&
        boxes[ethereumAddress].forms[field][uniqueId][nestedField]

    return value || ''
  }

  const delay = () =>
    new Promise(resolve => {
      setTimeout(() => {
        resolve()
      }, 3000)
    })

  const saveProfile = async ethereumAddress => {
    dispatch(savingProfile(ethereumAddress))

    try {
      const { changed, forms } = boxes[ethereumAddress]
      const calculateChanged = field => {
        if (field === 'workHistory' || field === 'educationHistory') {
          return Object.keys(forms[field]).map(id => forms[field][id])
        }
        return forms[field]
      }

      const changedValues = changed.map(calculateChanged)
      // unlockAndCreateBoxIfRequired opens the signature modal, and handles errors
      const unlockedBox = await unlockAndCreateBoxIfRequired(
        boxes[ethereumAddress],
        dispatch,
        dispatchModal,
        ethereumAddress,
        api
      )
      if (unlockedBox) {
        await unlockedBox.setPublicFields(changed, changedValues)
        dispatch(savedProfile(ethereumAddress, forms))
        await delay()
        dispatchModal(close())
        setKey(uuidv1())
      }
    } catch (error) {
      dispatch(saveProfileError(ethereumAddress, error))
    }
  }

  if (!userLoaded) return null

  const removeItem = async () => {
    dispatch(removingItem(ethereumAddress))
    try {
      const { forms } = boxes[ethereumAddress]
      const { itemType, id } = modal

      const unlockedBox = await unlockAndCreateBoxIfRequired(
        boxes[ethereumAddress],
        dispatch,
        dispatchModal,
        ethereumAddress,
        api
      )
      if (unlockedBox) {
        if (itemType === 'image' || itemType === 'coverPhoto') {
          await unlockedBox.removePublicField(itemType)
        } else {
          delete forms[itemType][id]
          const newBoxVals = Object.keys(forms[itemType]).map(
            id => forms[itemType][id]
          )
          await unlockedBox.setPublicFields([itemType], [newBoxVals])
        }

        const updatedProfile = await unlockedBox.getPublic()

        dispatch(removedItem(ethereumAddress, updatedProfile))
        dispatchModal(close())
      }
    } catch (err) {
      dispatch(removedItemError(ethereumAddress, err))
    }
  }

  const { error } = boxes[ethereumAddress]

  const savingError =
    boxes[ethereumAddress].savedProfile &&
    !boxes[ethereumAddress].savedProfileSucess
      ? { error: `Error saving profile: ${error.message}` }
      : {}
  const removingError =
    boxes[ethereumAddress].removedItem &&
    !boxes[ethereumAddress].removedItemSuccess
      ? { error: `Error removing item: ${error.message}` }
      : {}

  const modalsCommonProps = {
    ethereumAddress,
    getFormValue,
    onChange,
    saveProfile,
    savingError,
    removingError,
  }

  return (
    <Modal visible={!!modal.type} padding="0">
      {modal.type === 'basicInformation' && (
        <BasicInformationModal {...modalsCommonProps} />
      )}

      {modal.type === 'educationHistory' && (
        <EducationHistoryModal
          educationHistoryId={modal.id || key}
          {...modalsCommonProps}
        />
      )}

      {modal.type === 'workHistory' && (
        <WorkHistoryModal
          workHistoryId={modal.id || key}
          {...modalsCommonProps}
        />
      )}
      {modal.type === 'removeItem' && (
        <RemoveItem
          itemType={modal.itemType}
          onRemove={removeItem}
          removingError={removingError}
        />
      )}
      {modal.type === '3boxState' && (
        <BoxState
          messageSigning={boxes[ethereumAddress].messageSigning}
          signaturesRequired={modal.sigsRequired}
        />
      )}
    </Modal>
  )
}

UserInfoModal.propTypes = {
  ethereumAddress: PropTypes.string.isRequired,
}

export default UserInfoModal
