import { AssetSymbol } from "./Asset";
import { CandleChartResult } from "binance-api-node";
import { Big } from "big.js";

export class MultiAssetsCandle {
  constructor(
    public timestamp: number,
    public data: Map<AssetSymbol, CandleChartResult>,
  ) {}

  get exchangeRate(): Map<AssetSymbol, Big> {
    const data: Map<AssetSymbol, Big> = new Map()
    this.data.forEach((candle, assetSymbol) => {
      if (!candle) {
        console.error('!candle: this.data: ', assetSymbol, this.data)
      }

      data.set(assetSymbol, new Big(candle.close))
    })

    return data
  }

  static fromCandlesSet(timestamp: number, assetSymbols: AssetSymbol[], candlesSet: CandleChartResult[]): MultiAssetsCandle {
    if (assetSymbols.length !== candlesSet.length) {
      throw new Error('assetSymbols.length !== candlesSet.length')
    }

    const data: Map<AssetSymbol, CandleChartResult> = new Map()
    for (let i = 0; i < assetSymbols.length; i++) {
      data.set(assetSymbols[i], candlesSet[i])
    }

    return new MultiAssetsCandle(timestamp, data)
  }
}
