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
ID = Identity

const getNetworkID = () => (
  new Promise((resolve, reject) => {
    web3.version.getNetwork((err, id) => {
      if (err) reject(err)
      else resolve(id)
    })
  })
)

deployNewCompany = async () => {
  const addr = getRandomAddress()
  await Identity.setCurrentEthereumAccount(addr)

  console.log('deploying new company', 'ad', addr)
  const libs = Meteor.settings.public.deployed.libs
  const networkID = await getNetworkID()
  alert(networkID)
  CompanyContract.setNetwork(networkID)
  libs.forEach(({ name, address }) => CompanyContract.link(name, address))
  const company = await CompanyContract.new({ gas: 5e6, value: 1e18, from: addr })
  Meteor.settings.public.deployed.company = company.address
  const stock = await VotingStock.new(Company().address, { from: addr, gas: 5e6 })
  await Company().addStock(stock.address, 1e3, { from: addr, gas: 5e6 })
  await Company().grantStock(0, 500, addr, { from: addr, gas: 5e6 })
  await Company().setInitialBylaws({ from: addr, gas: 5e6 })
  console.log('finished', Company().address)
}

export default Company
