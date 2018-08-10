import * as moment from 'moment';
import { Asset } from "./Asset";
import CandleRepo from "./CandleRepo";
import { MultiAssetsCandle } from "./MultiAssetsCandle";
import { MultiAssetsCandleFactory } from "./MultiAssetsCandleFactory";

export class Chandelier {
  public candles: MultiAssetsCandle[]

  constructor(
    public assets: Asset[],
    private candleRepo: CandleRepo,
  ) {

  }

  async load() {
    const fromTime = moment().add(-1, 'year')
    const candlesOfAssets = await Promise.all(this.assets.map(async (asset) => {
      const candles = await this.candleRepo.findAllSince(asset.symbol, '1h', fromTime.toDate())
      return candles
    }))

    const fac = new MultiAssetsCandleFactory(this.assets, candlesOfAssets)
    this.candles = fac.candles
    return this.candles
  }
}
