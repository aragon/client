// @flow
import Company from '/client/lib/ethereum/deployed'

class Action {
  signature: string
  name: string
  description: string
  companyFunction: Function

  constructor(signature: string, name: string, description: string = 'Action description goes here') {
    this.signature = signature
    this.name = name
    this.description = description
    this.companyFunction = Company[signature.split('(')[0]]
  }
}

const ActionFactory = {
  beginPoll: new Action('beginPoll(address,uint64)', 'Begin voting'),
  castVote: new Action('castVote(uint256,uint8)', 'Cast vote'),
  addStock: new Action('addStock(address,uint256)', 'Add new stock'),
  issueStock: new Action('issueStock(uint8,uint256)', 'Issue stock'),
  grantStock: new Action('grantStock(uint8,uint256,address)', 'Grant issued stock'),
  grantVestedStock: new Action('grantVestedStock(uint8,uint256,address,uint64,uint64)', 'Issue and grant stock with vesting'),
  beginSale: new Action('beginSale(address)', 'Begin stock sale'),
  transferSaleFunds: new Action('transferSaleFunds(uint256)', 'Transfer stock sale funds to company'),
  setAccountingSettings: new Action('setAccountingSettings(uint256,uint64,uint256)', 'Set accounting settings'),
  createRecurringReward: new Action('createRecurringReward(address,uint256,uint64,string)', 'Create recurring reward'),
  removeRecurringReward: new Action('removeRecurringReward(uint)', 'Remove recurring reward'),
  issueReward: new Action('issueReward(address,uint256,string)', 'Issue reward'),
  addStatusBylaw: new Action('addStatusBylaw(string,uint8)', 'Add bylaw by status'),
  addSpecialStatusBylaw: new Action('addSpecialStatusBylaw(string,uint8)', 'Add bylaw by special status'),
  addVotingBylaw: new Action('addVotingBylaw(string,uint256,uint256,bool,uint8)', 'Add bylaw by voting'),
}

AA = ActionFactory

export default ActionFactory
