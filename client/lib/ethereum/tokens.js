// @flow
import { ERC20Wrap, WrappedCustomStock, Stock } from '/client/lib/ethereum/contracts'
import { dispatcher } from '/client/lib/action-dispatcher'
import queue from '/client/lib/queue'

export default class Tokens {
  static async getTokenProperties(addr: string) {
    try {
      const token = ERC20Wrap.at(addr)
      let totalSupply = await token.totalSupply()
      let parentTotalSupply = await token.parentTotalSupply()
      totalSupply = totalSupply.toNumber()
      parentTotalSupply = parentTotalSupply.toNumber()
      if (totalSupply < 1) return undefined // Avoid errors getting strings Uncaught BigNumber Error: new BigNumber() not a base 16
      return await Promise.allProperties({
        name: token.name().catch(e => console.log('caught', e)),
        symbol: token.symbol().catch(e => console.log('caught', e)),

        totalSupply,
        parentTotalSupply,
      })
    } catch (e) {
      console.log('caught exception', e)
      return undefined
    }
  }

  static async getBalance(token, hodler) {
    return ERC20Wrap.at(token).balanceOf(hodler).then(x => x.toNumber())
  }

  static async getTransferableBalance(token, hodler) {
    return Stock.at(token).transferableTokens(hodler, +new Date()/1000).then(x => x.valueOf())
  }

  static async wrap(token, wrapper, holder) {
    const balance = await this.getBalance(token, holder)
    if (balance < 1) return

    const txId = await dispatcher.performTransaction(ERC20Wrap.at(token).approve, wrapper, balance)
    return new Promise((resolve, reject) => {
      queue.addListener(txId, async () => {
        const allowance = await ERC20Wrap.at(token).allowance(holder, wrapper).then(x => x.toNumber())
        if (allowance < balance) return alert(`Failure wrapping tokens. Allowance for wrapper is too low (${allowance} vs ${balance}) `)
        const txId2 = await dispatcher.performTransaction(WrappedCustomStock.at(wrapper).wrap, balance)
        resolve(txId2)
      })
    })
  }

  static async unwrap(wrapper, holder) {
    const balance = await this.getBalance(wrapper, holder)
    if (balance < 1) return
    return await dispatcher.performTransaction(WrappedCustomStock.at(wrapper).unwrap, balance)
  }
}
