import { useContext } from 'react'

import { BoxContext } from '../wrappers/box'

const defaultValues = {
  description: '',
  name: '',
  coverPhotoCid: '',
  educationHistory: {},
  imageCid: '',
  location: '',
  website: '',
  workHistory: {},
  twitter: '',
  github: '',
  userLoaded: false,
  viewMode: true,
}

const useProfile = () => {
  const { boxes, ethereumAddress, isViewMode, onSignatures } = useContext(
    BoxContext
  )
  const userLoaded = !!boxes[ethereumAddress]

  if (!userLoaded) return defaultValues

  const {
    description,
    name,
    coverPhoto,
    educationHistory,
    image,
    location,
    website,
    workHistory,
  } = boxes[ethereumAddress].publicProfile

  const imageCid = userLoaded && image && image[0].contentUrl['/']
  const coverPhotoCid =
    userLoaded && coverPhoto && coverPhoto[0].contentUrl['/']

  return {
    ethereumAddress,
    description: description || defaultValues.description,
    name: name || defaultValues.name,
    coverPhotoCid: coverPhotoCid || defaultValues.coverPhotoCid,
    educationHistory: educationHistory || defaultValues.educationHistory,
    imageCid: imageCid || defaultValues.imageCid,
    location: location || defaultValues.location,
    website: website || defaultValues.website,
    workHistory: workHistory || defaultValues.workHistory,
    twitter: '',
    github: '',
    userLoaded,
    viewMode:
      typeof isViewMode !== 'undefined' ? isViewMode : defaultValues.viewMode,
    onSignatures,
  }
}

export default useProfile
