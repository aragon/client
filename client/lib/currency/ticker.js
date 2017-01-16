// @flow

class Ticker {
  static async get(symbol: string, precision: number = 2): Object {
    const data = await fetch(`https://api.cryptonator.com/api/ticker/${symbol.toLowerCase()}-usd`)
    const json = await data.json()
    const ticker = json.ticker
    ticker.price = parseFloat(ticker.price).toFixed(precision)
    ticker.change = parseFloat(ticker.change)
    return ticker
  }
}

export default Ticker
