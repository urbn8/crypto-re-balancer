import { IAdvisor } from "./Advisor";
import { Chandelier } from "./Chandelier";
import { MultiAssetsCandle } from "./MultiAssetsCandle";
import { PorfolioBalance } from "./PorfolioBalance";
import { PorfolioCandle } from "./PorfolioCandle";
import { RebalanceTransaction } from "./RebalanceTransaction";


// roundtrips, transaction

export class Simulator {
  private totalFeeCosts = 0
  private totalTradedVolume = 0
  private transactions: RebalanceTransaction[] = []

  constructor(
    private initialPorfolioBalance: PorfolioBalance,
    private advisor: IAdvisor,
  ) {}

  get porfolioBalance(): PorfolioBalance {
    if (this.transactions.length === 0) {
      return this.initialPorfolioBalance
    }

    return this.transactions[this.transactions.length - 1].rebalanced
  }

  async execute(chandelier: Chandelier) {
    await chandelier.load()
    return this.porfolioCandles(chandelier)
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
