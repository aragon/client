// @flow
import jdenticon from 'jdenticon'

import type { Entity } from '../entity'
import { Stock as ERC20 } from '/client/lib/ethereum/contracts'

const identicon = (str: string): string => {
  const svg = jdenticon.toSvg(str.slice(2), 128)
  const blob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' })
  return URL.createObjectURL(blob)
}

export default class Token {
  static async getToken(addr: string) {
    const token = ERC20.at(addr)

    try {
      return Promise.allProperties({
        name: token.name.call(),
        symbol: token.symbol.call(),
      })
    } catch (e) {
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
    }
  }
}
