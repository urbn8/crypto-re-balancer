import { Big } from "big.js";
import { IAdvisor } from "./Advicer";
import { CandleChartResult } from "binance-api-node";

// roundtrips, transaction

class Backtester {
  
}

interface IStrategy {

}

type AssetSymbol = string

class PorfolioBalance {
  constructor(
    private amountsByAssets: Map<AssetSymbol, Big>
  ) {

  }

  get size(): number {
    return this.amountsByAssets.size
  }

  get assetSymbols(): AssetSymbol[] {
    return Array.from(this.amountsByAssets.keys())
  }

  quote(assetSymbol: AssetSymbol, exchangeRate: Big): Big | undefined {
    const baseAmount = this.amountsByAssets.get(assetSymbol)
    if (typeof baseAmount === 'undefined') {
      return undefined
    }

    return baseAmount.times(exchangeRate)
  }
}



class RebalanceTransaction {
  constructor(
    private readonly initialPorfolioBalance: PorfolioBalance,
    private readonly exchangeRatesByAssets: Map<AssetSymbol, Big>,
  ) {
    // validate
    if (initialPorfolioBalance.size != exchangeRatesByAssets.size) {
      throw new Error('initialPorfolioBalance.size != exchangeRatesByAssets.size')
    }

    for (const assetSymbol of initialPorfolioBalance.assetSymbols) {
      if (!exchangeRatesByAssets.has(assetSymbol)) {
        throw new Error('!exchangeRatesByAssets.has(assetSymbol)')
      }
    }
  }

  get rebalanced(): PorfolioBalance {
    return null
  }
}

class Simulator {
  private totalFeeCosts = 0
  private totalTradedVolume = 0
  private transactions: RebalanceTransaction[] = []

  constructor(
    private porfolioBalance: PorfolioBalance,
    private advisor: IAdvisor,
  ) {

  }

  async execute(candles: CandleChartResult[], txFee: Big, strategy: IStrategy) {
    for (const candle of candles) {
      const advice = this.advisor.update(candle)
      if (advice.action === 'rebalance') {
        await this.rebalance(candle)
      }
    }
  }

  async rebalance(candle: CandleChartResult) {

  }
}
