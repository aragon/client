// @flow
import { moment } from 'meteor/momentjs:moment'
import { FlowRouter } from 'meteor/kadira:flow-router'

import StockWatcher from '/client/lib/ethereum/stocks'
import { GrantableStock } from '/client/lib/ethereum/contracts'

import helpers from '/client/helpers'

const timeRange = helpers.timeRange

const Stocks = StockWatcher.Stocks

const drawStakeChart = (ctx, title, labels, data) => {
  const chartData = {
    labels,
    datasets: [{ data }],
  }

  new Chart(ctx, {
    type: 'line',
    data: chartData,
    options: { responsive: true, title: { display: true, text: title }, lineTension: 0.1 },
  })
}

const interpolate = (from, to, steps) => {
  const step = (to - from) / (steps - 2)
  return _.range(steps).map(x => from + x * step)
}

export default renderOwnershipInfo = async () => {
  const address = FlowRouter.current().params.address
  const stock = GrantableStock.at(Stocks.findOne().address)
  const fullyVested = await stock.fullyVestedDate.call(address).then(x => x.toNumber())
  const fullyVestedDate = moment(fullyVested * 1000)
  if (moment() > fullyVestedDate) { return null } // already fully vested
  const dates = interpolate(+moment() / 1000, fullyVested, 25)
  const pointsPromise = dates.map(t =>
      stock.transferrableShares.call(address, t).then(x => x.toNumber()))

  const points = await Promise.all(pointsPromise)
  const dateLabels = dates.map(d => timeRange(moment(), moment(d*1000)))

  return drawStakeChart(this.$('#vestingChart'), 'Vesting calendar', dateLabels, points)
}
