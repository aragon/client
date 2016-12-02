Template.module_ownershipIssueShares.rendered = () => {
  this.$('.dropdown').dropdown()
}

Template.module_ownershipIssueShares.helpers({
  recipientAddr: () => ((Session.get('selectedKeybaseUser') || {}).addr)
})

Template.module_ownershipIssueShares.events({
  "click .label.close": () => {
    Session.set('module_ownershipState', 'module_ownershipEmpty')
  }
})
