import React, { useState, useEffect } from "react"
import { Link } from "gatsby"
import axios from "axios"
import { Bar } from "react-chartjs-2"
// import { Spread } from './spread'

export default function BarCharts(props) {
	const [chartData, setChartData] = useState([])

	useEffect(() => {
		axios({
			method: "GET",
			url: `${process.env.SERVER}/funding_rates?future=${props.coin}-perp`,
		}).then(res => {
			// Get Response, map out labels & rates
			const coin = res.data.result
			let data = []
			let labels = []
			coin.forEach(e => {
				labels.push(e.time)
				data.push(JSON.stringify(e.rate * 100).substr(0, 7))
			})

			// Set data for chart
			setChartData({
				labels: labels,
				backgroundColor: "#39ACFA",
				datasets: [
					{
						label: `${props.coin} Funding`,
						data: data,
						backgroundColor: "#39ACFA",
					},
				],
			})
		})
	}, [setChartData])

	return (
		<>
			<Link to={`/coin/${props.coin}`}>
				<h4 id={props.coin}>{props.coin}</h4>
			</Link>
			<Bar
				data={chartData}
				options={{
					legend: {
						display: false,
						labels: {
							fontColor: "rgb(255, 99, 132)",
						},
					},
					scales: {
						xAxes: [
							{
								ticks: {
									display: false,
									reverse: true,
								},
								gridLines: {
									display: false,
								},
							},
						],
						yAxes: [
							{
								gridLines: {
									color: "rgba(0,0,0,0.2)",
								},
							},
						],
					},
				}}
			/>
		</>
	)
}
