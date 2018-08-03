import { CandleChartResult } from "binance-api-node";
import { IAdvisor, Advice } from "./Advisor";

export class AdvisorPeriodic implements IAdvisor {
  private lastRebalance: number = 0 // timestamp
  private firstCandle: CandleChartResult
  private lastCandle: CandleChartResult

  constructor(
    private readonly rebalanceInterval: number, // milliseconds
    private readonly kickoffDelay: number, // milliseconds
  ) {

  }

  update(candle: CandleChartResult): Advice {
    if (!this.firstCandle) {
      this.firstCandle = candle
    }

    const lastCandle = this.lastCandle
    this.lastCandle = candle

    if (candle.openTime < (this.firstCandle.openTime + this.kickoffDelay)) {
      return {
        action: 'hold'
      }
    }
    
    return {
      action: 'rebalance'
    }
  }
}
