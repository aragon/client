import { Company as CompanyContract } from './contracts'

const Company = !Meteor.settings.deployed ?
                  CompanyContract.deployed() :
                  CompanyContract.at(Meteor.settings.deployed.company)

export default Company
