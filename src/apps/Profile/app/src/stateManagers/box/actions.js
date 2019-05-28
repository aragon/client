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

export const fetchingProfile = ethereumAddress => ({
  type: FETCHING_PUBLIC_PROFILE,
  meta: {
    ethereumAddress,
  },
})

export const fetchedPublicProfile = (ethereumAddress, publicProfile) => ({
  type: FETCHED_PUBLIC_PROFILE_SUCCESS,
  meta: {
    ethereumAddress,
  },
  payload: {
    publicProfile,
  },
})

export const fetchedPublicProfileError = (ethereumAddress, error) => ({
  type: FETCHED_PUBLIC_PROFILE_ERROR,
  meta: {
    ethereumAddress,
  },
  payload: {},
  error,
})

export const requestedProfileUnlock = (ethereumAddress, hasBox) => ({
  type: REQUESTED_PROFILE_UNLOCK,
  meta: {
    ethereumAddress,
    hasBox,
  },
})

export const profileUnlockSuccess = (ethereumAddress, unlockedProfile) => ({
  type: PROFILE_UNLOCK_SUCCESS,
  meta: {
    ethereumAddress,
  },
  payload: {
    unlockedProfile,
  },
})

export const profileUnlockFailure = (ethereumAddress, error) => ({
  type: PROFILE_UNLOCK_FAILURE,
  meta: {
    ethereumAddress,
  },
  error,
})

export const requestProfileEdit = ethereumAddress => ({
  type: REQUEST_EDIT_PROFILE,
  meta: {
    ethereumAddress,
  },
})

// uniqueId is used only when a field is nested (like workHistory and educationHistory)
export const editField = (
  ethereumAddress,
  field,
  value,
  uniqueId,
  nestedField
) => ({
  type: EDIT_FIELD,
  meta: {
    ethereumAddress,
    field,
    uniqueId,
    nestedField,
  },
  payload: {
    value,
  },
})

export const uploadingImage = ethereumAddress => ({
  type: UPLOADING_IMAGE,
  meta: {
    ethereumAddress,
  },
})

export const uploadedImage = (ethereumAddress, imageTag, imageContentHash) => ({
  type: UPLOADED_IMAGE_SUCCESS,
  meta: {
    ethereumAddress,
  },
  payload: {
    imageTag,
    imageContentHash,
  },
})

export const uploadedImageFailure = (ethereumAddress, error) => ({
  type: UPLOADED_IMAGE_FAILURE,
  meta: {
    ethereumAddress,
  },
  error,
})

export const requestProfileCreate = ethereumAddress => ({
  type: REQUEST_PROFILE_CREATE,
  meta: {
    ethereumAddress,
  },
})

export const requestProfileCreateSuccess = ethereumAddress => ({
  type: REQUEST_PROFILE_CREATE_SUCCESS,
  meta: {
    ethereumAddress,
  },
})
export const requestProfileCreateError = (ethereumAddress, error) => ({
  type: REQUEST_PROFILE_CREATE_ERROR,
  meta: {
    ethereumAddress,
  },
  payload: {
    error,
  },
})

export const savingProfile = ethereumAddress => ({
  type: REQUESTED_PROFILE_SAVE,
  meta: {
    ethereumAddress,
  },
})

export const savedProfile = (ethereumAddress, profile) => ({
  type: REQUESTED_PROFILE_SAVE_SUCCESS,
  meta: {
    ethereumAddress,
  },
  payload: {
    profile,
  },
})

export const saveProfileError = (ethereumAddress, error) => ({
  type: REQUESTED_PROFILE_SAVE_ERROR,
  meta: {
    ethereumAddress,
  },
  error,
})

export const removingItem = ethereumAddress => ({
  type: REQUESTED_PROFILE_ITEM_REMOVE,
  meta: {
    ethereumAddress,
  },
})

export const removedItem = (ethereumAddress, profile) => ({
  type: REQUESTED_PROFILE_ITEM_REMOVE_SUCCESS,
  meta: {
    ethereumAddress,
  },
  payload: {
    profile,
  },
})

export const removedItemError = (ethereumAddress, error) => ({
  type: REQUESTED_PROFILE_ITEM_REMOVE_ERROR,
  meta: {
    ethereumAddress,
  },
  error,
})

export const profileOpenRequest = ethereumAddress => ({
  type: REQUESTED_PROFILE_OPEN,
  meta: {
    ethereumAddress,
  },
})
export const profileOpenSuccess = ethereumAddress => ({
  type: REQUESTED_PROFILE_OPEN_SUCCESS,
  meta: {
    ethereumAddress,
  },
})
export const profileOpenFailure = (ethereumAddress, error) => ({
  type: REQUESTED_PROFILE_OPEN_FAILURE,
  meta: {
    ethereumAddress,
  },
  payload: {
    error,
  },
})

export const profileSyncRequest = ethereumAddress => ({
  type: REQUESTED_PROFILE_SYNC,
  meta: {
    ethereumAddress,
  },
})
export const profileSyncSuccess = (ethereumAddress, profile) => ({
  type: REQUESTED_PROFILE_SYNC_SUCCESS,
  meta: {
    ethereumAddress,
  },
  payload: {
    profile,
  },
})
export const profileSyncFailure = (ethereumAddress, error) => ({
  type: REQUESTED_PROFILE_SYNC_FAILURE,
  meta: {
    ethereumAddress,
  },
  payload: {
    error,
  },
})
