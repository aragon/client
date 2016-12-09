const helpers = {}

helpers.now = () => moment()
helpers.timeRange = (a, b) => moment(a).twix(b).humanizeLength()
helpers.session = name => Session.get(name)
helpers.plus = (a, b) => a + b
helpers.equals = (a, b) => a === b

Object.keys(helpers).forEach(k => Template.registerHelper(k, helpers[k]))
