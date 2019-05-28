import { isIPFS } from 'ipfs-http-client'

import {
  worksFor,
  schoolAffiliation,
  homeLocation,
  schemaDotOrgImage,
} from './things'

const usedFields = new Set([
  'name',
  'jobTitle',
  'homeLocation',
  'affiliation',
  'url',
  'description',
  'image',
  'worksFor',
])

const handleJobTitle = publicProfile => {
  if (publicProfile.job) {
    const { job } = publicProfile
    delete publicProfile.job
    return { ...publicProfile, jobTitle: job }
  }
  return publicProfile
}

const handleEmployer = publicProfile => {
  if (publicProfile.employer) {
    const { employer } = publicProfile
    delete publicProfile.employer
    return { ...publicProfile, worksFor: worksFor(employer) }
  }
  return publicProfile
}

const handleEducation = publicProfile => {
  const hasEducation = !!publicProfile.school
  if (!hasEducation) return publicProfile

  const affiliation = publicProfile.affiliation || []

  return {
    ...publicProfile,
    affiliation: schoolAffiliation(publicProfile.school, affiliation),
  }
}

const handleWebsite = publicProfile => {
  if (publicProfile.website) {
    const { website } = publicProfile
    delete publicProfile.website
    return { ...publicProfile, url: website }
  }
  return publicProfile
}

const handleLocation = publicProfile => {
  if (publicProfile.location) {
    const { location } = publicProfile
    delete publicProfile.location
    return {
      ...publicProfile,
      homeLocation: homeLocation(location),
    }
  }

  return publicProfile
}

const handlePerson = publicProfile => {
  const isPerson =
    publicProfile['@type'] === 'Person' &&
    publicProfile['@context'] === 'http://schema.org/'

  if (isPerson) return publicProfile
  return {
    ...publicProfile,
    '@type': 'Person',
    '@context': 'http://schema.org/',
  }
}

export const handleImage = publicProfile => {
  const hasImage = !!publicProfile.image && publicProfile.image.length > 0
  if (!hasImage) return publicProfile
  const isProperlyTyped =
    Array.isArray(publicProfile.image) &&
    publicProfile.image.length > 0 &&
    publicProfile.image[0].contentUrl &&
    typeof publicProfile.image[0].contentUrl === 'object'

  const cid = isProperlyTyped && publicProfile.image[0].contentUrl['/']
  const isIPLD = isIPFS.cid(cid)

  if (isIPLD) {
    delete publicProfile.image
    return { ...publicProfile, image: schemaDotOrgImage(cid) }
  }
  throw new Error('unknown image type passed')
}

/* prettier-ignore */
export const format = publicProfile => {
  const formattedProfile =
    handlePerson(
        handleLocation(
          handleWebsite(
            handleEducation(
              handleEmployer(
                handleJobTitle(
                  handleImage({ ...publicProfile })))))))
  return formattedProfile
}

export const populateFormValue = publicProfile => {
  const strippedObject = {}
  Object.keys(publicProfile)
    .filter(field => usedFields.has(field))
    .forEach(field => (strippedObject[field] = publicProfile[field]))

  return strippedObject
}
