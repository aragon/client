import Company from '/imports/lib/contracts/build/contracts/Company.sol.js'
import Stock from '/imports/lib/contracts/build/contracts/Stock.sol.js'
import BinaryVote from '/imports/lib/contracts/build/contracts/BinaryVote.sol.js'

import web3 from './web3'

Company.setProvider(web3.currentProvider)
Stock.setProvider(web3.currentProvider)
BinaryVote.setProvider(web3.currentProvider)

export { Company, Stock, BinaryVote }
