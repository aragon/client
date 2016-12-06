import Chart from 'chart.js'

import StockWatcher from '/client/lib/ethereum/stocks'
// import Company from '/client/lib/ethereum/deployed'
// import { Stock } from '/client/lib/ethereum/contracts'

const Stocks = StockWatcher.Stocks

const tmpl = Template.module_ownershipCharts

drawChart = (ctx, title, labels, data) => {
  const chartData = {
    labels,
    datasets: [{ data }],
  }

  new Chart(ctx, {
    type: 'doughnut',
    data: chartData,
    options: { responsive: true, title: { display: true, text: title } },
  })
}


tmpl.onRendered(function () {
  this.autorun(async () => {
    const stocks = Stocks.find({}).fetch()
    drawChart($('#stockChart'), 'Stock types', stocks.map(s => s.symbol), stocks.map(s => s.totalSupply))
  })
})
