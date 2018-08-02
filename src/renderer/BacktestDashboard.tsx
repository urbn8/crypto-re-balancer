import * as path from 'path'
import * as fs from 'fs'
import * as React from "react";
import { Chart } from 'chart.js'
import * as Color from 'color'

// import CandleMgoRepo from '../common/CandleMgoRepo'
import CandleLinvodb3Repo from '../common/CandleLinvodb3Repo'
import CandleNedbRepo from '../common/CandleNedbRepo'
import Backtester from "../common/Backtester";
import HistoricalPriceDataFetcher from '../common/HistoricalPriceDataFetcher';

declare var __static: string
declare var CanvasJS: any

// const candleRepo = new CandleMgoRepo()
// const candleRepo = new CandleLinvodb3Repo()
const candleRepo = new CandleNedbRepo()

const convertChartData = (candle) => {
  return {
    t: candle.openTime,
    y: candle.close,
  }
}

function transparentize(color, opacity?) {
  var alpha = opacity === undefined ? 0.5 : 1 - opacity;
  return Color(color).alpha(alpha).rgbString();
}

interface IState {
  initing: boolean
}

export default class BacktestDashboard extends React.Component<any, IState> {

  // private canvas: React.RefObject<HTMLCanvasElement>
  private canvas: React.RefObject<HTMLDivElement>

  constructor(props) {
    super(props);
    this.canvas = React.createRef();

    this.state = {
      initing: true
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

    console.log('candleRepo.findAllOneYear')
    const btc = await candleRepo.findAllOneYear('BTCUSDT', '1d')
    console.log('btc.length', btc.length)
    if (btc.length === 0) {
      const fetcher = new HistoricalPriceDataFetcher()
      await fetcher.execute()
    }
    this.setState({initing: false})

    const backtester = new Backtester()
    const [porfolio, porfolioTicks] = await backtester.oneYearBacktest()
    console.log('porfolioTicks', porfolioTicks)

    const data = porfolio.assetBalances.map((assetBalance, i) => {
      return {
        type: "stackedArea",
        fillOpacity: .5, 
        markerType: 'circle',
        markerSize: 0,
        color: assetBalance.asset.color,
        showInLegend: true,
        toolTipContent: (() => {
          if (0 === i) {
            return `<b>Total:<b> #total<br><span style="color:${ assetBalance.asset.color }"><strong>{name}: </strong></span> {y}`
          }

          return `<span style="color:${ assetBalance.asset.color }"><strong>{name}: </strong></span> {y}`
        })(),
        name: assetBalance.asset.symbol,
        dataPoints: porfolioTicks.filter((porfolioTick) => {
          return !!porfolioTick.assetBalances[i].value
        }).map((porfolioTick) => ({
          x: porfolioTick.datetime,
          y: porfolioTick.assetBalances[i].value,
        }))
      }
    })

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
      console.log(chart)
      let b = chart._axes.find((a: any) => {return a.type == 'axisX'});
      let delta : number = dir * (b.viewportMaximum - b.viewportMinimum) / 10;
      b.sessionVariables.newViewportMinimum = b.viewportMinimum - delta * (e.clientX / chart.width);
      b.sessionVariables.newViewportMaximum = b.viewportMaximum + delta * (1 - e.clientX / chart.width);
      chart.render();
    }

    this.canvas.current.addEventListener("mousewheel", mouseWheelHandler, false);

    // const datasets = porfolio.assetBalances.map((assetBalance, i) => {
    //   return {
    //     label: assetBalance.asset.symbol,
    //     data: porfolioTicks.filter((porfolioTick) => {
    //       return !!porfolioTick.assetBalances[i].value
    //     }).map((porfolioTick) => ({
    //       t: porfolioTick.datetime,
    //       y: porfolioTick.assetBalances[i].value,
    //     })),
    //     type: 'line',
    //     pointRadius: 0,
    //     fill: true,
    //     lineTension: 0,
    //     borderWidth: 2,
    //     backgroundColor: transparentize(assetBalance.asset.color),
    //     borderColor: assetBalance.asset.color,
    //   }
    // })

    // var ctx = this.canvas.current.getContext('2d');
    
    // var cfg = {
		// 	type: 'line',
		// 	data: {
		// 		// labels: labels,
		// 		datasets,
		// 	},
		// 	options: {
		// 		scales: {
		// 			xAxes: [{
		// 				type: 'time',
		// 				distribution: 'series' as any,
		// 				// ticks: {
		// 				// 	source: 'labels'
		// 				// }
		// 			}],
		// 			yAxes: [{
		// 				scaleLabel: {
		// 					display: true,
		// 					labelString: 'Closing price ($)'
		// 				}
		// 			}]
		// 		}
		// 	}
		// };
		// var chart = new Chart(ctx, cfg);
  }

	render() {
    if (this.state.initing) {
      return <h2>loading</h2>
    }

    return (
      <div ref={this.canvas} style={{height: '100%'}}></div>
    )
  }
}