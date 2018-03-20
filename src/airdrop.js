import tokens from '@aragon/templates-tokens'

export default (web3, financeAddr, network = 'rinkeby') => {
    const ts = tokens[network]
    const depositer = new web3.eth.Contract(tokens.depositerABI, tokens[network].depositer)

    // rand values
    const token = ts[Math.floor(ts.length * Math.random())]
    const amount = web3.utils.toWei(Math.floor(1000 * Math.random()))
    const ref = 'Requested airdrop (test tokens)'

    return depositer.methods.pleaseAirdrop(financeAddr, token, amount, ref).send({ gas: 1e6 })
}
