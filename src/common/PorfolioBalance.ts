import { Big } from "big.js";
import * as _ from 'lodash'

// roundtrips, transaction
export class PorfolioBalance {
  constructor(private amountsByAssets: Map<string, Big>) {
  }
  get size(): number {
    return this.amountsByAssets.size;
  }
  get strings(): string[] {
    return Array.from(this.amountsByAssets.keys());
  }
  quote(string: string, exchangeRate: Big): Big | undefined {
    const baseAmount = this.amountsByAssets.get(string);
    if (typeof baseAmount === 'undefined') {
      return undefined;
    }
    return baseAmount.times(exchangeRate);
  }

  toJSON() {
    const { amountsByAssets } = this
    return {
      amountsByAssets: Array.from(amountsByAssets.keys()).map((k) => ({[k]: amountsByAssets.get(k).toString()}))
    }
  }
}