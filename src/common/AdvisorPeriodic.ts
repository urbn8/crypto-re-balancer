import { CandleChartResult } from "binance-api-node";
import { IAdvisor, Advice } from "./Advisor";

export class AdvisorPeriodic implements IAdvisor {
  private lastRebalance: number = 0 // timestamp
  private firstCandle: CandleChartResult

  constructor(
    private readonly rebalanceInterval: number, // milliseconds
    private readonly kickoffDelay: number, // milliseconds
  ) {

  }

  update(candle: CandleChartResult): Advice {
    if (!this.firstCandle) {
      this.firstCandle = candle
    }

    if (candle.openTime < (this.firstCandle.openTime + this.kickoffDelay)) {
      return {
        action: 'hold'
      }
    }

    if (this.lastRebalance === 0) {
      return this.rebalance(candle.openTime)
    }
    
    if (candle.openTime < this.lastRebalance + this.rebalanceInterval) {
      return this.rebalance(candle.openTime)
    }

    return {
      action: 'hold'
    }
  }

  rebalance(timestamp: number): Advice {
    this.lastRebalance = timestamp

    return {
      action: 'rebalance'
    }
  }
}
