// @flow
import { Meteor } from 'meteor/meteor'

import Identity from '/client/lib/identity'

import { Company as CompanyContract, AccountingLib as AL, VotingStock } from './contracts'

Company = () => (
  !Meteor.settings.public.deployed ?
          CompanyContract.deployed() :
          CompanyContract.at(Meteor.settings.public.deployed.company)
)

deployNewCompany = async () => {
  Identity.setCurrent({
    identityProvider: 'anon',
    ethereumAddress: EthAccounts.findOne({}, {skip: EthAccounts.find().count() * Math.random() }).address
    data: {},
  })

  console.log('deploying new company')
  const address = Identity.current(true).ethereumAddress
  const libs = Meteor.settings.public.deployed.libs
  libs.forEach(({name, address}) => CompanyContract.link(name, address))
  const company = await CompanyContract.new({ gas: 5e6, value: 1e18, from: address })
  Meteor.settings.public.deployed.company = company.address
  const stock = await VotingStock.new(Company().address, { from: address, gas: 5e6 })
  await Company().addStock(stock.address, 1e3, { from: address, gas: 5e6 })
  await Company().grantStock(0, 500, address, { from: address, gas: 5e6 })
  await Company().setInitialBylaws({ from: address, gas: 5e6 })
  console.log('finished', Company().address)
}

export default Company
