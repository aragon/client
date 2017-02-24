// @flow
import Build from '/client/lib/build'
import companyJSON from '/imports/lib/contracts/build/contracts/Company'
import Identity from '/client/lib/identity'

import { Company as CompanyContract, VotingStock } from './contracts'

const Company = () => (
  CompanyContract.at(localStorage.getItem('companyAddress'))
)

const getRandomAddress = () => {
  return web3.eth.accounts[parseInt(Math.random() * web3.eth.accounts.length)]
}

deployNewCompany = async () => {
  const addr = getRandomAddress()
  const current = await Identity.getRaw(addr, true)
  Identity.setCurrent(current)
  Entities.update({ethereumAddress: addr}, {$set:{current:true}})

  console.log('deploying new company', 'ad', addr)
  const libs = Build.Settings.get('deployed.libs')
  const networkID = await getNetworkID()

  CompanyContract.setNetwork(networkID)
  const company = await CompanyContract.new({ gas: 6e6, value: 1e18, from: addr })
  const companyAddress = company.address
  localStorage.setItem('companyAddress', companyAddress)

  const stock = await VotingStock.new(companyAddress, { from: addr, gas: 5e6 })
  await Company().addStock(stock.address, 1e3, { from: addr, gas: 5e6 })
  await Company().grantStock(0, 500, addr, { from: addr, gas: 5e6 })
  await Company().setInitialBylaws({ from: addr, gas: 5e6 })
  console.log('finished', Company().address)
}

export default Company
