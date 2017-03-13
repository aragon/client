// @flow
import { Company as CompanyContract } from './contracts'

const Company = () => (
  CompanyContract.at(localStorage.getItem('companyAddress'))
)

const CompanyFactory = () => (window.CompanyFactory)

const CompanyConfiguratorFactory = () => (window.CompanyConfiguratorFactory)

export { Company, CompanyFactory, CompanyConfiguratorFactory }
