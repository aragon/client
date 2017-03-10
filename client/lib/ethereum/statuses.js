import { Entities } from '/client/lib/identity'
import { Company } from './deployed'

import Watcher from './watcher'

class StatusWatcher extends Watcher {
  constructor() {
    super('ss')
  }

  listen() {
    this.watchEvent(Company().EntityNewStatus, this.watchStatus)
  }

  async watchStatus(err, ev) {
    if (!err && ev.args) await this.updateStatus(ev.args.entity, ev.args.status)
  }

  async updateStatus(ethereumAddress, _status) {
    const status: number = _status.toNumber()
    console.log(`Updating status of ${ethereumAddress}`)
    console.log('before', Entities.findOne({ current: true }).balances)
    Entities.upsert({ ethereumAddress }, { $set: { status } })
    console.log('after', Entities.findOne({ current: true }).balances)
  }
}

export default new StatusWatcher()
