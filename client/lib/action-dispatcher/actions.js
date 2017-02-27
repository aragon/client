// @flow
import { moment } from 'meteor/momentjs:moment'

import Company from '/client/lib/ethereum/deployed'
import { StockSale, Stock } from '/client/lib/ethereum/contracts'
import StockWatcher from '/client/lib/ethereum/stocks'
import StockSalesWatcher from '/client/lib/ethereum/stocksales'
import Status from '/client/lib/identity/status'
import helpers from '/client/helpers'

const timeRange = helpers.timeRange
const Stocks = StockWatcher.Stocks
const StockSales = StockSalesWatcher.StockSales

class Action {
  signature: string
  name: string
  description: string
  companyFunction: Function
  votingDescription: (params: Array<string>) => (string)
  isBylaw: bool

  constructor(signature: string, name: string, description: string = 'Action description goes here',
              votingDescription: (params: Array<string>) => (string) = args => `Args: ${args.join(' ')}`, isBylaw: bool = true) {
    this.signature = signature
    this.name = name
    this.description = description
    this.votingDescription = votingDescription
    this.isBylaw = isBylaw
  }

  get companyFunction() {
    return Company()[this.signature.split('(')[0]]
  }

  async votingDescriptionFor(args: Array<{type: string, value: string}>): Promise<string> {
    return await this.votingDescription(args.map(a => a.value))
  }
}

const issueStockDescription = ([stockIndex, amount]): string => {
  const stock = Stocks.findOne({ index: +stockIndex })
  return `Issue ${amount} ${stock.symbol} shares`
}

const grantVestedStockDescription = ([stockIndex, amount, to, start, cliff, vesting]): string => {
  const stock = Stocks.findOne({ index: +stockIndex })
  const now = moment()
  return `Grant ${amount} ${stock.symbol} shares to ${to} starting ${timeRange(now, +start * 1000)} with ${timeRange(now, +cliff * 1000)} cliff and ${timeRange(now, +vesting * 1000)} vesting`
}

const accountingSettingsDescription = ([budget, periodDuration, dividendThreshold]): string => (
  `Set accounting settings to:\n\n - Budget: ${web3.fromWei(budget, 'ether')} ETH. \n - Period duration: ${timeRange(0, +periodDuration * 1000)}\ - Dividend threshold: ${web3.fromWei(dividendThreshold, 'ether')} ETH`
)

const stockSaleDescription = async ([saleAddress]): Promise<string> => {
  const sale = StockSale.at(saleAddress)

  const raiseTarget = sale.raiseTarget.call().then(x => x.toNumber())
  const stock = sale.stockId.call().then(x => x.toNumber())
  const buyingPrice = sale.getBuyingPrice.call(0).then(x => x.toNumber())

  return `Create a stock sale to raise ${web3.fromWei(await raiseTarget, 'ether')} ETH at ${web3.fromWei(await buyingPrice, 'ether')} ETH per ${Stocks.findOne({ index: +(await stock) }).symbol} share`
}

const addStockDescription = async ([address, tokens]): Promise<string> => {
  const stockSymbol = Stock.at(address).symbol.call()
  return `Add new stock type (${await stockSymbol}) to company and issue ${tokens} shares.`
}

const grantIssuedStockDescription = ([stockIndex, amount, to]) => {
  const stock = Stocks.findOne({ index: +stockIndex })
  return `Grant ${amount} ${stock.symbol} shares of issued stock to ${to}`
}

const transferSaleFundsDescription = ([saleIndex]) => {
  const stockSale = StockSales.findOne({ index: +saleIndex })
  return `Transfer funds from ${stockSale.title} stock sale`
}

const createRecurringRewardDescription = ([to, amount, period, concept]) => (
  `Create recurring reward of ${web3.fromWei(amount, 'ether')} ETH to ${to} for '${concept}' every ${timeRange(0, period)}`
)

const removeRecurringRewardDescription = ([rewardId]) => (
  `Remove recurring reward ${rewardId}` // TODO: Reward info
)

const issueRewardDescription = ([to, amount, concept]) => (
  `Issue reward of ${web3.fromWei(amount, 'ether')} ETH to ${to} for '${concept}'`
)

const getActionForSignature = (signature): Object => (
  Object.values(ActionFactory).filter(x => x.signature === signature)[0]
)

const setEntityStatusDescription = ([entity, status]) => (
  `Set ${entity} status to ${Status.toString(+status)}`
)

