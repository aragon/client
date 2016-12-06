import Chart from 'chart.js'

import StockWatcher from '/client/lib/ethereum/stocks'
// import Company from '/client/lib/ethereum/deployed'
import { Stock } from '/client/lib/ethereum/contracts'

const Stocks = StockWatcher.Stocks

const tmpl = Template.module_ownershipCharts

const colorFromAddress = address => `#${address.substr(-6)}`

const drawChart = (ctx, title, labels, data, colors) => {
  const chartData = {
    labels,
    datasets: [{ data, backgroundColor: colors || labels.map(colorFromAddress) }],
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

    const allShares = await Promise.all(stocks.map(StockWatcher.allShareholders))
    const globalBalances = {}
    const votingPower = {}

    for (const shareId in allShares) {
      const stock = stocks[shareId]
      const stockContract = Stock.at(stock.address)
      const shareShareholders = allShares[shareId].map(a => a.shareholder)
      const balancePromises = shareShareholders
              .map(a => stockContract.balanceOf(a).then(x => x.toNumber()))
      const balances = await Promise.all(balancePromises)

      for (const i in shareShareholders) {
        const key = shareShareholders[i]
        globalBalances[key] = balances[i] + (globalBalances[key] || 0)
        if (stock.votesPerShare) {
          votingPower[key] = (stock.votesPerShare * balances[i]) + (votingPower[key] || 0)
        }
      }
    }

    drawChart($('#capitalChart'), 'Global shareholder stake', Object.keys(globalBalances), Object.values(globalBalances))
    drawChart($('#votingChart'), 'Voting stake', Object.keys(votingPower), Object.values(votingPower))

  })
})
