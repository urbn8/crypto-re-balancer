import * as path from 'path'
import * as fs from 'fs'
import * as React from "react";
import { Chart } from 'chart.js'
import * as Color from 'color'

import CandleMgoRepo from '../common/CandleMgoRepo'
import backtest from "../common/backtest";
import { Chandelier } from '../common/Chandelier';
import { Asset, AssetSymbol } from '../common/Asset';

import CandleStickChart from './CandleStickChart'
import { CandleChartResult } from 'binance-api-node';

declare var __static: string
declare var CanvasJS: any

const candleRepo = new CandleMgoRepo()

interface IState {
  candlesByAssets: Map<AssetSymbol, CandleChartResult[]>
}

export default class BacktestDashboard extends React.Component<any, IState> {

  // private canvas: React.RefObject<HTMLCanvasElement>
  private canvas: React.RefObject<HTMLDivElement>

  constructor(props) {
    super(props);
    this.canvas = React.createRef();

    this.state = {
      candlesByAssets: undefined
    }
  }

  async componentDidMount() {
    if (!document.getElementById('canvasjs')) {
      const script = document.createElement('script');
      script.id = 'canvasjs'
      script.type = "text/javascript"
      script.text = fs.readFileSync(path.join(__static, '/canvasjs/canvasjs.min.js'), 'utf8')
      document.head.appendChild(script);
    }

    // const btc = await candleRepo.findAllOneYear('BTCUSDT', '1d')

    const assets: Asset[] = [
      {
        symbol: 'BTCUSDT',
        name: 'Bitcoin',
        icon: '',
        color: 'rgb(255, 205, 86)',
      },
      {
        symbol: 'ETHUSDT',
        name: 'Ethereum',
        icon: '',
        color: 'rgb(153, 102, 255)',
      },
      {
        symbol: 'BNBUSDT',
        name: 'BNB',
        icon: '',
        color: 'rgb(201, 203, 207)',
      },
    ]

    const backtestResult = await backtest.backtest(new Chandelier(assets, candleRepo))

    this.setState({
      candlesByAssets: backtestResult.candlesByAssets,
    })

    const dataPoints = backtestResult.porfolioBalanceHistoryXY
    console.log('dataPoints', dataPoints)
    const data = [
      {
        yValueFormatString: "#,### Units",
        xValueFormatString: "YYYY",
        type: "spline",
        dataPoints,
      }
    ]

    const chart = new CanvasJS.Chart(this.canvas.current, {
      animationEnabled: true,
      zoomEnabled:true,
      title:{
        text: "Lobster 1 Year Backtest"
      },
      axisY :{
        valueFormatString: "#0,.",
        suffix: "k"
      },
      axisX: {
      },
      toolTip: {
        shared: true
      },
      data,
    });
    
    chart.render();

    const mouseWheelHandler = function (e:any) {
      let dir : number = (e.wheelDelta || -e.detail) > 0 ? -1 : +1;
      let b = chart._axes.find((a: any) => {return a.type == 'axisX'});
      let delta : number = dir * (b.viewportMaximum - b.viewportMinimum) / 10;
      b.sessionVariables.newViewportMinimum = b.viewportMinimum - delta * (e.clientX / chart.width);
      b.sessionVariables.newViewportMaximum = b.viewportMaximum + delta * (1 - e.clientX / chart.width);
      chart.render();
    }

    this.canvas.current.addEventListener("mousewheel", mouseWheelHandler, false);
  }

	render() {
    if (this.state.candlesByAssets) {
      // console.log("this.state.candlesByAssets.get('BTCUSDT')", this.state.candlesByAssets.get('BTCUSDT'))
      // console.log("this.state.candlesByAssets.get('ETHUSDT')", this.state.candlesByAssets.get('ETHUSDT'))
      // console.log("this.state.candlesByAssets.get('BNBUSDT')", this.state.candlesByAssets.get('BNBUSDT'))
    }
    return (
      <div style={{height: '100%'}}>
        <div ref={this.canvas} style={{height: '50%'}}></div>
        {
          this.state.candlesByAssets ? (
            <div>
              <CandleStickChart data={ this.state.candlesByAssets.get('BTCUSDT') } />
              <CandleStickChart data={ this.state.candlesByAssets.get('ETHUSDT') } />
              <CandleStickChart data={ this.state.candlesByAssets.get('BNBUSDT') } />
            </div>
          ) : undefined
        }
      </div>
    )
  }
}