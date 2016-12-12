const Entities = new Mongo.Collection('entities_collection', { connection: null })

class Identity {
  static format(addr) {
    if (addr === EthAccounts.findOne().address) {
      return 'Me'
    }
    return addr
  }

  static get(addr) {
    return Entities.findOne({ _id: addr })
  }

  static set(addr, identityProvider, entityObj) {
    const entity = {
      identityProvider,
      data: entityObj,
    }
    if (identityProvider === 'keybase') {
      delete entity.data.invitation_stats
      delete entity.data.private_keys
    }
    Entities.upsert(`e_${addr}`, entity)
  }
}

export default Identity
