// @flow
import { Meteor } from 'meteor/meteor'

import { Company as CompanyContract, AccountingLib as AL } from './contracts'

Company = !Meteor.settings.public.deployed ?
                  CompanyContract.deployed() :
                  CompanyContract.at(Meteor.settings.public.deployed.company)

export default Company
