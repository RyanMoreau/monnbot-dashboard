import React, { useState, useEffect } from "react"
import { Link } from "gatsby"
import axios from "axios"
import numeral from "numeral"
import { useForm } from "react-hook-form"
import { collateral } from "../collateral-list"
import { CopyToClipboard } from "react-copy-to-clipboard"
import emoji from "node-emoji"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

export default function Calculator() {
	const [coin, setCoin] = useState([])
	const [price, setPrice] = useState([])
	const [increment, setIncrement] = useState([])
	const [orders, setOrders] = useState([])
	const [size, setSize] = useState([])
	const [four, setFourHour] = useState([])
	const [day, setDay] = useState([])
	const [week, setWeek] = useState([])
	const [spreadDirection, setSpreadDirection] = useState([])
	const [openSpread, setOpenSpread] = useState([])
	const [closeSpread, setCloseSpread] = useState([])
	const { register, handleSubmit, errors } = useForm()

	const onSubmit = data => {
		// Stash inputs on submit
		setCoin(data.coin)
		setSize(data.size)
		setOpenSpread(data.spreadOpen)
		setCloseSpread(data.spreadClose)
		setSpreadDirection(data.direction)
		// Define Routes
		let funding = `${process.env.SERVER}/funding_rates?future=${data.coin}-perp`
		let market = `${process.env.SERVER}/markets?market_name=${data.coin}-perp`

		// Get axios requests ready.
		const requestFunding = axios.get(funding)
		const requestMarket = axios.get(market)

		// Create data from input
		axios
			.all([requestFunding, requestMarket])
			.then(
				axios.spread((...res) => {
					// Get Market Data
					const price = res[1].data.result.price
					const increment = res[1].data.result.sizeIncrement
					setPrice(price)
					setIncrement(increment)

					// Calculate order size
					// Size / Price / increment
					let qty = data.size / price
					setOrders(qty / increment)
					// Get Funding Display
					var timeFour = 0
					for (var f = 0; f < 4; f++) {
						timeFour += res[0].data.result[f].rate
					}
					var fourHour = JSON.stringify(timeFour * 100).substr(0, 5)
					setFourHour(fourHour)

					var timeDay = 0
					for (var d = 0; d < 24; d++) {
						timeDay += res[0].data.result[d].rate
					}
					var Day = JSON.stringify(timeDay * 100).substr(0, 5)
					setDay(Day)

					var timeWeek = 0
					for (var w = 0; w < 168; w++) {
						timeWeek += res[0].data.result[w].rate
					}
					var Week = JSON.stringify(timeWeek * 100).substr(0, 5)
					setWeek(Week)
				})
			)
			.catch(errors => {
				console.error(errors)
			})
	}

	// Toast
	const notify = () =>
		toast("Added To Clipboard ✔", {
			autoClose: 2000,
		})

	return (
		<div className="calculator-wrapper">
			<h2>Calculate Position</h2>
			<form onSubmit={handleSubmit(onSubmit)} className="position-calc">
				<div className="form-holder two-col">
					<label>
						<p>Select Coin</p>
					</label>
					<input
						type="text"
						list="coins"
						name="coin"
						ref={register}
						placeholder="Choose Asset"
					/>
					<datalist id="coins">
						{collateral.map((coin, i) => (
							<option key={i}>{coin.name.toLowerCase()}</option>
						))}
					</datalist>
				</div>
				<div className="form-holder two-col">
					<label>
						<p>Total Size ($)</p>
					</label>
					<input
						name="size"
						ref={register}
						type="number"
						placeholder="Include Leverage"
					/>
				</div>
				<div className="form-holder three-col">
					<label>
						<p>Direction</p>
					</label>
					<input
						type="text"
						list="direction"
						name="direction"
						ref={register}
						placeholder="Choose Side"
					/>
					<datalist id="direction">
						<option>Short</option>
						<option>Long</option>
					</datalist>
				</div>
				<div className="form-holder three-col">
					<label>
						<p>Entry</p>
					</label>
					<input
						name="spreadOpen"
						ref={register}
						type="number"
						step="0.01"
						placeholder="0.3"
					/>
				</div>
				<div className="form-holder three-col">
					<label>
						<p>Exit</p>
					</label>
					<input
						name="spreadClose"
						ref={register}
						type="number"
						step="0.01"
						placeholder="0"
					/>
				</div>
				<div className="form-holder form-submit">
					<input type="submit" />
				</div>
			</form>
			{coin != "" ? (
				<div className="position-details">
					<p className="coin-header">
						{coin} - Price: {numeral(price).format("$0, $0.00")}
						<CopyToClipboard
							text={`${spreadDirection}pu ${coin} ${JSON.stringify(
								size / price / 2
							).substr(0, 6)} ${Math.floor(orders / 2)} ${
								Math.sign(openSpread) === 1 ? "" : 0
							}${openSpread}`}
						>
							<span onClick={notify}>{emoji.get("clipboard")}</span>
						</CopyToClipboard>
					</p>
					<div className="coin-body">
						<p>Size: {JSON.stringify(size / price / 2).substr(0, 6)}</p>
						<p className="tooltip">Orders: {Math.floor(orders / 2)}</p>
						{spreadDirection === "long" ||
						spreadDirection === "Long" ||
						spreadDirection === "short" ||
						spreadDirection === "Short" ? (
							<p>
								Spread Profit:{" "}
								{spreadDirection === "long" || spreadDirection === "Long"
									? numeral(
											(size *
												(parseFloat(closeSpread) - parseFloat(openSpread))) /
												100
									  ).format("$0, $0.00")
									: numeral(
											(size *
												-(parseFloat(closeSpread) - parseFloat(openSpread))) /
												100
									  ).format("$0, $0.00")}
							</p>
						) : (
							<p className="error-text">Direction Incorrect.</p>
						)}
						{coin ? (
							<p>
								<Link className="blue-text" to={`/coin/${coin}`}>
									View more {coin} details
								</Link>
							</p>
						) : null}
						<span className="blue-text">
							The math:
							<br /> size ({size}) /<br /> price (
							{numeral(price).format("$0, $0.00")}) /<br /> 2 (split perp and
							spot) /<br /> increment ({increment}).
						</span>
						<div>
							<br />
							<span>(direction)pu (coin) (size) (orders) (minspread)</span>
						</div>
					</div>
				</div>
			) : null}
			<ToastContainer />
		</div>
	)
}
