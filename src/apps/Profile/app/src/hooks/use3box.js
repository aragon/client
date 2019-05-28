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

const use3Box = () => {
  // const { api, connectedAccount } = useAragonApi()
  const api = {}
  const connectedAccount = ''
  const [boxes, dispatch] = useReducer(boxReducer, initialState)

  useEffect(() => {
    const unlockIfLoggedIn = async profile => {
      const isLoggedIn = await profile.isLoggedIn()

      if (isLoggedIn) {
        dispatch(requestedProfileUnlock(connectedAccount))
        try {
          await profile.unlockAndSync()
          dispatch(profileUnlockSuccess(connectedAccount, profile))
        } catch (error) {
          dispatch(profileUnlockFailure(connectedAccount, error))
        }
      }
    }

    const getBox = async () => {
      if (connectedAccount && api) {
        dispatch(fetchingProfile(connectedAccount))
        try {
          const profile = new Profile(connectedAccount, api)
          const publicProfile = await profile.getPublic()
          dispatch(fetchedPublicProfile(connectedAccount, publicProfile))
          unlockIfLoggedIn(profile)
        } catch (error) {
          dispatch(fetchedPublicProfileError(connectedAccount, error))
        }
      }
    }

    getBox()
  }, [api, connectedAccount])

  return { boxes, dispatch }
}

export default use3Box
