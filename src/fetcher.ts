import HistoricalPriceDataFetcher from './common/HistoricalPriceDataFetcher'

const fetcher = new HistoricalPriceDataFetcher()

// fetcher.execute('BTCUSDT').catch((err) => console.error(err))
fetcher.execute().catch((err) => console.error(err))
