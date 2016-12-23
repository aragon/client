const generateName = (str) => {
  return 'Manolo'
}

const generatePic = (str) => {
  return 'http://placekitten.com/128/128'
}

export default class Anon {
  static lookupEthAddress(addr) {
    return { ethereumAddress: addr }
  }

  static format(data) {
    return {
      username: data.ethereumAddress,
      name: generateName(data.ethereumAddress),
      picture: generatePic(data.ethereumAddress),
    }
  }
}
