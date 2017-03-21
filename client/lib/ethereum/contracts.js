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

import _CustomStock from '/imports/lib/contracts/build/contracts/CustomStock'
import _WrappedCustomStock from '/imports/lib/contracts/build/contracts/WrappedCustomStock'
import _Txid from '/imports/lib/contracts/build/contracts/Txid'
// import _BytesHelper from '/imports/lib/contracts/build/contracts/BytesHelper'
import _KeybaseRegistry from '/imports/lib/contracts/node_modules/keybase-eth/build/contracts/KeybaseRegistry'

const Company = contractify(_Company)
const AccountingLib = contractify(_AccountingLib)
const Stock = contractify(_Stock)
const CustomStock = contractify(_CustomStock)
const WrappedCustomStock = contractify(_WrappedCustomStock)
const BinaryVoting = contractify(_BinaryVoting)
const BinaryPoll = contractify(_BinaryPoll)
const StockSale = contractify(_StockSale)
const BoundedStandardSale = contractify(_BoundedStandardSale)
const IndividualInvestorSale = contractify(_IndividualInvestorSale)
const GenericBinaryVoting = contractify(_GenericBinaryVoting)
const CompanyFactory = contractify(_CompanyFactory)
const CompanyConfiguratorFactory = contractify(_CompanyConfiguratorFactory)
const KeybaseRegistry = contractify(_KeybaseRegistry)

/* const n = web3.version.network
GenericBinaryVoting.setNetwork(n)
GenericBinaryVoting.link('BytesHelper', _BytesHelper.networks[n].address) */

const Txid = contractify(_Txid)

const allContracts = [
  Company,
  AccountingLib,
  Stock,
  CustomStock,
  WrappedCustomStock,
  BinaryVoting,
  BinaryPoll,
  StockSale,
  BoundedStandardSale,
  IndividualInvestorSale,
  GenericBinaryVoting,
  Txid,
  CompanyFactory,
  CompanyConfiguratorFactory,
  KeybaseRegistry,
]

// allContracts.forEach(c => c.setProvider(web3.currentProvider))

export { allContracts, Company, AccountingLib, Stock, CustomStock, WrappedCustomStock, BinaryVoting as Voting,
          BinaryPoll as Poll, BoundedStandardSale, IndividualInvestorSale, GenericBinaryVoting,
          StockSale, Txid, CompanyFactory, CompanyConfiguratorFactory, KeybaseRegistry }
