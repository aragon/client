// @flow
import Company from '/client/lib/ethereum/deployed'

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

const ActionFactory = {
  beginPoll: new Action('beginPoll(address,uint64)', 'Begin voting',
                        'How votings and polls can be created', () => 'voting to create voting lol'),
  castVote: new Action('castVote(uint256,uint8)', 'Cast vote',
                        'How votes can be casted in votings', () => 'voting to vote lol'),
  addStock: new Action('addStock(address,uint256)', 'Add new stock',
                        'How a new type of stock can be assigned'),
  issueStock: new Action('issueStock(uint8,uint256)', 'Issue stock',
                        'How new stock can be issued'),
  grantStock: new Action('grantStock(uint8,uint256,address)', 'Grant issued stock',
                        'How existing stock can be granted'),
  grantVestedStock: new Action('grantVestedStock(uint8,uint256,address,uint64,uint64)', 'Issue and grant stock with vesting',
                        'How existing stock can be granted with a vesting schedule'),
  beginSale: new Action('beginSale(address)', 'Begin stock sale',
                        'How stock sales can be started'),
  transferSaleFunds: new Action('transferSaleFunds(uint256)', 'Transfer stock sale funds to company',
                        'How the transfer of funds from the stock sale contract to the company can be executed'),
  setAccountingSettings: new Action('setAccountingSettings(uint256,uint64,uint256)', 'Set accounting settings',
                        'How accounting settings can be modified'),
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
