// @flow
import _Company from '/imports/lib/contracts/build/contracts/Company'
import _AccountingLib from '/imports/lib/contracts/build/contracts/AccountingLib'
import _Stock from '/imports/lib/contracts/build/contracts/Stock'
import _GrantableStock from '/imports/lib/contracts/build/contracts/GrantableStock'
import _BinaryVoting from '/imports/lib/contracts/build/contracts/BinaryVoting'
import _BinaryPoll from '/imports/lib/contracts/build/contracts/BinaryPoll'
import _StockSale from '/imports/lib/contracts/build/contracts/StockSale'
import _BoundedStandardSale from '/imports/lib/contracts/build/contracts/BoundedStandardSale'
import _IndividualInvestorSale from '/imports/lib/contracts/build/contracts/IndividualInvestorSale'
import _GenericBinaryVoting from '/imports/lib/contracts/build/contracts/GenericBinaryVoting'
import _VotingStock from '/imports/lib/contracts/build/contracts/VotingStock'

import web3 from './web3'
import contractify from 'truffle-contract'
// const contractify = contract => web3.eth.contract(contract.abi)

Company = contractify(_Company)
AccountingLib = contractify(_AccountingLib)
Stock = contractify(_Stock)
VotingStock = contractify(_VotingStock)
GrantableStock = contractify(_GrantableStock)
BinaryVoting = contractify(_BinaryVoting)
BinaryPoll = contractify(_BinaryPoll)
StockSale = contractify(_StockSale)
BoundedStandardSale = contractify(_BoundedStandardSale)
IndividualInvestorSale = contractify(_IndividualInvestorSale)
GenericBinaryVoting = contractify(_GenericBinaryVoting)

console.log(Company)

const allContracts = [
  Company,
  AccountingLib,
  Stock,
  VotingStock,
  GrantableStock,
  BinaryVoting,
  BinaryPoll,
  StockSale,
  BoundedStandardSale,
  IndividualInvestorSale,
  GenericBinaryVoting,
]

// allContracts.forEach(c => c.setProvider(web3.currentProvider))

export { allContracts, Company, AccountingLib, Stock, VotingStock, GrantableStock, BinaryVoting as Voting,
          BinaryPoll as Poll, BoundedStandardSale, IndividualInvestorSale, GenericBinaryVoting, StockSale }
