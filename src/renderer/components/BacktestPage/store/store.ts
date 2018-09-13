import { configure, IObservableArray, observable, autorun } from "mobx";
import * as debounce from 'debounce-promise'
import StoreActions from "./StoreActions";

configure({enforceActions: 'observed'})


export interface IBacktestAsset {
  symbol: string
  name: string
  selected: boolean
}

export interface IPropotion {
  symbol: string;
  ratio: number
}

export type PeriodUnit = 'hour' | 'day' | 'week' | 'never'

export class State {
  // asset selection
  @observable assets: IObservableArray<IBacktestAsset> = observable.array()

  // summary
  @observable propotions: IObservableArray<IPropotion> = observable.array()

  // rebalance period
  @observable rebalancePeriod: number = 1
  @observable rebalancePeriodUnit: PeriodUnit = 'week'
}

const Store = () => {
  const state = new State()

  const actions = new StoreActions(state)

  const backtest = debounce(async (
    propotions,
    rebalancePeriod,
    rebalancePeriodUnit,
  ) => {
    await actions.chartBacktests(
      propotions,
      rebalancePeriod,
      rebalancePeriodUnit,
      )
  }, 1000, { leading: false })
  autorun(() => {
    const propotions = state.propotions
    const rebalancePeriod = state.rebalancePeriod
    const rebalancePeriodUnit = state.rebalancePeriodUnit

    backtest(
      propotions,
      rebalancePeriod,
      rebalancePeriodUnit,
    )
  })

  return {
    state,
    actions
  }
}

export default Store

export type IStore = ReturnType<typeof Store>

