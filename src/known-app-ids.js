import { hash as namehash } from 'eth-ens-namehash'

// These app IDs are generated from <name>.aragonpm.eth
export default {
  Agent: namehash('agent.aragonpm.eth'),
  Finance: namehash('finance.aragonpm.eth'),
  Fundraising: namehash('aragon-fundraising.aragonpm.eth'),
  Survey: namehash('survey.aragonpm.eth'),
  TokenManager: namehash('token-manager.aragonpm.eth'),
  Vault: namehash('vault.aragonpm.eth'),
  Voting: namehash('voting.aragonpm.eth'),
}
