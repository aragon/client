import { useEffect, useState } from 'react'

import { format } from '../../modules/3box-LD'

const useLinkedData = boxes => {
  // const { connectedAccount } = useAragonApi()
  const connectedAccount = ''
  const [formattedProfile, setFormattedProfile] = useState({})

  const box = boxes[connectedAccount]
  const loadedPublicProf = box ? box.loadedPublicProfSuccess : false
  const publicProfile = loadedPublicProf ? box.publicProfile : {}

  useEffect(() => {
    if (loadedPublicProf) {
      const formattedBox = format(publicProfile)
      setFormattedProfile(formattedBox)
      const script = document.createElement('script')
      script.type = 'application/ld+json'
      script.text = JSON.stringify(formattedBox)

      document.head.appendChild(script)
    }
  }, [loadedPublicProf, publicProfile, setFormattedProfile])

  return { formattedProfile }
}

export default useLinkedData
