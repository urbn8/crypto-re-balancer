import { Big } from "big.js";
import * as moment from 'moment'

import { IAdvisor } from "./Advisor";
import { CandleChartResult } from "binance-api-node";
import CandleRepo from "./CandleRepo";
import { Asset, AssetSymbol } from "./Asset";
import { MultiAssetsCandle } from "./MultiAssetsCandle";
import { MultiAssetsCandleFactory } from "./MultiAssetsCandleFactory";

// roundtrips, transaction

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

type Tick = {
  timestamp: number
}


class Chandelier {
  public candles: MultiAssetsCandle[]

  constructor(
    private assets: Asset[],
    private candleRepo: CandleRepo,
  ) {

  }

  async load() {
    const fromTime = moment().add(-1, 'year')
    const candlesOfAssets = await Promise.all(this.assets.map(async (asset) => {
      const candles = await this.candleRepo.findAllSince(asset.symbol, '1d', fromTime.toDate())
      return candles
    }))

    const fac = new MultiAssetsCandleFactory(this.assets, candlesOfAssets)
    this.candles = fac.candles
  }
}

export class Simulator {
  private totalFeeCosts = 0
  private totalTradedVolume = 0
  private transactions: RebalanceTransaction[] = []

  constructor(
    private porfolioBalance: PorfolioBalance,
    private advisor: IAdvisor,
  ) {

  }

  async execute(chandelier: Chandelier) {
    for (const candle of chandelier.candles) {
      const advice = this.advisor.update(candle)
      if (advice.action === 'rebalance') {
        await this.rebalance(candle)
      }
    }
  }

  async rebalance(candle: MultiAssetsCandle) {
    if (this.transactions.length === 0) {
      this.transactions.push(new RebalanceTransaction(
        this.porfolioBalance,
        candle.exchangeRate,
      ))
    }
  }
}
