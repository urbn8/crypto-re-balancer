import { Big } from "big.js";
import * as _ from 'lodash'
import { string } from "./Asset";
import { PorfolioBalance } from "./PorfolioBalance";

export class PorfolioCandle {
  constructor(
    public timestamp: number,
    public porfolioBalance: PorfolioBalance,
    public exchangeRatesByAssets: Map<string, Big>,
  ) {}

  get quoteBalancesByAssets() {
    const balance: Map<string, Big> = new Map()
    for (const symbol of this.porfolioBalance.strings) {
      const exchangeRate = this.exchangeRatesByAssets.get(symbol)
      const quoteBalance = this.porfolioBalance.quote(symbol, exchangeRate)
      balance.set(symbol, quoteBalance)
    }

    return balance
  }

  get totalQuoteBalance(): Big {
    let total: Big = new Big(0)
    this.quoteBalancesByAssets.forEach((v) => {
      total = total.add(v)
    })

    return total
  }

  toJSON() {
    const { timestamp, porfolioBalance, exchangeRatesByAssets } = this
    return {
      timestamp,
      datetime: new Date(timestamp),
      porfolioBalance: porfolioBalance.toJSON(),
      exchangeRatesByAssets: Array.from(exchangeRatesByAssets.keys()).map((k) => ({[k]: exchangeRatesByAssets.get(k).toString()}))
    }
  }
}
