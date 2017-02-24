// @flow
import contractify from 'truffle-contract'

import _Company from '/imports/lib/contracts/build/contracts/Company'
import _AccountingLib from '/imports/lib/contracts/build/contracts/AccountingLib'
import _Stock from '/imports/lib/contracts/build/contracts/Stock'
import _BinaryVoting from '/imports/lib/contracts/build/contracts/BinaryVoting'
import _BinaryPoll from '/imports/lib/contracts/build/contracts/BinaryPoll'
import _StockSale from '/imports/lib/contracts/build/contracts/StockSale'
import _BoundedStandardSale from '/imports/lib/contracts/build/contracts/BoundedStandardSale'
import _IndividualInvestorSale from '/imports/lib/contracts/build/contracts/IndividualInvestorSale'
import _GenericBinaryVoting from '/imports/lib/contracts/build/contracts/GenericBinaryVoting'
import _CompanyFactory from '/imports/lib/contracts/build/contracts/CompanyFactory'
import _CompanyConfiguratorFactory from '/imports/lib/contracts/build/contracts/CompanyConfiguratorFactory'

import _VotingStock from '/imports/lib/contracts/build/contracts/VotingStock'
import _Txid from '/imports/lib/contracts/build/contracts/Txid'
// import _BytesHelper from '/imports/lib/contracts/build/contracts/BytesHelper'

const Company = contractify(_Company)
const AccountingLib = contractify(_AccountingLib)
const Stock = contractify(_Stock)
const VotingStock = contractify(_VotingStock)
const BinaryVoting = contractify(_BinaryVoting)
const BinaryPoll = contractify(_BinaryPoll)
const StockSale = contractify(_StockSale)
const BoundedStandardSale = contractify(_BoundedStandardSale)
const IndividualInvestorSale = contractify(_IndividualInvestorSale)
const GenericBinaryVoting = contractify(_GenericBinaryVoting)
const CompanyFactory = contractify(_CompanyFactory)
const CompanyConfiguratorFactory = contractify(_CompanyConfiguratorFactory)

/* const n = web3.version.network
GenericBinaryVoting.setNetwork(n)
GenericBinaryVoting.link('BytesHelper', _BytesHelper.networks[n].address) */

const Txid = contractify(_Txid)

const allContracts = [
  Company,
  AccountingLib,
  Stock,
  VotingStock,
  BinaryVoting,
  BinaryPoll,
  StockSale,
  BoundedStandardSale,
  IndividualInvestorSale,
  GenericBinaryVoting,
  Txid,
]

// allContracts.forEach(c => c.setProvider(web3.currentProvider))

export { allContracts, Company, AccountingLib, Stock, VotingStock, BinaryVoting as Voting,
          BinaryPoll as Poll, BoundedStandardSale, IndividualInvestorSale, GenericBinaryVoting,
          StockSale, Txid, CompanyFactory, CompanyConfiguratorFactory }
