Template.module_ownership.onRendered(() => {
  Session.set('module_ownershipState', 'module_ownershipEmpty')
})

Template.module_ownership.events({
  "click button#issueShares": () => {
    Session.set('module_ownershipState', 'module_ownershipIssueShares')
  }
})

Template.module_ownership.helpers({
  state: () => (Session.get('module_ownershipState'))
})
