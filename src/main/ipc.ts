import * as ipc from 'electron-better-ipc'
import * as _ from 'lodash'
import * as fs from 'fs-extra'
import * as path from 'path'

import BinanceAPI, { CandleChartResult, Binance, Symbol, ExchangeInfo } from 'binance-api-node';
import { Asset } from '../common/Asset';

declare const __static: string

const binance = BinanceAPI()

ipc.answerRenderer('assets', async () => {
  const exchangeInfo: ExchangeInfo = await binance.exchangeInfo()
  const exchangeSymbols = exchangeInfo.symbols
  const symbols = _.map(exchangeSymbols, (s): string => s.baseAsset)

  const uniqSymbols = _.uniq(symbols)

  const files: string[] = await fs.readdir(path.join(__static, 'cryptocurrency-icons/svg/icon/'))
  const symbolsWithIcon = _.map(files, (file) => _.trimEnd(file, '.svg'))
  
  const allSymbols = _.intersectionWith(uniqSymbols, symbolsWithIcon, (a, b) => a.toLowerCase() === b.toLowerCase())

  const assets = _.map(allSymbols, (s): Asset => ({
    symbol: s,
    name: s,
    icon: '',
    color: '',
  }))

  return assets
})
