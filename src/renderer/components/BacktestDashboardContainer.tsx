import * as React from "react";
import * as ipc from 'electron-better-ipc'
import { observable, action, extendObservable, configure, IObservableArray, computed, toJS } from "mobx"

configure({enforceActions: 'always'})

import BinanceAPI, { ExchangeInfo, Binance, Symbol } from 'binance-api-node';

import BacktestDashboard from "./BacktestDashboard";

export interface IBacktestAsset {
  symbol: string
  name: string
  selected: boolean
}

export interface IPropotion {
  symbol: string;
  ratio: number
}

interface IState {
  assets: IObservableArray<IBacktestAsset>
  propotions: IObservableArray<IPropotion>
}

const computedState = (state: IState) => {
  // const assetPropotionsState = observable.array<IPropotion>([])

  const selectedAssets = computed(() => {
    return state.assets.filter((asset) => {
      return asset.selected
    })
  })

  return {
    // selectedAssets,
  }
}

const storeActions = (state: IState) => {
  const _resetPropotion = action(() => {
    const selectedAssets = state.assets.filter((asset) => {
      return asset.selected
    })

    const ratioEach = 1 / selectedAssets.length

    const propotions = selectedAssets.map((asset) => ({
      symbol: asset.symbol,
      ratio: ratioEach,
    }))
    state.propotions.replace(propotions)
  })

  const setAssets = action((assets: IBacktestAsset[]) => {
    state.assets.replace(assets)

    _resetPropotion()
  })

  const toggleAssetSelection = action((symbol: string) => {
    if (!state.assets) return
    const asset = state.assets.find((asset) => asset.symbol === symbol)
    asset.selected = !asset.selected

    _resetPropotion()
    console.log(toJS(state.propotions))
  })

  const setPropotionRatios = action((values: number[]) => {
    if (values.length === 0) return
    if (values.length === 1) {
      state.propotions[0].ratio = 1
    }

    const ratios: number[] = [values[0] / 100]

    for (let i = 1; i < values.length; i++) {
      ratios.push((values[i] - values[i - 1])/ 100)
    }

    ratios.push( (100 - values[values.length - 1]) / 100 )

    for (let i = 0; i < ratios.length; i++) {
      state.propotions[i].ratio = ratios[i]
    }
  })

  return {
    setAssets,
    toggleAssetSelection,
    setPropotionRatios,
  }
}

const Store = () => {
  const initState: IState = {
    assets: observable.array([]),
    propotions: observable.array([]),
  }
  const state: IState = extendObservable({}, initState)
  const computed = computedState(state)

  const actions = storeActions(state)

  return {
    state: {
      ...state,
      ...computed,
    }, actions
  }
}

export type Store = ReturnType<typeof Store>
export type StoreActions = ReturnType<typeof storeActions>
export type State = IState & ReturnType<typeof computedState>

type symbolStatus = 'PRE_TRADING' | 'TRADING' | 'POST_TRADING' | 'END_OF_DAY' | 'HALT' | 'AUCTION_MATCH' | 'BREAK'

export default class BacktestDashboardContainer extends React.Component<{}, {}> {
  private store: Store

  constructor(props) {
    super(props);

    this.store = Store()
  }

  async componentDidMount() {
    
    const assets: IBacktestAsset[] = await ipc.callMain('assets');
    console.log('assets: ', assets)

    this.store.actions.setAssets(assets.map((asset) => ({...asset, selected: false})))
    this.store.actions.toggleAssetSelection('BTC')
    this.store.actions.toggleAssetSelection('ETH')
    this.store.actions.toggleAssetSelection('BNB')
  }

	render() {
    return (
      <BacktestDashboard data={ this.store.state } actions={ this.store.actions }/>
    )
  }
}