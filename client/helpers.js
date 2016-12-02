Template.registerHelper('capitalized', (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
})

Template.registerHelper('session', name => {
    return Session.get(name)
})
