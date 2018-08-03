import { Big } from "big.js";
import { AssetSymbol } from "./Asset";
import { PorfolioBalance } from "./PorfolioBalance";

export class RebalanceTransaction {
  constructor(
    private readonly initialPorfolioBalance: PorfolioBalance,
    private readonly exchangeRatesByAssets: Map<AssetSymbol, Big>,
  ) {
    // validate
    if (initialPorfolioBalance.size != exchangeRatesByAssets.size) {
      throw new Error('initialPorfolioBalance.size != exchangeRatesByAssets.size')
    }

    for (const assetSymbol of initialPorfolioBalance.assetSymbols) {
      if (!exchangeRatesByAssets.has(assetSymbol)) {
        throw new Error('!exchangeRatesByAssets.has(assetSymbol)')
      }
    }
  }

  get rebalanced(): PorfolioBalance {
    return null
  }
}