const addStatusBylawDescription = ([signature, statusNeeded]) => (
  `For ${getActionForSignature(signature).name} a minimum status of '${Status.toString(statusNeeded)}' will be needed`
)

const addStatusSpecialBylawDescription = ([signature, statusNeeded]) => {
  if (+statusNeeded === 0) return `${getActionForSignature(signature).name} action can only be performed by shareholders`
  return 'negative v'
}

const addVotingBylawDescription = ([signature, supportNeeded, supportBase,
                                    relativeMajorityOnClose, minimumVotingTime, option]) => {
  if (+option !== 0) return 'negative v'
  return `For ${getActionForSignature(signature).name} a voting with ${100 * supportNeeded / supportBase}% support in a ${minimumVotingTime / (24*3600)} day will be needed`
}

const ActionFactory = {
  beginPoll: new Action('beginPoll(address,uint64,bool,bool)', 'Begin voting',
                        'How votings and polls can be created', () => 'voting to create voting lol'),
  castVote: new Action('castVote(uint256,uint8,bool)', 'Cast vote',
                        'How votes can be casted in votings', () => 'voting to vote lol'),
  setEntityStatus: new Action('setEntityStatus(address,uint8)', 'Set entity status',
                        'Setting company status for a given entity', setEntityStatusDescription),
  addStock: new Action('addStock(address,uint256)', 'Add new stock',
                        'How a new type of stock can be assigned', addStockDescription),
  issueStock: new Action('issueStock(uint8,uint256)', 'Issue stock',
                        'How new stock can be issued', issueStockDescription),
  grantStock: new Action('grantStock(uint8,uint256,address)', 'Grant issued stock',
                        'How existing stock can be granted', grantIssuedStockDescription),
  grantVestedStock: new Action('grantVestedStock(uint8,uint256,address,uint64,uint64,uint64)', 'Issue and grant stock with vesting',
                        'How existing stock can be granted with a vesting schedule', grantVestedStockDescription),
  beginSale: new Action('beginSale(address)', 'Begin stock sale',
                        'How stock sales can be started', stockSaleDescription),
  transferSaleFunds: new Action('transferSaleFunds(uint256)', 'Transfer stock sale funds to company',
                        'How the transfer of funds from the stock sale contract to the company can be executed', transferSaleFundsDescription),
  setAccountingSettings: new Action('setAccountingSettings(uint256,uint64,uint256)', 'Set accounting settings',
                        'How accounting settings can be modified', accountingSettingsDescription),
  createRecurringReward: new Action('createRecurringReward(address,uint256,uint64,string)', 'Create recurring reward',
                        'How recurring payments can be created', createRecurringRewardDescription),
  removeRecurringReward: new Action('removeRecurringReward(uint)', 'Remove recurring reward',
                        'How recurring payments can be removed', removeRecurringRewardDescription),
  issueReward: new Action('issueReward(address,uint256,string)', 'Issue reward',
                        'How new payments can be created', issueRewardDescription),
  addStatusBylaw: new Action('addStatusBylaw(string,uint8)', 'Add bylaw by status',
                        'How new bylaws actionable by user status can be created', addStatusBylawDescription),
  addSpecialStatusBylaw: new Action('addSpecialStatusBylaw(string,uint8)', 'Add bylaw by special status',
                        'How new bylaws actionable by special user status (shareholder) can be created', addStatusSpecialBylawDescription),
  addVotingBylaw: new Action('addVotingBylaw(string,uint256,uint256,bool,uint64,uint8)', 'Add bylaw by voting',
                        'How new bylaws actionable by a voting can be created', addVotingBylawDescription),

  // non-bylaw actions
  transferTokens: new Action('transfer(address,uint)', 'Transfer tokens',
                              'How tokens can be transfered', () => '', false),
  setTxid: new Action('setTxid(string)', 'Setting transaction hash',
                              '(temporary, only for code verification purposes)', () => '', false),
  executeVoting: new Action('executeOnAction(uint8,address)', 'Executing voting',
                              'Approved action will occur', () => '', false),
  deployCompany: new Action('deployCompany()', 'Deploying company',
                              'Waiting for block confirmation', () => '', false),
  configureCompany: new Action('configureCompany(address,address)', 'Company bootstrap',
                                'Finishing company configuration', () => '', false),
  keybaseRegistry: new Action('register(string,address)', 'Registering identity',
                                'Mapping your address to your Keybase username', () => '', false)
}

export default ActionFactory
