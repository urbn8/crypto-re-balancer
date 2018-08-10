import * as moment from 'moment';
import { Asset, AssetSymbol } from "./Asset";
import CandleRepo from "./CandleRepo";
import { MultiAssetsCandle } from "./MultiAssetsCandle";
import { MultiAssetsCandleFactory } from "./MultiAssetsCandleFactory";
import { CandleChartResult } from 'binance-api-node';

export class Chandelier {
  public candles: MultiAssetsCandle[]
  public candlesByAssets: Map<AssetSymbol, CandleChartResult[]>

  constructor(
    public assets: Asset[],
    private candleRepo: CandleRepo,
  ) {

  }

  async load() {
    const fromTime = moment().add(-1, 'month')
    const candlesOfAssets = await Promise.all(this.assets.map(async (asset) => {
      const candles = await this.candleRepo.findAllSince(asset.symbol, '1m', fromTime.toDate())
      return candles
    }))

    this.candlesByAssets = new Map()
    this.assets.map((asset, i) => {
      this.candlesByAssets.set(asset.symbol, candlesOfAssets[i])
    })

    const fac = new MultiAssetsCandleFactory(this.assets, candlesOfAssets)
    this.candles = fac.candles
    return this.candles
  }
}
