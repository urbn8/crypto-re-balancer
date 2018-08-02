import * as moment from 'moment'
import * as path from 'path'
import * as Datastore from 'nedb'
import { CandleChartResult, CandleChartInterval } from 'binance-api-node';
import { mockComponent } from 'react-dom/test-utils';
import CandleRepo from './CandleRepo'

const {app} = require('electron').remote;
import { resolve } from 'url';

const RELATIVE_PATH = app.getPath("userData");

export default class CandleNedbRepo implements CandleRepo {
  private collection(symbol: string, interval: CandleChartInterval): Promise<Datastore> {
    return new Promise((resolve, reject) => {
      const db = new Datastore({ filename: path.join(RELATIVE_PATH, `candles_BINA_${symbol}_${ interval }.db`) })
      db.loadDatabase(function(err) {
        if (err) {
          reject(err)
          return
        }
        resolve(db)
      })
    })
  }

  findAll(symbol: string, interval: CandleChartInterval): Promise<CandleChartResult[]> {
    return new Promise<CandleChartResult[]>(async (resolve, reject) => {
      const col = await this.collection(symbol, interval)

      col.find<CandleChartResult>({}, (err, data) => {
        if (err) {
          reject(err)
          return
        }

        resolve(data)
      })
    })
  }

  async findAllOneYear(symbol: string, interval: CandleChartInterval): Promise<CandleChartResult[]> {
    return new Promise<CandleChartResult[]>(async (resolve, reject) => {
      const col = await this.collection(symbol, interval)

      col.find<CandleChartResult>({
        openTime: {
          $gte: moment().add(-1, 'year').unix(),
        }
      }, (err, data) => {
        if (err) {
          reject(err)
          return
        }

        resolve(data)
      })
    })
  }

  findAllSince(symbol: string, interval: CandleChartInterval, since: Date): Promise<CandleChartResult[]> {
    return new Promise<CandleChartResult[]>(async (resolve, reject) => {
      const col = await this.collection(symbol, interval)

      col.find<CandleChartResult>({
        openTime: {
          $gte: since.getTime(),
        }
      }, (err, data) => {
        if (err) {
          reject(err)
          return
        }

        resolve(data)
      })
    })
  }

  findOneByOpenTime(symbol: string, interval: CandleChartInterval, openTime: Date): Promise<CandleChartResult> {
    return new Promise<CandleChartResult>(async (resolve, reject) => {
      const col = await this.collection(symbol, interval)

      col.findOne<CandleChartResult>({
        _id: openTime.toString(),
      }, (err, data) => {
        if (err) {
          reject(err)
          return
        }

        resolve(data)
      })
    })
  }

  saveAll(symbol: string, interval: CandleChartInterval, candles: CandleChartResult[]) {
    return new Promise<void>(async (resolve, reject) => {
      if (candles.length === 0) {
        resolve()
        return
      }

      const col = await this.collection(symbol, interval)

      col.insert(candles.map((candle) => {
        return {
          _id: candle.openTime.toString(),
          ...candle
        }
      }), (err, data) => {
        if (err) {
          reject(err)
          return
        }

        resolve()
      })
    })
  }
}