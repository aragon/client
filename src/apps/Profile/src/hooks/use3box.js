import { useReducer, useEffect } from 'react'

import { Profile } from '../../modules/3box-aragon'
import {
  fetchingProfile,
  fetchedPublicProfile,
  boxReducer,
  initialState,
  fetchedPublicProfileError,
  requestedProfileUnlock,
  profileUnlockSuccess,
  profileUnlockFailure,
} from '../stateManagers/box'

const use3Box = (account, onSignatures) => {
  const [boxes, dispatch] = useReducer(boxReducer, initialState)

  useEffect(() => {
    const unlockIfLoggedIn = async profile => {
      const isLoggedIn = await profile.isLoggedIn()

      if (isLoggedIn) {
        dispatch(requestedProfileUnlock(account))
        try {
          await profile.unlockAndSync()
          dispatch(profileUnlockSuccess(account, profile))
        } catch (error) {
          dispatch(profileUnlockFailure(account, error))
        }
      }
    }

    const getBox = async () => {
      if (account && onSignatures) {
        dispatch(fetchingProfile(account))
        try {
          const profile = new Profile(account, onSignatures)
          const publicProfile = await profile.getPublic()
          dispatch(fetchedPublicProfile(account, publicProfile))
          unlockIfLoggedIn(profile)
        } catch (error) {
          dispatch(fetchedPublicProfileError(account, error))
        }
      }
    }

    getBox()
  }, [account, onSignatures])

  return { boxes, dispatch }
}

export default use3Box
