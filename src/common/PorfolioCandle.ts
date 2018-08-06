import { Big } from "big.js";
import { AssetSymbol } from "./Asset";
import { PorfolioBalance } from "./PorfolioBalance";

export class PorfolioCandle {
  constructor(
    public timestamp: number,
    public porfolioBalance: PorfolioBalance,
    public exchangeRatesByAssets: Map<AssetSymbol, Big>,
  ) {}

  get quoteBalancesByAssets() {
    const balance: Map<AssetSymbol, Big> = new Map()
    for (const symbol of this.porfolioBalance.assetSymbols) {
      const exchangeRate = this.exchangeRatesByAssets.get(symbol)
      const quoteBalance = this.porfolioBalance.quote(symbol, exchangeRate)
      balance.set(symbol, quoteBalance)
    }

    return balance
  }

  get totalQuoteBalance(): Big {
    const total: Big = new Big(0)
    this.quoteBalancesByAssets.forEach((v) => {
      total.add(v)
    })

    return total
  }
}
