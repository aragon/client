// @flow
import { ERC20Wrap } from '/client/lib/ethereum/contracts'

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
}
