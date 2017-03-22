// @flow

import identicon from '../helpers/identicon'

import type { Entity } from '../entity'
import Tokens from '/client/lib/ethereum/tokens'

export default class Token {
  static async lookupEthAddress(address: string): Object {
    const tokenData = await Tokens.getTokenProperties(address)
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
