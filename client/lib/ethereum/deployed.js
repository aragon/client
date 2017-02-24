// @flow
import { Company as CompanyContract } from './contracts'

const Company = () => (
  CompanyContract.at(localStorage.getItem('companyAddress'))
)

export default Company
