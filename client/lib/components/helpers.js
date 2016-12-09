Template.registerHelper('$contains', (a, b) => (!a || b.toLowerCase().indexOf(a.toLowerCase()) !== -1))

Template.registerHelper('parent', () => ({ parent: Template.instance() }))

Template.registerHelper('displayAddress', (ethAddress) => {
  if (ethAddress === EthAccounts.findOne().address) {
    return 'Me'
  }
  return ethAddress
})
