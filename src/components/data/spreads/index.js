import React, { useState, useEffect } from "react"
import axios from "axios"
import moment from "moment"
import {
	VictoryChart,
	VictoryLine,
	VictoryTooltip,
	VictoryCursorContainer,
	VictoryZoomContainer,
	VictoryBar,
} from "victory"

import SpreadCoins from "./spreadCoins"

export default function Index(props) {
	const [bids, setBids] = useState([])
	const [asks, setAsks] = useState([])
	const [textInput, setTextInput] = useState([])
	const [timeFrame, setTime] = useState([])

	// Bid Toggle
	const [showBids, setShowBids] = useState(true)
	const bidToggle = () => {
		setShowBids(!showBids)
	}

	// Ask Toggle
	const [showAsks, setShowAsks] = useState(true)
	const askToggle = () => {
		setShowAsks(!showAsks)
	}

	const handleClick = () => {
		axios({
			method: "GET",
			url: `${process.env.SERVER}/spreads/${props.coin}/?limit=${textInput}`,
		}).then(res => {
			let spread = res.data

			let bids = []
			let asks = []
			let time = []
			spread.forEach(s => {
				bids.push(s.bid)
				asks.push(s.ask)
				time.push(s.create_date)
			})
			setBids(bids)
			setAsks(asks)
			setTime(time)
		})
	}

	const handleChange = event => {
		setTextInput(event.target.value)
	}

	useEffect(() => {
		axios({
			method: "GET",
			url: `${process.env.SERVER}/spreads/${props.coin}?limit=1000`,
		}).then(res => {
			// setBidData()
			let spread = res.data

			let bids = []
			let asks = []
			spread.forEach(s => {
				bids.push(s.bid)
				asks.push(s.ask)
			})
			setBids(bids)
			setAsks(asks)
		})
	}, [setBids, setAsks, setTime])

	return (
		<div>
			<div className="spread-intro">
				<div className="coin-intro flex-center">
					<h1>{props.coin.toUpperCase()} 0924</h1>
				</div>
				<div className="timeframes position-calc home-calc">
					<input
						type="number"
						onChange={handleChange}
						placeholder="Choose A Timeframe"
					/>
					<div onClick={handleClick} className="render-spread">
						Render
					</div>
				</div>
			</div>
			<p className="last-time">
				<small>{moment(timeFrame[0]).format("MMMM Do YYYY, h:mm:ss a")}</small>
			</p>
			<p className="pt-20 spread-bas">
				<span
					style={showAsks ? { color: "white" } : { color: "grey" }}
					onClick={askToggle}
				>
					Buy
				</span>{" "}
				<span
					style={showBids ? { color: "red" } : { color: "grey" }}
					onClick={bidToggle}
				>
					Sell
				</span>
			</p>
			<VictoryChart
				padding={25}
				containerComponent={
					<VictoryCursorContainer
						cursorLabel={({ datum }) => `${datum.y.toPrecision(2)}`}
					/>
				}
			>
				{showBids ? (
					<VictoryLine
						data={bids}
						style={{
							data: { stroke: "red", strokeWidth: 1, strokeLinecap: "round" },
						}}
					/>
				) : null}
				{showAsks ? (
					<VictoryLine
						data={asks}
						style={{
							data: { stroke: "white", strokeWidth: 1, strokeLinecap: "round" },
						}}
					/>
				) : null}
			</VictoryChart>
			<SpreadCoins />
		</div>
	)
}
