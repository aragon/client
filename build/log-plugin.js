const chalk = require('chalk')

module.exports = class LogPlugin {
  constructor (options) {
    this.options = options
  }

  apply (compiler) {
    compiler.plugin('done', () => {
      console.log(`> Aragon DApp is running at ${chalk.yellow(`http://${this.options.host}:${this.options.port}`)}\n`)
    })
  }
}
