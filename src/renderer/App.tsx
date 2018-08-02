import * as React from "react";
import PropTypes from "prop-types";

import { scaleTime } from "d3-scale";
import { curveMonotoneX } from "d3-shape";

import { ChartCanvas, Chart } from "react-stockcharts";
import { AreaSeries, LineSeries } from "react-stockcharts/lib/series";
import { XAxis, YAxis } from "react-stockcharts/lib/axes";
import { fitDimensions } from "react-stockcharts/lib/helper";
import { createVerticalLinearGradient, hexToRGBA } from "react-stockcharts/lib/utils";

import CandleMgoRepo from '../common/CandleMgoRepo'

const candleRepo = new CandleMgoRepo()

const canvasGradient = createVerticalLinearGradient([
	{ stop: 0, color: hexToRGBA("#b5d0ff", 0.2) },
	{ stop: 0.7, color: hexToRGBA("#6fa4fc", 0.4) },
	{ stop: 1, color: hexToRGBA("#4286f4", 0.8) },
]);

class DataWrapper extends React.Component<any, any> {

}

class AreaChart extends React.Component<any, any> {
	static defaultProps = {
		type: "hybrid",
	}

	async componentDidMount() {
		const [
			btcCandles,
			ethCandles,
		] = await Promise.all([
			candleRepo.findAllOneYear('BTCUSDT', '1h'),
			candleRepo.findAllOneYear('ETHUSDT', '1h'),
		])
		
		const btcData = btcCandles.map((candle) => {
			return {
				date: new Date(candle.openTime),
				close: +candle.close,
			}
		})

		const ethData = ethCandles.map((candle) => {
			return {
				date: new Date(candle.openTime),
				close: +candle.close,
			}
		})

		this.setState({
			data: btcData,
			ethData,
		})
	}

	render() {
		const { type, width, height, ratio } = this.props;
		if (!this.state) {
			return <div>loading...</div>
		}
		const { data, ethData } = this.state
		if (!data) {
			return <div>loading...</div>
		}
		console.log('data.length', data.length)
		if (data.length === 0) {
			return <div>No Data</div>
		}

		return (
			<ChartCanvas ratio={ratio} width={width} height={height}
				margin={{ left: 50, right: 0, top: 10, bottom: 30 }}
				seriesName="MSFT"
				data={data} type={type}
				xAccessor={d => d.date}
				xScale={scaleTime()}
				// xExtents={[new Date(2011, 0, 1), new Date(2013, 0, 2)]}
			>
				<Chart id={0} yExtents={d => d.close}>
					<defs>
						<linearGradient id="MyGradient" x1="0" y1="100%" x2="0" y2="0%">
							<stop offset="0%" stopColor="#b5d0ff" stopOpacity={0.2} />
							<stop offset="70%" stopColor="#6fa4fc" stopOpacity={0.4} />
							<stop offset="100%"  stopColor="#4286f4" stopOpacity={0.8} />
						</linearGradient>
					</defs>
					<XAxis axisAt="bottom" orient="bottom" ticks={6}/>
					<YAxis axisAt="left" orient="left" />
					<LineSeries
						yAccessor={d => d.close}
						stroke="#2ca02c"
					/>
					{/* <LineSeries
						yAccessor={d => d.close}
						stroke="blue"
					/> */}
					{/* <AreaSeries
						yAccessor={d => d.close}
						fill="url(#MyGradient)"
						strokeWidth={2}
						interpolation={curveMonotoneX}
						canvasGradient={canvasGradient}
					/>
					<AreaSeries
						data={ ethData }
						yAccessor={d => d.close}
						fill="url(#MyGradient)"
						strokeWidth={2}
						interpolation={curveMonotoneX}
						canvasGradient={canvasGradient}
					/> */}
				</Chart>
			</ChartCanvas>
		);
	}
}


// AreaChart.propTypes = {
// 	data: PropTypes.array.isRequired,
// 	width: PropTypes.number.isRequired,
// 	ratio: PropTypes.number.isRequired,
// 	type: PropTypes.oneOf(["svg", "hybrid"]).isRequired,
// };

// AreaChart.defaultProps = {
// 	type: "svg",
// };
// AreaChart = fitDimensions(AreaChart);

export default fitDimensions(AreaChart);
