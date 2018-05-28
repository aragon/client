import tokens from '@aragon/templates-tokens'

export function testTokensEnabled(network) {
  return !!tokens[network]
}

export default (web3, financeAddr, from, network = 'rinkeby') => {
  const ts = tokens[network]
  const depositer = new web3.eth.Contract(tokens.depositerABI, ts.depositer)

  // rand values
  const token = ts.tokens[Math.floor(ts.tokens.length * Math.random())]
  const amount = web3.utils.toWei(Math.floor(1000 * Math.random()).toString())
  const ref = 'Requested airdrop (test tokens)'

  return depositer.methods
    .pleaseAirdrop(financeAddr, token, amount, ref)
    .send({ from, gas: 1e6 })
}
