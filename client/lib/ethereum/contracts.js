import Company from '/imports/lib/contracts/build/contracts/Company.sol.js'
import Stock from '/imports/lib/contracts/build/contracts/Stock.sol.js'
import GrantableStock from '/imports/lib/contracts/build/contracts/GrantableStock.sol.js'
import BinaryVoting from '/imports/lib/contracts/build/contracts/BinaryVoting.sol.js'
import BinaryPoll from '/imports/lib/contracts/build/contracts/BinaryPoll.sol.js'
import IssueStockVoting from '/imports/lib/contracts/build/contracts/IssueStockVoting.sol.js'
import GrantVestedStockVoting from '/imports/lib/contracts/build/contracts/GrantVestedStockVoting.sol.js'
import StockSaleVoting from '/imports/lib/contracts/build/contracts/StockSaleVoting.sol.js'
import StockSale from '/imports/lib/contracts/build/contracts/StockSale.sol.js'
import BoundedStandardSale from '/imports/lib/contracts/build/contracts/BoundedStandardSale.sol.js'
import IndividualInvestorSale from '/imports/lib/contracts/build/contracts/IndividualInvestorSale.sol.js'

import web3 from './web3'

Company.setProvider(web3.currentProvider)
Stock.setProvider(web3.currentProvider)
GrantableStock.setProvider(web3.currentProvider)
BinaryVoting.setProvider(web3.currentProvider)
BinaryPoll.setProvider(web3.currentProvider)
IssueStockVoting.setProvider(web3.currentProvider)
GrantVestedStockVoting.setProvider(web3.currentProvider)
StockSaleVoting.setProvider(web3.currentProvider)
StockSale.setProvider(web3.currentProvider)
BoundedStandardSale.setProvider(web3.currentProvider)
IndividualInvestorSale.setProvider(web3.currentProvider)

export { Company, Stock, GrantableStock, BinaryVoting as Voting, BinaryPoll as Poll, IssueStockVoting, GrantVestedStockVoting, StockSaleVoting, StockSale, BoundedStandardSale, IndividualInvestorSale }
