import {
  FETCHING_PUBLIC_PROFILE,
  FETCHED_PUBLIC_PROFILE_SUCCESS,
  FETCHED_PUBLIC_PROFILE_ERROR,
  REQUESTED_PROFILE_UNLOCK,
  PROFILE_UNLOCK_SUCCESS,
  PROFILE_UNLOCK_FAILURE,
  REQUEST_EDIT_PROFILE,
  EDIT_FIELD,
  UPLOADING_IMAGE,
  UPLOADED_IMAGE_SUCCESS,
  UPLOADED_IMAGE_FAILURE,
  REQUESTED_PROFILE_SAVE,
  REQUESTED_PROFILE_SAVE_SUCCESS,
  REQUESTED_PROFILE_SAVE_ERROR,
  REQUESTED_PROFILE_ITEM_REMOVE,
  REQUESTED_PROFILE_ITEM_REMOVE_SUCCESS,
  REQUESTED_PROFILE_ITEM_REMOVE_ERROR,
  REQUEST_PROFILE_CREATE,
  REQUEST_PROFILE_CREATE_SUCCESS,
  REQUEST_PROFILE_CREATE_ERROR,
  REQUESTED_PROFILE_SYNC,
  REQUESTED_PROFILE_SYNC_SUCCESS,
  REQUESTED_PROFILE_SYNC_FAILURE,
  REQUESTED_PROFILE_OPEN,
  REQUESTED_PROFILE_OPEN_SUCCESS,
  REQUESTED_PROFILE_OPEN_FAILURE,
} from './actionTypes'

import {
  fetchingPublicProfile,
  fetchedPublicProfileSuccess,
  fetchedPublicProfileErr,
  requestedProfUnlock,
  profileUnlocked,
  profileUnlockFailed,
  requestProfileEdit,
  editedField,
  uploadingImage,
  uploadedImage,
  uploadedImageError,
  requestedSaveProfile,
  requestedSaveProfileSuccess,
  requestedSaveProfileError,
  requestedProfileItemRemove,
  requestedProfileItemRemoveSuccess,
  requestedProfileItemRemoveError,
  requestProfileCreate,
  requestProfileCreateSuccess,
  requestProfileCreateError,
  requestProfileSync,
  requestProfileSyncSuccess,
  requestProfileSyncError,
  requestProfileOpen,
  requestProfileOpenSuccess,
  requestProfileOpenError,
} from './states'

import { log } from '../../../utils'

const logStateUpdate = (action, prevState, nextState) => {
  log('ACTION: ', action, 'PREV STATE: ', prevState, 'NEXT STATE:', nextState)
}

