// @flow
import { Meteor } from 'meteor/meteor'

import Identity from '/client/lib/identity'

import { Company as CompanyContract, VotingStock } from './contracts'

const Company = () => {
  return CompanyContract.at(Meteor.settings.public.deployed.company)
}

const getRandomAddress = () => {
  return web3.eth.accounts[parseInt(Math.random() * web3.eth.accounts.length)]
}

CC = CompanyContract
VS = VotingStock

deployNewCompany = async () => {
  const address = getRandomAddress()
  await Identity.setCurrentEthereumAccount(address)

  console.log('deploying new company', 'ad', address)
  const libs = Meteor.settings.public.deployed.libs
  libs.forEach(({name, address}) => CompanyContract.link(name, address))
  const company = await CompanyContract.new({ gas: 5e6, value: 1e18, from: address })
  Meteor.settings.public.deployed.company = company.address
  console.log('deployed company: ', company.address)
  const stock = await VotingStock.new(Company().address, { from: address, gas: 5e6 })
  await Company().addStock(stock.address, 1e3, { from: address, gas: 5e6 })
  await Company().grantStock(0, 500, address, { from: address, gas: 5e6 })
  await Company().setInitialBylaws({ from: address, gas: 5e6 })
  console.log('finished', Company().address)
}

export default Company
