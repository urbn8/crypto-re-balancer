import * as React from "react";
import * as ipc from 'electron-better-ipc'
import { observable, action, extendObservable, configure, IObservableArray } from "mobx"

configure({enforceActions: 'always'})

import BinanceAPI, { ExchangeInfo, Binance, Symbol } from 'binance-api-node';

import BacktestDashboard from "./BacktestDashboard";

export interface IBacktestAsset {
  symbol: string
  name: string
  selected: boolean
}

export interface IState {
  assets: IObservableArray<IBacktestAsset>
}

const storeActions = (state: IState) => {
  const setAssets = action((assets: IBacktestAsset[]) => {
    state.assets.replace(assets)
  })

  const toggleAssetSelection = action((symbol: string) => {
    if (!state.assets) return
    const asset = state.assets.find((asset) => asset.symbol === symbol)
    asset.selected = !asset.selected
  })

  return {
    setAssets,
    toggleAssetSelection,
  }
}

const Store = () => {
  const initState: IState = {
    assets: observable.array([]),
  }
  const state: IState = extendObservable({}, initState)

  const actions = storeActions(state)

  return {state, actions}
}

export type Store = ReturnType<typeof Store>
export type StoreActions = ReturnType<typeof storeActions>

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
  }

	render() {
    return (
      <BacktestDashboard data={ this.store.state } actions={ this.store.actions }/>
    )
  }
}