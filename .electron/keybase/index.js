const fs = require('fs')

const Keybase = {
  getUsername: (cb) => {
    fs.readdir('/keybase/public', (err, dirs) => {
      cb(err, dirs[0])
    })
  },
}

module.exports = Keybase
