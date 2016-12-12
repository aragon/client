import Company from '/imports/lib/contracts/build/contracts/Company.sol.js'
import Stock from '/imports/lib/contracts/build/contracts/Stock.sol.js'
import BinaryVoting from '/imports/lib/contracts/build/contracts/BinaryVoting.sol.js'
import IssueStockVoting from '/imports/lib/contracts/build/contracts/IssueStockVoting.sol.js'

import web3 from './web3'

Company.setProvider(web3.currentProvider)
Stock.setProvider(web3.currentProvider)
BinaryVoting.setProvider(web3.currentProvider)
IssueStockVoting.setProvider(web3.currentProvider)

export { Company, Stock, BinaryVoting as Voting, IssueStockVoting }
