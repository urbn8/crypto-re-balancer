import { CandleChartResult } from "binance-api-node";
import { Big } from "big.js";

export class MultiAssetsCandle {
  constructor(
    public timestamp: number,
    public data: Map<string, CandleChartResult | undefined>,
  ) {}

  get exchangeRate(): Map<string, Big> {
    const data: Map<string, Big> = new Map()
    this.data.forEach((candle, string) => {
      if (!candle) {
        data.set(string, new Big(0))
        return
      }

      data.set(string, new Big(candle.close))
    })

    return data
  }

  toJSON() {
    const { timestamp, data } = this
    return {
      timestamp,
      datetime: new Date(timestamp),
      data: Array.from(data.keys()).map((k) => ({[k]: data.get(k)}))
    }
  }

  static fromCandlesSet(timestamp: number, strings: string[], candlesSet: Map<string, CandleChartResult | undefined>): MultiAssetsCandle {
    if (strings.length !== candlesSet.size) {
      // console.error('strings', strings, 'candlesSet', candlesSet)
      throw new Error('strings.length !== candlesSet.length')
    }

    const data: Map<string, CandleChartResult> = new Map()
    for (const symbol of strings) {
      data.set(symbol, candlesSet.get(symbol))
    }

    return new MultiAssetsCandle(timestamp, data)
  }
}
