import { Big } from "big.js";
import { AdvisorPeriodic } from "./AdvisorPeriodic";
import { string } from "./Asset";
import { oneDayInMilliseconds } from "./intervalPresets";
import { PorfolioBalance } from "./PorfolioBalance";
import { Simulator } from "./Simulator";

export default () => new Simulator(
  new PorfolioBalance(
    new Map<string, Big>([
      ['BTCUSDT', new Big(1)],
      ['ETHUSDT', new Big(10)],
      ['BNBUSDT', new Big(300)],
    ])
  ),
)
