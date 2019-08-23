import { useContext } from 'react'
import { AppWidthContext } from '../components/OrgView/OrgView'

export default function useAppWidth() {
  return useContext(AppWidthContext)
}
