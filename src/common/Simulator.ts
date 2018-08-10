import { IAdvisor } from "./Advisor";
import { Chandelier } from "./Chandelier";
import { MultiAssetsCandle } from "./MultiAssetsCandle";
import { PorfolioBalance } from "./PorfolioBalance";
import { PorfolioCandle } from "./PorfolioCandle";
import { RebalanceTransaction } from "./RebalanceTransaction";
import { AssetSymbol, Asset } from "./Asset";
import { Big } from "big.js";


// roundtrips, transaction

export class BacktestResult {
  constructor(
    public assets: Asset[],
    public ohlcCandles: MultiAssetsCandle[],
    public porfolioCandles: PorfolioCandle[],
  ) {}

  get porfolioBalanceHistoryXY(): {x: Date, y: number}[] {
    const history: {x: Date, y: number}[] = []
    console.log('this.porfolioCandles.length', this.porfolioCandles.length)
    this.porfolioCandles.forEach((candle) => {
      history.push({
        x: new Date(candle.timestamp),
        y: Number(candle.totalQuoteBalance)
      })
    })

    return history
  }

  get assetsBalanceHistory(): Map<AssetSymbol, [number, Big][]> {
    const m: Map<AssetSymbol, [number, Big][]> = new Map()
    for (const asset of this.assets) {
      m.set(asset.symbol, [])
    }

    this.porfolioCandles.forEach((candle) => {
      const quoteBalancesByAssets = candle.quoteBalancesByAssets
      for (const asset of this.assets) {
        const quoteBalance = quoteBalancesByAssets.get(asset.symbol)
        m.get(asset.symbol).push([candle.timestamp, quoteBalance])
      }
    })

    return m
  }

  get assetsBalanceHistoryXY(): Map<AssetSymbol, {x: number, y: number}[]> {
    const m: Map<AssetSymbol, {x: number, y: number}[]> = new Map()
    for (const asset of this.assets) {
      m.set(asset.symbol, [])
    }

    this.porfolioCandles.forEach((candle) => {
      const quoteBalancesByAssets = candle.quoteBalancesByAssets
      for (const asset of this.assets) {
        const quoteBalance = quoteBalancesByAssets.get(asset.symbol)
        m.get(asset.symbol).push({
          x: candle.timestamp, y: Number(quoteBalance)
        })
      }
    })

    return m
  }
}

export class Simulator {
  private totalFeeCosts = 0
  private totalTradedVolume = 0
  // private transactions: RebalanceTransaction[] = []
  private latestTransaction: RebalanceTransaction

  constructor(
    private initialPorfolioBalance: PorfolioBalance,
    private advisor: IAdvisor,
  ) {}

  get porfolioBalance(): PorfolioBalance {
    if (!this.latestTransaction) {
      // console.log('this.initialPorfolioBalance', this.initialPorfolioBalance)
      return this.initialPorfolioBalance
    }

    // console.log('this.latestTransaction.rebalanced', this.latestTransaction.rebalanced)
    return this.latestTransaction.rebalanced
    // if (this.transactions.length === 0) {
    //   return this.initialPorfolioBalance
    // }

    // return this.transactions[this.transactions.length - 1].rebalanced
  }

  async backtest(chandelier: Chandelier): Promise<BacktestResult> {
    const multiAssetsCandle = await chandelier.load()
    const porfolioCandles = this.porfolioCandles(chandelier)
    return new BacktestResult(
      chandelier.assets,
      multiAssetsCandle,
      porfolioCandles,
    )
  }

  porfolioCandles(chandelier: Chandelier): PorfolioCandle[] {
    const porfolioCandles: PorfolioCandle[] = []
    console.log('chandelier.candles.length', chandelier.candles.length)
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
    if (!this.latestTransaction) {
      this.latestTransaction = new RebalanceTransaction(
        this.initialPorfolioBalance,
        candle.exchangeRate,
      )
      return
    }

    this.latestTransaction = new RebalanceTransaction(
      this.latestTransaction.rebalanced,
      candle.exchangeRate,
    )
    // if (this.transactions.length === 0) {
    //   this.transactions.push(new RebalanceTransaction(
    //     this.initialPorfolioBalance,
    //     candle.exchangeRate,
    //   ))
    //   return
    // }

    // this.transactions.push(new RebalanceTransaction(
    //   this.transactions[this.transactions.length - 1].rebalanced,
    //   candle.exchangeRate,
    // ))
  }
}
