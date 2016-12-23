// @flow
import type { Entity } from '../entity'

const generateName = (str: string) => {
  return 'Manolo'
}

const generatePic = (str: string) => {
  return 'http://placekitten.com/128/128'
}

export default class Anon {
  static lookupEthAddress(addr) {
    return { ethereumAddress: addr }
  }

  static format(data) {
    const entity: Entity = {
      username: data.ethereumAddress,
      name: generateName(data.ethereumAddress),
      picture: generatePic(data.ethereumAddress),
    }
    return entity
  }
}
