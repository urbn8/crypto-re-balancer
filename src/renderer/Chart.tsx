import * as React from "react";
import { Chart } from 'chart.js'

import CandleMgoRepo from '../common/CandleMgoRepo'

const candleRepo = new CandleMgoRepo()

const convertChartData = (candle) => {
  return {
    t: candle.openTime,
    y: candle.close,
  }
}

export default class MyChart extends React.Component<any, any> {

  private canvas: React.RefObject<HTMLCanvasElement>

  constructor(props) {
    super(props);
    this.canvas = React.createRef();
  }

  async componentDidMount() {
    const [
			btcCandles,
      ethCandles,
      eosCandles,
		] = await Promise.all([
			candleRepo.findAllOneYear('BTCUSDT', '1d'),
      candleRepo.findAllOneYear('ETHUSDT', '1d'),
      candleRepo.findAllOneYear('EOSUSDT', '1d'),
    ])

    var ctx = this.canvas.current.getContext('2d');
		ctx.canvas.width = 1000;
		ctx.canvas.height = 300;
		var cfg = {
			type: 'line',
			data: {
				// labels: labels,
				datasets: [
          {
            label: 'BTC',
            data: btcCandles.map(convertChartData),
            type: 'line',
            pointRadius: 0,
            fill: false,
            lineTension: 0,
            borderWidth: 2,
            borderColor: '#F6A33B'
          },
          {
            label: 'ETH',
            data: ethCandles.map(convertChartData),
            type: 'line',
            pointRadius: 0,
            fill: false,
            lineTension: 0,
            borderWidth: 2,
            borderColor: '#131313'
          },
          {
            label: 'EOS',
            data: eosCandles.map(convertChartData),
            type: 'line',
            pointRadius: 0,
            fill: false,
            lineTension: 0,
            borderWidth: 2,
            borderColor: '#070708'
          },
        ]
			},
			options: {
				scales: {
					xAxes: [{
						type: 'time',
						distribution: 'series' as any,
						// ticks: {
						// 	source: 'labels'
						// }
					}],
					yAxes: [{
						scaleLabel: {
							display: true,
							labelString: 'Closing price ($)'
						}
					}]
				}
			}
		};
		var chart = new Chart(ctx, cfg);
  }

	render() {
    return <canvas
      style={{
        height: '100%',
      }} ref={this.canvas}></canvas>
  }
}