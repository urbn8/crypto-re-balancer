import * as React from "react";
import * as ipc from 'electron-better-ipc'

import BinanceAPI, { ExchangeInfo, Binance, Symbol } from 'binance-api-node';

import BacktestDashboard, { IProps } from "./BacktestDashboard";
import { Asset } from "../../common/Asset";

type symbolStatus = 'PRE_TRADING' | 'TRADING' | 'POST_TRADING' | 'END_OF_DAY' | 'HALT' | 'AUCTION_MATCH' | 'BREAK'

interface IState extends IProps{
}

export default class BacktestDashboardContainer extends React.Component<any, IState> {
  constructor(props) {
    super(props);
  }

  async componentDidMount() {
    
    const assets: Asset[] = await ipc.callMain('assets');
    console.log('assets: ', assets)

    this.setState({
      assets,
    })
  }

	render() {
    return (
      <BacktestDashboard { ...this.state }/>
    )
  }
}