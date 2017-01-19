// @flow
import Company from '/client/lib/ethereum/deployed'
import StockWatcher from '/client/lib/ethereum/stocks'
import helpers from '/client/helpers'

const timeRange = helpers.timeRange
const Stocks = StockWatcher.Stocks

class Action {
  signature: string
  name: string
  description: string
  companyFunction: Function
  votingDescription: (params: Array<string>) => (string)

  constructor(signature: string, name: string, description: string = 'Action description goes here', votingDescription: (params: Array<string>) => (string) = args => `Args: ${args.join(' ')}`) {
    this.signature = signature
    this.name = name
    this.description = description
    this.companyFunction = Company[signature.split('(')[0]]
    this.votingDescription = votingDescription
  }

  async votingDescriptionFor(args: Array<{type: string, value: string}>): Promise<string> {
    return await this.votingDescription(args.map(a => a.value))
  }
}

const issueStockDescription = ([stockIndex, amount]): string => {
  const stock = Stocks.findOne({ index: +stockIndex })
  return `Issue ${amount} ${stock.symbol} shares`
}

const grantVestedStockDescription = ([stockIndex, amount, to, cliff, vesting]): string => {
  const stock = Stocks.findOne({ index: +stockIndex })
  const now = moment()
  return `Grant ${amount} ${stock.symbol} shares to ${to} with ${timeRange(now, +cliff * 1000)} cliff and ${timeRange(now, +vesting * 1000)} vesting`
}

const accountingSettingsDescription = ([budget, periodDuration, dividendThreshold]): string => (
  `Voting to set accounting settings to:\n\n - Budget: ${web3.fromWei(budget, 'ether')} ETH. \n - Period duration: ${timeRange(0, +periodDuration * 1000)}\ - Dividend threshold: ${web3.fromWei(dividendThreshold, 'ether')} ETH`
)

/*
const x = [
  {
    contractClass: StockSaleVoting,
    title: async a => `${await StockSaleVoting.at(a).title.call()} voting`,
    description: async a => {
      const sale = StockSale.at(await StockSaleVoting.at(a).sale.call())

      const raiseTarget = sale.raiseTarget.call().then(x => x.toNumber())
      const stock = sale.stockId.call().then(x => x.toNumber())
      const buyingPrice = sale.getBuyingPrice.call(0).then(x => x.toNumber())
      const availableTokens = sale.availableTokens.call().then(x => x.toNumber())

      return `Voting to create a stock sale to raise ${web3.fromWei(await raiseTarget, 'ether')} at ${web3.fromWei(await buyingPrice, 'ether')} ETH per ${ Stocks.findOne({ index: +(await stock) }).symbol } share`
    },
  },
]
*/

const ActionFactory = {
  beginPoll: new Action('beginPoll(address,uint64)', 'Begin voting',
                        'How votings and polls can be created', () => 'voting to create voting lol'),
  castVote: new Action('castVote(uint256,uint8)', 'Cast vote',
                        'How votes can be casted in votings', () => 'voting to vote lol'),
  addStock: new Action('addStock(address,uint256)', 'Add new stock',
                        'How a new type of stock can be assigned'),
  issueStock: new Action('issueStock(uint8,uint256)', 'Issue stock',
                        'How new stock can be issued', issueStockDescription),
  grantStock: new Action('grantStock(uint8,uint256,address)', 'Grant issued stock',
                        'How existing stock can be granted'),
  grantVestedStock: new Action('grantVestedStock(uint8,uint256,address,uint64,uint64)', 'Issue and grant stock with vesting',
                        'How existing stock can be granted with a vesting schedule', grantVestedStockDescription),
  beginSale: new Action('beginSale(address)', 'Begin stock sale',
                        'How stock sales can be started'),
  transferSaleFunds: new Action('transferSaleFunds(uint256)', 'Transfer stock sale funds to company',
                        'How the transfer of funds from the stock sale contract to the company can be executed'),
  setAccountingSettings: new Action('setAccountingSettings(uint256,uint64,uint256)', 'Set accounting settings',
                        'How accounting settings can be modified', accountingSettingsDescription),
  createRecurringReward: new Action('createRecurringReward(address,uint256,uint64,string)', 'Create recurring reward',
                        'How recurring payments can be created'),
  removeRecurringReward: new Action('removeRecurringReward(uint)', 'Remove recurring reward',
                        'How recurring payments can be removed'),
  issueReward: new Action('issueReward(address,uint256,string)', 'Issue reward',
                        'How new payments can be created'),
  addStatusBylaw: new Action('addStatusBylaw(string,uint8)', 'Add bylaw by status',
                        'How new bylaws actionable by user status can be created'),
  addSpecialStatusBylaw: new Action('addSpecialStatusBylaw(string,uint8)', 'Add bylaw by special status',
                        'How new bylaws actionable by special user status (shareholder) can be created'),
  addVotingBylaw: new Action('addVotingBylaw(string,uint256,uint256,bool,uint8)', 'Add bylaw by voting',
                        'How new bylaws actionable by a voting can be created'),
}

export default ActionFactory
