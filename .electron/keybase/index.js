const fs = require('fs')
const path = require('path')

const proofFilename = 'ethereum_test.json'
const keybasePublicDirectory = user => path.join('/keybase/public', user || String())
const proofPath = user => path.join(keybasePublicDirectory(user), proofFilename)

// TODO: Promisify all this?
class Keybase {
  static getUsername(cb) {
    fs.readdir(keybasePublicDirectory(), (err, dirs) => {
      cb(err, dirs[0])
    })
  }

  static saveProof(proofPayload, cb) {
    this.getUsername((err, username) => {
      const proof = JSON.parse(proofPayload)
      if (username !== proof.username) { return cb(new Error('username doesnt match')) }
      return fs.writeFile(proofPath(username), proofPayload, cb)
    })
  }
}

module.exports = Keybase
