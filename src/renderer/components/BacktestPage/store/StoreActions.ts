import * as React from "react";
import * as ipc from 'electron-better-ipc'
import { observable, action, extendObservable, configure, IObservableArray, computed, toJS } from "mobx"
import { State, IBacktestAsset } from "./store";

export default class StoreActions {

  constructor(private state: State) {}

  @action.bound private resetPropotion() {
    const selectedAssets = this.state.assets.filter((asset) => {
      return asset.selected
    })

    const ratioEach = 1 / selectedAssets.length

    const propotions = selectedAssets.map((asset) => ({
      symbol: asset.symbol,
      ratio: ratioEach,
    }))

    this.state.propotions.replace(propotions)
  }

  @action.bound public setAssets(assets: IBacktestAsset[]) {
    this.state.assets.replace(assets)

    this.resetPropotion()
  }

  @action.bound public toggleAssetSelection(symbol: string) {
    if (!this.state.assets) return
    const asset = this.state.assets.find((asset) => asset.symbol === symbol)
    asset.selected = !asset.selected

    this.resetPropotion()
    console.log(toJS(this.state.propotions))
  }

  @action.bound public setPropotionRatios(values: number[]) {
    if (values.length === 0) return
    if (values.length === 1) {
      this.state.propotions[0].ratio = 1
    }

    const ratios: number[] = [values[0] / 100]

    for (let i = 1; i < values.length; i++) {
      ratios.push((values[i] - values[i - 1])/ 100)
    }

    ratios.push( (100 - values[values.length - 1]) / 100 )

    for (let i = 0; i < ratios.length; i++) {
      this.state.propotions[i].ratio = ratios[i]
    }
  }
}