import cloneDeep from 'lodash.clonedeep'
import { image } from '../../../modules/things'
import { reformatNestedFields } from '../../utils'

export const initialState = {}

export const fetchingPublicProfile = () => ({
  // basic loading of public profiles
  loadingPublicProf: true,
  loadedPublicProf: false,
  loadedPublicProfSuccess: false,
  // for tracking https://projects.invisionapp.com/d/main#/console/17511474/363488290/preview
  savingProfile: false,
  savedProfile: false,
  savedProfileSucess: false,
  removingItem: false,
  removedItem: false,
  removedItemSuccess: false,
  // for tracking https://projects.invisionapp.com/share/AQS14BPCG9R#/screens
  messageSigning: {
    openingProf: false,
    openedProfError: false,
    openedProfSuccess: false,
    syncingProf: false,
    syncedProfError: false,
    syncedProfSuccess: false,
    creatingProf: false,
    createdProfError: false,
    createdProfSuccess: false,
  },
  // an unlocked profile is both opened and synced, which is why their state is set in a few different places
  unlockingProf: false,
  unlockedProf: false,
  unlockedProfSuccess: false,
  unlockedBox: {},
  publicProfile: {},
  // handles forms throughout the application
  forms: {
    name: '',
    job: '',
    workPlace: '',
    location: '',
    school: '',
    website: '',
    description: '',
    workHistory: {},
    educationHistory: {},
  },
  changed: [],
  // to display image loading status
  uploadingImage: false,
  uploadedImageSuccess: false,
  uploadedImage: false,
})

export const fetchedPublicProfileSuccess = (state, profile) => {
  const publicProfile = reformatNestedFields(profile)
  return {
    ...state,
    loadingPublicProf: false,
    loadedPublicProf: true,
    loadedPublicProfSuccess: true,
    publicProfile,
    forms: { ...state.forms, ...publicProfile },
    changed: [],
  }
}

export const fetchedPublicProfileErr = (state, error) => ({
  ...state,
  loadingPublicProf: false,
  loadedPublicProf: true,
  loadedPublicProfSuccess: true,
  error,
})

export const requestedProfUnlock = state => ({
  ...state,
  unlockingProf: true,
  unlockedProf: false,
  unlockedProfSuccess: false,
  unlockedBox: {},
  messageSigning: {
    ...state.messageSigning,
    unlockingProf: true,
    unlockedProf: false,
    unlockedProfSuccess: false,
  },
})

export const profileUnlocked = (state, unlockedBox) => ({
  ...state,
  unlockingProf: false,
  unlockedProf: true,
  unlockedProfSuccess: true,
  editedProfile: false,
  unlockedBox,
  messageSigning: {
    ...state.messageSigning,
    unlockingProf: false,
    unlockedProf: true,
    unlockedProfSuccess: true,
  },
})

export const profileUnlockFailed = (state, error) => ({
  ...state,
  unlockingProf: false,
  unlockedProf: true,
  unlockedProfSuccess: false,
  error,
  messageSigning: {
    ...state.messageSigning,
    unlockingProf: false,
    unlockedProf: true,
    unlockedProfSuccess: false,
  },
})

const calculateChanged = (changed, field) => {
  if (!changed) return [field]

  if (!changed.includes(field)) return [...changed, field]
  return changed
}

export const editedField = (state, field, value, uniqueId, nestedField) => {
  const newFormVals = cloneDeep({ ...state.forms })
  if (!uniqueId) newFormVals[field] = value
  else {
    let newNestedField = {
      ...newFormVals[field][uniqueId],
      [nestedField]: value,
    }
    if (!value) delete newNestedField[nestedField]

    newFormVals[field][uniqueId] = newNestedField
  }

  return {
    ...state,
    forms: newFormVals,
    changed: calculateChanged(state.changed, field),
  }
}

export const uploadingImage = state => ({
  ...state,
  uploadingImage: true,
  uploadedImageSuccess: false,
  uploadedImage: false,
})

