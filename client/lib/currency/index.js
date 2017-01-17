// @flow
import fx from 'money'
import { $ } from 'meteor/jquery'

import Ticker from './ticker'

fx.ready = false
fx.base = 'USD'

const fetchRates = async () => {
  const eth = await Ticker.get('ETH')
  const btc = await Ticker.get('BTC')

  const data = await $.ajax({
    type: 'GET',
    url: 'https://api.fixer.io/latest?base=USD&callback=',
    dataType: 'jsonp',
  })

  const rates = data.rates
  rates.ETH = 1/parseFloat(eth.price)
  rates.BTC = 1/parseFloat(btc.price)

  fx.rates = rates
  fx.ready = true
}

setInterval(fetchRates, 24*60*60*1000)

fetchRates()

export default fx
