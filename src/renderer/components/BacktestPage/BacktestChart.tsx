import * as path from 'path'
import * as fs from 'fs'
import * as React from "react";
import axios from 'axios'

import CandleMgoRepo from '../../../common/CandleMgoRepo'

import { CandleChartResult } from 'binance-api-node';
import { autorun } from 'mobx';

declare var __static: string
declare var CanvasJS: any

interface IState {
  // candlesByAssets: Map<string, CandleChartResult[]>
}

interface IProps {
  data: {
    chartHoldData: any[]
    chartRebalanceData: any[]
  }
}

export default class BacktestChart extends React.Component<IProps, {}> {

  // private canvas: React.RefObject<HTMLCanvasElement>
  private canvas: React.RefObject<HTMLDivElement>

  constructor(props) {
    super(props);
    this.canvas = React.createRef();

    this.state = {
      // candlesByAssets: undefined
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

    // const API_URL = process.env.ELECTRON_WEBPACK_APP_API_URL || 'http://localhost:8080'
    // const url = `${ API_URL }/backtest/default?rebalancePeriodUnit=week&rebalancePeriod=1`
    // const resp = await axios.get(url)
    // console.log('resp.data.default.length', resp.data.hold[0], resp.data.rebalance[0])
    const data = [
      {
        yValueFormatString: "$#,###",
        xValueFormatString: "YYYY",
        type: "spline",
        dataPoints: this.props.data.chartHoldData,
      },
      {
        yValueFormatString: "$#,###",
        xValueFormatString: "YYYY",
        type: "spline",
        dataPoints: this.props.data.chartRebalanceData,
      }
    ]

    const chart = new CanvasJS.Chart(this.canvas.current, {
      animationEnabled: true,
      zoomEnabled:true,
      title:{
        text: "Lobster 1 Year Backtest"
      },
      axisY :{
        includeZero: false,
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

    console.log('autorun start')
    autorun(() => {
      console.log('autorun')
      data[0].dataPoints = this.props.data.chartHoldData
      data[1].dataPoints = this.props.data.chartRebalanceData
      chart.render()
    })
  }

	render() {
    return (
      <div style={{height: '100%'}}>
        <div ref={this.canvas} style={{height: '100%'}}></div>
      </div>
    )
  }
}