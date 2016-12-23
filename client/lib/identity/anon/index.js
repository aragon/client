// @flow
const generateName = (str: string): string => {
  return 'Manolo'
}

const generatePic = (str: string): string => {
  return 'http://placekitten.com/128/128'
}

export default class Anon {
  static lookupEthAddress(addr: string): Object {
    return { ethereumAddress: addr }
  }

  static format(data: Object) {
    return {
      username: data.ethereumAddress,
      name: generateName(data.ethereumAddress),
      picture: generatePic(data.ethereumAddress),
    }
  }
}
