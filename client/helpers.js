Template.registerHelper('capitalized', str => (str.charAt(0).toUpperCase() + str.slice(1)))

Template.registerHelper('session', name => (Session.get(name)))
