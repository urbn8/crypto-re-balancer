import * as _ from 'lodash'

import { Asset, string } from "./Asset";
import { CandleChartResult } from "binance-api-node";
import { MultiAssetsCandle } from "./MultiAssetsCandle";

export class MultiAssetsCandleFactory {
  constructor(
    private assets: Asset[],
    private candlesOfAssets: CandleChartResult[][],
  ) {
    if (assets.length !== candlesOfAssets.length) {
      throw new Error('assets.length !== candlesOfAssets.length')
    }
  }

  get strings(): string[] {
    return this.assets.map((asset) => asset.symbol)
  }

  public get candles(): MultiAssetsCandle[] {
    const candles: MultiAssetsCandle[] = []

    const candleIndicesByAssets: Map<string, number> = new Map()
    for (const asset of this.assets) {
      candleIndicesByAssets.set(asset.symbol, 0)
    }

    let prevTimestamp: number = null

    while (true) {
      const [timestamp, candlesSet] = this.takeCandlesSet(this.candlesOfAssets, candleIndicesByAssets)
      if (this.isEmpty(candlesSet)) {
        console.log('MultiAssetsCandleFactory finished at timestamp: ', new Date(prevTimestamp))
        break
      }

      const candle = MultiAssetsCandle.fromCandlesSet(timestamp, this.strings, candlesSet)
      candles.push(candle)

      prevTimestamp = timestamp
    }

    return candles
  }

  takeCandlesSet(candlesOfAssets: CandleChartResult[][], candleIndicesByAssets: Map<string, number>): [number, Map<string, CandleChartResult | undefined>] {
    const candles: Map<string, CandleChartResult> = new Map()
    for (let assetIndex = 0; assetIndex < this.assets.length; assetIndex++) {
      const string = this.assets[assetIndex].symbol
      const candleIndex = candleIndicesByAssets.get(string)

      const candle = candlesOfAssets[assetIndex][candleIndex]
      candles.set(string, candle)
    }

    if (this.isEmpty(candles)) {
      return [0, candles]
    }

    const oldestCandle = this.oldestCandle(Array.from(candles.values()))
    const timestamp = oldestCandle.openTime

    const sameTimestampCandles: Map<string, CandleChartResult> = new Map()
    
    candles.forEach((candle, symbol) => {
      if (!candle) {
        sameTimestampCandles.set(symbol, undefined)
        return
      }

      if (candle.openTime === timestamp) {
        sameTimestampCandles.set(symbol, candle)
        candleIndicesByAssets.set(symbol, candleIndicesByAssets.get(symbol) + 1)
      } else {
        sameTimestampCandles.set(symbol, undefined)
      }
    })

    return [timestamp, sameTimestampCandles]
  }

  oldestCandle(candles: CandleChartResult[]): CandleChartResult {
    const candle = _.minBy(candles, (candle) => {
      if (!candle) {
        return Number.MAX_SAFE_INTEGER
      }

      return candle.openTime
    })
    return candle
  }

  isEmpty(candles: Map<string, CandleChartResult | undefined>) {
    for (const candle of candles.values()) {
      if (typeof candle !== 'undefined') {
        return false
      }
    }

    return true
  }
}