import { configure, IObservableArray, observable } from "mobx";
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

// interface IState {
//   assets: IObservableArray<IBacktestAsset>
//   propotions: IObservableArray<IPropotion>
// }

export class State {
  @observable assets: IObservableArray<IBacktestAsset> = observable.array()
  @observable propotions: IObservableArray<IPropotion> = observable.array()
}

const Store = () => {
  const state = new State()

  const actions = new StoreActions(state)

  return {
    state,
    actions
  }
}

export default Store

export type IStore = ReturnType<typeof Store>

