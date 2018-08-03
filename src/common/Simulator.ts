import { Big } from "big.js";
import * as moment from 'moment'

import { IAdvisor } from "./Advisor";
import { CandleChartResult } from "binance-api-node";
import CandleRepo from "./CandleRepo";
import { Asset, AssetSymbol } from "./Asset";
import { MultiAssetsCandle } from "./MultiAssetsCandle";
import { MultiAssetsCandleFactory } from "./MultiAssetsCandleFactory";
import { RebalanceTransaction } from "./RebalanceTransaction";
import { PorfolioBalance } from "./PorfolioBalance";

// roundtrips, transaction

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

class PorfolioCandle {
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
}

export class Simulator {
  private totalFeeCosts = 0
  private totalTradedVolume = 0
  private transactions: RebalanceTransaction[] = []

  constructor(
    private initialPorfolioBalance: PorfolioBalance,
    private advisor: IAdvisor,
    private chandelier: Chandelier,
  ) {

  }

  get porfolioBalance(): PorfolioBalance {
    if (this.transactions.length === 0) {
      return this.initialPorfolioBalance
    }

    return this.transactions[this.transactions.length - 1].rebalanced
  }

  async execute() {
    await this.chandelier.load()
    return this.porfolioCandles(this.chandelier)
  }

  porfolioCandles(chandelier: Chandelier): PorfolioCandle[] {
    const porfolioCandles: PorfolioCandle[] = []
    for (const candle of chandelier.candles) {
      const advice = this.advisor.update(candle)
      if (advice.action === 'rebalance') {
        this.rebalance(candle)
      }

      const porfolioCandle = new PorfolioCandle(candle.timestamp, this.porfolioBalance, candle.exchangeRate)
      porfolioCandles.push(porfolioCandle)
    }

    return porfolioCandles
  }

  rebalance(candle: MultiAssetsCandle) {
    if (this.transactions.length === 0) {
      this.transactions.push(new RebalanceTransaction(
        this.initialPorfolioBalance,
        candle.exchangeRate,
      ))
      return
    }

    this.transactions.push(new RebalanceTransaction(
      this.transactions[this.transactions.length - 1].rebalanced,
      candle.exchangeRate,
    ))
  }
}
