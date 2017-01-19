// @flow
import Company from '/imports/lib/contracts/build/contracts/Company.sol.js'
import Stock from '/imports/lib/contracts/build/contracts/Stock.sol.js'
import GrantableStock from '/imports/lib/contracts/build/contracts/GrantableStock.sol.js'
import BinaryVoting from '/imports/lib/contracts/build/contracts/BinaryVoting.sol.js'
import BinaryPoll from '/imports/lib/contracts/build/contracts/BinaryPoll.sol.js'
import StockSaleVoting from '/imports/lib/contracts/build/contracts/StockSaleVoting.sol.js'
import StockSale from '/imports/lib/contracts/build/contracts/StockSale.sol.js'
import BoundedStandardSale from '/imports/lib/contracts/build/contracts/BoundedStandardSale.sol.js'
import IndividualInvestorSale from '/imports/lib/contracts/build/contracts/IndividualInvestorSale.sol.js'
import GenericBinaryVoting from '/imports/lib/contracts/build/contracts/GenericBinaryVoting.sol.js'

import web3 from './web3'

const allContracts = [
  Company,
  Stock,
  GrantableStock,
  BinaryVoting,
  BinaryPoll,
  StockSaleVoting,
  StockSale,
  BoundedStandardSale,
  IndividualInvestorSale,
  GenericBinaryVoting,
]

allContracts.forEach(c => c.setProvider(web3.currentProvider))

export { allContracts, Company, Stock, GrantableStock, BinaryVoting as Voting,
          BinaryPoll as Poll, BoundedStandardSale, IndividualInvestorSale, GenericBinaryVoting }