const boxReducer = (prevState, action) => {
  switch (action.type) {
    case FETCHING_PUBLIC_PROFILE: {
      const nextState = { ...prevState }
      nextState[action.meta.ethereumAddress] = fetchingPublicProfile()
      logStateUpdate(action, prevState, nextState)
      return nextState
    }
    case FETCHED_PUBLIC_PROFILE_SUCCESS: {
      const nextState = { ...prevState }
      const ethereumAddress = action.meta.ethereumAddress
      nextState[ethereumAddress] = fetchedPublicProfileSuccess(
        prevState[ethereumAddress],
        action.payload.publicProfile
      )
      logStateUpdate(action, prevState, nextState)
      return nextState
    }
    case FETCHED_PUBLIC_PROFILE_ERROR: {
      const nextState = { ...prevState }
      const ethereumAddress = action.meta.ethereumAddress
      nextState[ethereumAddress] = fetchedPublicProfileErr(
        prevState[ethereumAddress],
        action.error
      )
      logStateUpdate(action, prevState, nextState)
      return nextState
    }
    case REQUESTED_PROFILE_UNLOCK: {
      const nextState = { ...prevState }
      const ethereumAddress = action.meta.ethereumAddress
      const hasBox = action.meta.hasBox
      nextState[ethereumAddress] = requestedProfUnlock(
        prevState[ethereumAddress],
        hasBox
      )
      logStateUpdate(action, prevState, nextState)
      return nextState
    }
    case PROFILE_UNLOCK_SUCCESS: {
      const nextState = { ...prevState }
      const ethereumAddress = action.meta.ethereumAddress
      nextState[ethereumAddress] = profileUnlocked(
        prevState[ethereumAddress],
        action.payload.unlockedProfile
      )
      logStateUpdate(action, prevState, nextState)
      return nextState
    }
    case PROFILE_UNLOCK_FAILURE: {
      const nextState = { ...prevState }
      const ethereumAddress = action.meta.ethereumAddress
      nextState[ethereumAddress] = profileUnlockFailed(
        prevState[ethereumAddress],
        action.error
      )
      logStateUpdate(action, prevState, nextState)
      return nextState
    }
    case REQUEST_EDIT_PROFILE: {
      const nextState = { ...prevState }
      const ethereumAddress = action.meta.ethereumAddress
      nextState[ethereumAddress] = requestProfileEdit(
        prevState[ethereumAddress]
      )
      logStateUpdate(action, prevState, nextState)
      return nextState
    }
    case EDIT_FIELD: {
      const nextState = { ...prevState }
      const ethereumAddress = action.meta.ethereumAddress
      const { field, uniqueId, nestedField } = action.meta
      const value = action.payload.value
      nextState[ethereumAddress] = editedField(
        prevState[ethereumAddress],
        field,
        value,
        uniqueId,
        nestedField
      )
      logStateUpdate(action, prevState, nextState)
      return nextState
    }
    case UPLOADING_IMAGE: {
      const nextState = { ...prevState }
      const ethereumAddress = action.meta.ethereumAddress
      nextState[ethereumAddress] = uploadingImage(prevState[ethereumAddress])
      logStateUpdate(action, prevState, nextState)
      return nextState
    }
    case UPLOADED_IMAGE_SUCCESS: {
      const nextState = { ...prevState }
      const ethereumAddress = action.meta.ethereumAddress
      const { imageTag, imageContentHash } = action.payload
      nextState[ethereumAddress] = uploadedImage(
        prevState[ethereumAddress],
        imageTag,
        imageContentHash
      )
      logStateUpdate(action, prevState, nextState)
      return nextState
    }
    case UPLOADED_IMAGE_FAILURE: {
      const nextState = { ...prevState }
      const ethereumAddress = action.meta.ethereumAddress
      nextState[ethereumAddress] = uploadedImageError(
        prevState[ethereumAddress],
        action.error
      )
      logStateUpdate(action, prevState, nextState)
      return nextState
    }
    case REQUESTED_PROFILE_SAVE: {
      const nextState = { ...prevState }
      const ethereumAddress = action.meta.ethereumAddress
      nextState[ethereumAddress] = requestedSaveProfile(
        prevState[ethereumAddress]
      )
      logStateUpdate(action, prevState, nextState)
      return nextState
    }
    case REQUESTED_PROFILE_SAVE_SUCCESS: {
      const nextState = { ...prevState }
      const ethereumAddress = action.meta.ethereumAddress
      nextState[ethereumAddress] = requestedSaveProfileSuccess(
        prevState[ethereumAddress],
        action.payload.profile
      )
      logStateUpdate(action, prevState, nextState)
      return nextState
    }
    case REQUESTED_PROFILE_SAVE_ERROR: {
      const nextState = { ...prevState }
      const ethereumAddress = action.meta.ethereumAddress
      nextState[ethereumAddress] = requestedSaveProfileError(
        prevState[ethereumAddress],
        action.error
      )
      logStateUpdate(action, prevState, nextState)
      return nextState
    }
    case REQUESTED_PROFILE_ITEM_REMOVE: {
      const nextState = { ...prevState }
      const ethereumAddress = action.meta.ethereumAddress
      nextState[ethereumAddress] = requestedProfileItemRemove(
        prevState[ethereumAddress]
      )
      logStateUpdate(action, prevState, nextState)
      return nextState
    }
    case REQUESTED_PROFILE_ITEM_REMOVE_SUCCESS: {
      const nextState = { ...prevState }
      const ethereumAddress = action.meta.ethereumAddress
      nextState[ethereumAddress] = requestedProfileItemRemoveSuccess(
        prevState[ethereumAddress],
        action.payload.profile
      )
      logStateUpdate(action, prevState, nextState)
      return nextState
    }
    case REQUESTED_PROFILE_ITEM_REMOVE_ERROR: {
      const nextState = { ...prevState }
      const ethereumAddress = action.meta.ethereumAddress
      nextState[ethereumAddress] = requestedProfileItemRemoveError(
        prevState[ethereumAddress],
        action.error
      )
      logStateUpdate(action, prevState, nextState)
      return nextState
    }
    case REQUEST_PROFILE_CREATE: {
      const nextState = { ...prevState }
      const ethereumAddress = action.meta.ethereumAddress
      nextState[ethereumAddress] = requestProfileCreate(
        prevState[ethereumAddress]
      )
      logStateUpdate(action, prevState, nextState)
      return nextState
    }
    case REQUEST_PROFILE_CREATE_SUCCESS: {
      const nextState = { ...prevState }
      const ethereumAddress = action.meta.ethereumAddress
      nextState[ethereumAddress] = requestProfileCreateSuccess(
        prevState[ethereumAddress]
      )
      logStateUpdate(action, prevState, nextState)
      return nextState
    }
    case REQUEST_PROFILE_CREATE_ERROR: {
      const nextState = { ...prevState }
      const ethereumAddress = action.meta.ethereumAddress
      nextState[ethereumAddress] = requestProfileCreateError(
        prevState[ethereumAddress],
        action.payload.error
      )
      logStateUpdate(action, prevState, nextState)
      return nextState
    }
    case REQUESTED_PROFILE_OPEN: {
      const nextState = { ...prevState }
      const ethereumAddress = action.meta.ethereumAddress
      nextState[ethereumAddress] = requestProfileOpen(
        prevState[ethereumAddress]
      )
      logStateUpdate(action, prevState, nextState)
      return nextState
    }
    case REQUESTED_PROFILE_OPEN_SUCCESS: {
      const nextState = { ...prevState }
      const ethereumAddress = action.meta.ethereumAddress
      nextState[ethereumAddress] = requestProfileOpenSuccess(
        prevState[ethereumAddress]
      )
      logStateUpdate(action, prevState, nextState)
      return nextState
    }
    case REQUESTED_PROFILE_OPEN_FAILURE: {
      const nextState = { ...prevState }
      const ethereumAddress = action.meta.ethereumAddress
      nextState[ethereumAddress] = requestProfileOpenError(
        prevState[ethereumAddress],
        action.payload.error
      )
      logStateUpdate(action, prevState, nextState)
      return nextState
    }
    case REQUESTED_PROFILE_SYNC: {
      const nextState = { ...prevState }
      const ethereumAddress = action.meta.ethereumAddress
      nextState[ethereumAddress] = requestProfileSync(
        prevState[ethereumAddress]
      )
      logStateUpdate(action, prevState, nextState)
      return nextState
    }
    case REQUESTED_PROFILE_SYNC_SUCCESS: {
      const nextState = { ...prevState }
      const ethereumAddress = action.meta.ethereumAddress
      nextState[ethereumAddress] = requestProfileSyncSuccess(
        prevState[ethereumAddress],
        action.payload.profile
      )
      logStateUpdate(action, prevState, nextState)
      return nextState
    }
    case REQUESTED_PROFILE_SYNC_FAILURE: {
      const nextState = { ...prevState }
      const ethereumAddress = action.meta.ethereumAddress
      nextState[ethereumAddress] = requestProfileSyncError(
        prevState[ethereumAddress],
        action.payload.error
      )
      logStateUpdate(action, prevState, nextState)
      return nextState
    }
    default: {
      return prevState
    }
  }
}

export default boxReducer
