const helpers = {}

helpers.now = () => moment()
helpers.timeRange = (a, b) => moment(a).twix(b).humanizeLength()
helpers.session = name => Session.get(name)
helpers.plus = (a, b) => a + b
helpers.equals = (a, b) => a === b
helpers.percentFormat = x => `${Math.round(10000 * (x || 0)) / 100}%`
helpers.arrayAccess = (array, index) => array[index]
helpers.isNull = (x) => x === null
helpers.isNotNull = (x) => x !== null
Object.keys(helpers).forEach(k => Template.registerHelper(k, helpers[k]))
