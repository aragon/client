import web3 from '/client/lib/ethereum/web3'

const helpers = {}

helpers.now = () => moment()
helpers.timeRange = (a, b) => {
  let timeDiff = moment(a).twix(b).humanizeLength()
  timeDiff = b < new Date() ? `${timeDiff} ago` : timeDiff
  return timeDiff
}
helpers.session = name => Session.get(name)
helpers.plus = (a, b) => a + b
helpers.greaterThan = (a, b) => a > b
helpers.equals = (a, b) => a === b
helpers.percentFormat = x => `${Math.round(10000 * (x || 0)) / 100}%`
helpers.arrayAccess = (array, index) => array[index]
helpers.isNull = x => helpers.equals(x, null)
helpers.isNotNull = x => !helpers.isNull(x)
helpers.count = x => x.count()

helpers.unhandledNotifications = () => Notifications.find({ handled: false }).count()
helpers.ether = x => web3.fromWei(x, 'ether')

Object.keys(helpers).forEach(k => Template.registerHelper(k, helpers[k]))

export default helpers
