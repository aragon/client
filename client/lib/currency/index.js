// @flow
import fx from 'money'
import coinr from 'coinr'
import { $ } from 'meteor/jquery'

import Settings from '/client/lib/settings'

fx.ready = false
console.log(Settings.get('displayCurrency'))
fx.base = Settings.get('displayCurrency')

const fetchRates = async () => {
  const eth = await coinr('eth')
  const btc = await coinr('btc')

  const data = await $.ajax({
    type: 'GET',
    url: 'https://api.fixer.io/latest?base=USD&callback=',
    dataType: 'jsonp',
  })

  const rates = data.rates
  rates.ETH = 1/parseFloat(eth.price_usd)
  rates.BTC = 1/parseFloat(btc.price_usd)

  fx.rates = rates
  fx.ready = true
}

setInterval(fetchRates, 24*60*60*1000)

fetchRates()

export default fx
