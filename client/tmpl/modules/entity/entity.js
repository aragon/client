import ClosableSection from '/client/tmpl/components/closableSection'
import Identity from '/client/lib/identity'
import StockWatcher from '/client/lib/ethereum/stocks'
import { GrantableStock } from '/client/lib/ethereum/contracts'
import helpers from '/client/helpers'

const timeRange = helpers.timeRange

const Stocks = StockWatcher.Stocks

const tmpl = Template.Module_Entity.extend([ClosableSection])

const drawStakeChart = (ctx, title, labels, data) => {
  const chartData = {
    labels,
    datasets: [{ data }],
  }

  new Chart(ctx, {
    type: 'line',
    data: chartData,
    options: { responsive: true, title: { display: true, text: title }, lineTension: 0.1},
  })
}

const getAddress = () => FlowRouter.current().params.address
const interpolate = (from, to, steps) => {
  const step = (to - from) / (steps - 2)
  return _.range(steps).map(x => from + x * step)
}

tmpl.onRendered(async () => {
  // this.autorun(async () => {
  const address = getAddress()
  const stock = GrantableStock.at(Stocks.findOne().address)
  const fullyVested = await stock.fullyVestedDate.call(address).then(x => x.toNumber())
  const fullyVestedDate = moment(fullyVested * 1000)
  if (moment() > fullyVestedDate) { return null } // already fully vested
  const dates = interpolate(+moment() / 1000, fullyVested, 25)
  const pointsPromise = dates.map(t => stock.transferrableShares.call(address, t).then(x => x.toNumber()))
  const points = await Promise.all(pointsPromise)
  const dateLabels = dates.map(d => timeRange(moment(), moment(d*1000)))

  drawStakeChart($('#vestingChart'), 'Vesting calendar', dateLabels, points)
  // })
})

tmpl.helpers({
  address: getAddress,
  entity: ReactivePromise(async () => {
    if (FlowRouter.current()) {
      const address = FlowRouter.current().params.address
      if (address) {
        return Identity.get(address)
      }
      return Identity.current()
    }
    return {}
  }),
  formatFingerprint: (fingerprint) => (fingerprint && fingerprint.match(/.{1,4}/g).join(' ')),
  isMode: mode => FlowRouter.current().path.indexOf(mode) > -1, // HACK
})
