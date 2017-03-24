// @flow
import { Template } from 'meteor/templating'

import Chart from 'chart.js'
import StockWatcher from '/client/lib/ethereum/stocks'
import { Stock } from '/client/lib/ethereum/contracts'
import Identity from '/client/lib/identity'

const Stocks = StockWatcher.Stocks

const tmpl = Template.Module_Ownership_Charts.extend()

const strToColor = (str) => {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash)
  }
  let color = '#'
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xFF
    color += (`00${value.toString(16)}`).substr(-2)
  }
  return color
}

const drawChart = (ctx, title, labels, data, colors) => {
  const chartData = {
    labels,
    datasets: [{ data, backgroundColor: colors || labels.map(strToColor) }],
  }

  new Chart(ctx, {
    type: 'doughnut',
    data: chartData,
    options: { responsive: true, title: { display: true, text: title } },
  })
}

const getBalance = (stock, ethereumAddress) => {
  const entity = Entities.findOne({ ethereumAddress })
  if (!entity || !entity.balances) return 0
  return entity.balances[stock]
}

const drawWithStocks = async (stocks) => {
  drawChart(this.$('#stockChart'), 'Stock types', stocks.map(s => s.symbol), stocks.map(s => s.totalSupply))

  const allShares = stocks.map(s => s.shareholders)
  const globalBalances = {}
  const votingPower = {}

  for (const shareId in allShares) {
    const stock = stocks[shareId]
    const shareShareholders = allShares[shareId].map(x => x.shareholder)

    const balances = shareShareholders.map(a => getBalance(stock.address, a))

    for (const i in shareShareholders) {
      const entity = await Identity.get(shareShareholders[i])
      if (entity.name === 'Company') entity.name = 'Company reserves'
      globalBalances[entity.name] = balances[i] + (globalBalances[entity.name] || 0)
      if (stock.votingPower && entity.name !== 'Company reserves') { // exclude from voting power chart
        votingPower[entity.name] =
          (stock.votingPower * balances[i]) + (votingPower[entity.name] || 0)
      }
    }
  }

  drawChart(this.$('#capitalChart'), 'Global shareholder stake', Object.keys(globalBalances), Object.values(globalBalances))
  drawChart(this.$('#votingChart'), 'Voting stake', Object.keys(votingPower), Object.values(votingPower))
}

const throttledDraw = _.throttle((stocks) => drawWithStocks(stocks), 5000)

tmpl.onRendered(function () {
  $('.tooltip').popup()

  this.autorun(async () => {
    throttledDraw(Stocks.find().fetch())
  })
})
