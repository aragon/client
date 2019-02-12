import melonportPicture from './pictures/melonport.svg'
import aragonGovernancePicture from './pictures/aragon-governance.svg'
import aragonOnePicture from './pictures/aragon-one.svg'

export const KnownOrganizations = new Map(
  Object.entries({
    'meloncouncil.eth': { picture: melonportPicture },
    'governance.aragonproject.eth': { picture: aragonGovernancePicture },
    'a1.aragonid.eth': { picture: aragonOnePicture },
  })
)