export const uploadedImage = (state, imageTag, imageContentHash) => {
  const newFormVals = cloneDeep({ ...state.forms })
  newFormVals[imageTag] = image(imageContentHash)
  const newState = {
    ...state,
    uploadingImage: false,
    uploadedImageSuccess: true,
    uploadedImage: true,
    forms: newFormVals,
    changed: calculateChanged(state.changed, imageTag),
  }
  return newState
}

export const uploadedImageError = (state, error) => ({
  ...state,
  uploadingImage: false,
  uploadedImageSuccess: false,
  uploadedImage: true,
  image_error: error,
})

export const requestedSaveProfile = state => ({
  ...state,
  savingProfile: true,
  savedProfile: false,
  savedProfileSucess: false,
})

export const requestedSaveProfileSuccess = (state, profile) => ({
  ...state,
  savingProfile: false,
  savedProfile: true,
  savedProfileSucess: true,
  publicProfile: {
    ...state.publicProfile,
    ...profile,
  },
  changed: [],
})

export const requestedSaveProfileError = (state, error) => ({
  ...state,
  savingProfile: false,
  savedProfile: true,
  savedProfileSucess: false,
  error,
})

export const requestedProfileItemRemove = state => ({
  ...state,
  removingItem: true,
  removedItem: false,
  removedItemSuccess: false,
})

export const requestedProfileItemRemoveSuccess = (state, profile) => {
  const publicProfile = reformatNestedFields(profile)
  return {
    ...state,
    removingItem: false,
    removedItem: true,
    removedItemSuccess: true,
    publicProfile,
    forms: { ...state.forms, ...publicProfile },
  }
}

export const requestedProfileItemRemoveError = (state, error) => ({
  ...state,
  removingItem: false,
  removedItem: true,
  removedItemSuccess: false,
  error,
})

export const requestProfileCreate = state => ({
  ...state,
  messageSigning: {
    ...state.messageSigning,
    creatingProf: true,
    createdProfError: false,
    createdProfSuccess: false,
  },
})

export const requestProfileCreateSuccess = state => ({
  ...state,
  messageSigning: {
    ...state.messageSigning,
    creatingProf: false,
    createdProfError: false,
    createdProfSuccess: true,
  },
})

export const requestProfileCreateError = state => ({
  ...state,
  messageSigning: {
    ...state.messageSigning,
    creatingProf: false,
    createdProfError: true,
    createdProfSuccess: false,
  },
})

export const requestProfileOpen = state => ({
  ...state,
  unlockingProf: true,
  unlockedProf: false,
  unlockedProfSuccess: false,
  messageSigning: {
    ...state.messageSigning,
    openingProf: true,
    openedProfError: false,
    openedProfSuccess: false,
  },
})

export const requestProfileOpenSuccess = state => ({
  ...state,
  messageSigning: {
    ...state.messageSigning,
    openingProf: false,
    openedProfError: false,
    openedProfSuccess: true,
  },
})

export const requestProfileOpenError = (state, error) => ({
  ...state,
  error,
  messageSigning: {
    ...state.messageSigning,
    openingProf: false,
    openedProfError: true,
    openedProfSuccess: false,
  },
  unlockingProf: false,
  unlockedProf: false,
  unlockedProfSuccess: false,
})

export const requestProfileSync = state => ({
  ...state,
  messageSigning: {
    ...state.messageSigning,
    syncingProf: true,
    syncedProfError: false,
    syncedProfSuccess: false,
  },
})

export const requestProfileSyncSuccess = (state, syncedBox) => ({
  ...state,
  unlockingProf: false,
  unlockedProf: true,
  unlockedProfSuccess: true,
  unlockedBox: syncedBox,
  messageSigning: {
    ...state.messageSigning,
    syncingProf: false,
    syncedProfError: false,
    syncedProfSuccess: true,
  },
})

export const requestProfileSyncError = (state, error) => ({
  ...state,
  unlockingProf: false,
  unlockedProf: true,
  unlockedProfSuccess: false,
  error,
  messageSigning: {
    ...state.messageSigning,
    syncingProf: false,
    syncedProfError: true,
    syncedProfSuccess: false,
  },
})
