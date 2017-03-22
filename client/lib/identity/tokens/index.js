// @flow

import identicon from '../helpers/identicon'

import type { Entity } from '../entity'
import { Stock as ERC20 } from '/client/lib/ethereum/contracts'

export default class Token {
  static async getToken(addr: string) {
    try {
      const token = ERC20.at(addr)
      let totalSupply = await token.totalSupply.call()
      totalSupply = totalSupply.toNumber()
      if (totalSupply < 1) return undefined // Avoid errors getting strings Uncaught BigNumber Error: new BigNumber() not a base 16
      return await Promise.allProperties({
        name: token.name.call().catch(e => console.log('caught', e)),
        symbol: token.symbol.call().catch(e => console.log('caught', e)),
        totalSupply,
      })
    } catch (e) {
      console.log('caught exception', e)
      return undefined
    }
  }

  static async lookupEthAddress(address: string): Object {
    const tokenData = await this.getToken(address)
    console.log(tokenData)
    if (!tokenData || (!tokenData.name && !tokenData.symbol)) return undefined
    return tokenData
  }

  static format(entity: Entity) {
    return {
      username: entity.data.symbol,
      name: `Token: ${entity.data.name}`,
      picture: identicon(entity.ethereumAddress),
      totalSupply: entity.data.totalSupply,
      symbol: entity.data.symbol,
    }
  }
}
