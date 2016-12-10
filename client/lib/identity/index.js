class Identity {
  static format(addr) {
    if (addr === EthAccounts.findOne().address) {
      return 'Me'
    }
    return addr
  }
}

export default Identity
