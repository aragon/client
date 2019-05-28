export const worksFor = organizationName => ({
  '@context': 'http://schema.org/',
  '@type': 'Organization',
  name: organizationName,
})

export const schoolAffiliation = (schoolName, otherAffiliations) => [
  ...otherAffiliations,
  { '@context': 'http://schema.org/', '@type': 'School', name: schoolName },
]

export const homeLocation = locationName => ({
  '@context': 'http://schema.org/',
  '@type': 'Residence',
  name: locationName,
})

export const image = imageHash => {
  return [
    {
      '@type': 'ImageObject',
      '@context': 'http://schema.org/',
      contentUrl: { '/': imageHash },
    },
  ]
}

export const schemaDotOrgImage = imageHash => {
  return [
    {
      '@type': 'ImageObject',
      '@context': 'http://schema.org/',
      contentUrl: `https://ipfs.infura.io/ipfs/${imageHash}`,
    },
  ]
}
