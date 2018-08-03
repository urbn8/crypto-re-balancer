import { CandleChartResult } from "binance-api-node";

interface ICandle {
  readonly timestamp: number
}

export type AdviceAction = 'hold' | 'rebalance'

export interface Advice {
  action: AdviceAction
}

export interface IAdvisor {
  update(candle: ICandle)
}
