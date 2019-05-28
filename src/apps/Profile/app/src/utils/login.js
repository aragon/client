import { Profile } from '../../modules/3box-aragon'

import {
  saveProfileError,
  requestProfileCreate,
  requestProfileCreateSuccess,
  requestProfileCreateError,
  profileOpenRequest,
  profileOpenSuccess,
  profileOpenFailure,
  profileSyncRequest,
  profileSyncSuccess,
  profileSyncFailure,
} from '../stateManagers/box'

import { openBoxState } from '../stateManagers/modal'

export const unlockAndCreateBoxIfRequired = async (
  box,
  dispatch,
  dispatchModal,
  ethereumAddress,
  api
) => {
  const unlockProfile = async () => {
    let profile
    try {
      profile = new Profile(ethereumAddress, api)
      await profile.unlock()
      dispatch(profileOpenSuccess(ethereumAddress, profile))
    } catch (error) {
      dispatch(profileOpenFailure(ethereumAddress, error))
      return false
    }

    dispatch(profileSyncRequest(ethereumAddress, profile))
    try {
      await profile.sync()
      dispatch(profileSyncSuccess(ethereumAddress))
      return profile
    } catch (error) {
      dispatch(profileSyncFailure(ethereumAddress, error))
      return false
    }
  }

  const createProfile = async unlockedBox => {
    try {
      await unlockedBox.createProfile()
      dispatch(requestProfileCreateSuccess(ethereumAddress))
      return true
    } catch (error) {
      dispatch(requestProfileCreateError(ethereumAddress, error))
      return false
    }
  }

  const hasProfile = () => {
    const { hasProfile } = new Profile(ethereumAddress, api)
    return hasProfile()
  }

  const createProfSig = async unlockedBox => {
    dispatch(requestProfileCreate(ethereumAddress))
    dispatchModal(openBoxState(['create']))
    const created = await createProfile(unlockedBox)
    return created ? unlockedBox : null
  }

  const openBoxSig = async () => {
    dispatch(profileOpenRequest(ethereumAddress))
    dispatchModal(openBoxState(['unlock']))
    return unlockProfile()
  }

  const invokeBothSigs = async () => {
    dispatch(profileOpenRequest(ethereumAddress))
    dispatchModal(openBoxState(['unlock', 'create']))
    const unlockedBox = await unlockProfile()
    dispatch(requestProfileCreate(ethereumAddress))
    const created = await createProfile(unlockedBox)
    return created ? unlockedBox : null
  }

  try {
    const profileExists = await hasProfile()
    // no signature required, return the box
    if (box.unlockedProfSuccess && profileExists) return box.unlockedBox
    // only create profile signature required, return box once finished
    if (box.unlockedProfSuccess) return createProfSig(box.unlockedBox)
    // open box signature only, return box once finished
    if (!box.unlockedProfSuccess && profileExists) return openBoxSig()
    // both signatures, return box once finished
    return invokeBothSigs()
  } catch (error) {
    dispatch(
      saveProfileError(
        ethereumAddress,
        `error unlocking or creating profile: ${error}`
      )
    )
    return null
  }
}
