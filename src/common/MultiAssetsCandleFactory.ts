import * as _ from 'lodash'

import { Asset, AssetSymbol } from "./Asset";
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

  get assetSymbols(): AssetSymbol[] {
    return this.assets.map((asset) => asset.symbol)
  }

  public get candles(): MultiAssetsCandle[] {
    const candles: MultiAssetsCandle[] = []

    const candleIndicesByAssets: Map<AssetSymbol, number> = new Map()
    for (const asset of this.assets) {
      candleIndicesByAssets.set(asset.symbol, 0)
    }

    while (true) {
      const [timestamp, candlesSet] = this.takeCandlesSet(this.candlesOfAssets, candleIndicesByAssets)
      const candle = MultiAssetsCandle.fromCandlesSet(timestamp, this.assetSymbols, candlesSet)
      candles.push(candle)
    }

    return candles
  }

  takeCandlesSet(candlesOfAssets: CandleChartResult[][], candleIndicesByAssets: Map<AssetSymbol, number>): [number, CandleChartResult[]] {
    const candles: CandleChartResult[] = []
    for (let assetIndex = 0; assetIndex < this.assets.length; assetIndex++) {
      const assetSymbol = this.assets[0].symbol
      const candleIndex = candleIndicesByAssets.get(assetSymbol)

      const candle = candlesOfAssets[assetIndex][candleIndex]
      candles.push(candle)
    }

    const oldestCandle = this.oldestCandle(candles)
    const timestamp = oldestCandle.openTime

    const sameTimestampCandles: CandleChartResult[] = []

    for (let i = 0; i < candles.length; i++) {
      const candle = candles[i]
      if (candle.openTime !== timestamp) {
        sameTimestampCandles[i] = undefined
      } else {
        sameTimestampCandles[i] = candle
      }
    }

    return [timestamp, sameTimestampCandles]
  }

  oldestCandle(candles: CandleChartResult[]): CandleChartResult {
    const candle = _.minBy(candles, (candle) => candle.openTime)
    return candle
  }
}