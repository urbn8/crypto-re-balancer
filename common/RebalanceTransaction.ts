import { Big } from "big.js";
import { string } from "./Asset";
import { PorfolioBalance } from "./PorfolioBalance";

export class RebalanceTransaction {
  constructor(
    private readonly initialPorfolioBalance: PorfolioBalance,
    private readonly exchangeRatesByAssets: Map<string, Big>,
  ) {
    // validate
    if (initialPorfolioBalance.size != exchangeRatesByAssets.size) {
      throw new Error('initialPorfolioBalance.size != exchangeRatesByAssets.size')
    }

    for (const string of initialPorfolioBalance.strings) {
      if (!exchangeRatesByAssets.has(string)) {
        throw new Error('!exchangeRatesByAssets.has(string)')
      }
    }
  }

  get rebalanced(): PorfolioBalance {
    let totalQuoteBalance = new Big(0)
    this.exchangeRatesByAssets.forEach((exchangeRate, symbol) => {
      totalQuoteBalance = totalQuoteBalance.add(this.initialPorfolioBalance.quote(symbol, exchangeRate))
    })

    const eachAssetQuoteBalance = totalQuoteBalance.div(this.initialPorfolioBalance.size)

    const amountsByAssets: Map<string, Big> = new Map()

    this.exchangeRatesByAssets.forEach((exchangeRate, symbol) => {
      if (exchangeRate.eq(0)) {
        amountsByAssets.set(symbol, new Big(0))
        return
      }

      const baseBalance = eachAssetQuoteBalance.div(exchangeRate)
      amountsByAssets.set(symbol, baseBalance)
    })

    return new PorfolioBalance(amountsByAssets)
  }
}
