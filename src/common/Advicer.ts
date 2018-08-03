import { CandleChartResult } from "binance-api-node";

export type AdviceAction = 'hold' | 'rebalance'

export interface Advice {
  action: AdviceAction
}

export interface IAdvisor {
  update(candle: CandleChartResult)
}
