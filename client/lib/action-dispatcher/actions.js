import Company from '/client/lib/ethereum/deployed'

class Action {
  constructor(signature, name, description = 'Action description goes here') {
    this.signature = signature
    this.name = name
    this.description = description
    this.companyFunction = Company[signature.split('(')[0]]
  }
}

const ActionFactory = {
  beginPoll: new Action('beginPoll(address,uint64)', 'Begin voting'),
  castVote: new Action('castVote(uint256,uint8)', 'Cast vote'),
  issueStock: new Action('issueStock(uint8,uint256)', 'Issue stock'),
}

AA = ActionFactory

export default ActionFactory
