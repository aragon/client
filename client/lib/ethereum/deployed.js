// @flow
import { Meteor } from 'meteor/meteor'

import { Company as CompanyContract, AccountingLib as AL } from './contracts'

const Company = !Meteor.settings.deployed ?
                  CompanyContract.deployed() :
                  CompanyContract.at(Meteor.settings.deployed.company)

const AccountingLib = !Meteor.settings.deployed ?
                  AL.deployed() :
                  AL.at(Meteor.settings.deployed.accountingLib)

export { Company, AccountingLib }
