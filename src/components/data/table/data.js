import React, { useState, useEffect } from "react"
import { Link } from "gatsby"
import axios from "axios"
import numeral from "numeral"
import Skeleton, { SkeletonTheme } from "react-loading-skeleton"
import { Tr, Td, Tbody } from "react-super-responsive-table"
import { Visible } from "react-grid-system"

export default function Liquidity(props) {
	const [base, setBase] = useState([])
	// Volume
	const [perpVolume, setPerpVolume] = useState([])
	const [coinVolume, setCoinVolume] = useState([])
	// Spread
	const [buySpread, setBuySpread] = useState([])
	const [sellSpread, setSellSpread] = useState([])
	// Funding
	const [oneHour, setOneHour] = useState([])
	const [fourHour, setFourHour] = useState([])
	const [oneDay, setOneDay] = useState([])
	const [next, setNext] = useState([])
	// Lending Rates
	const [prevLend, setPrevLend] = useState([])
	const [nextLend, setNextLend] = useState([])

	// Loading animation
	const [loading, setLoading] = useState(false)

	useEffect(() => {
		setLoading(true)

		let coin = `${process.env.SERVER}/markets?market_name=${props.main}`
		let perp = `${process.env.SERVER}/markets?market_name=${props.perp}`
		let funding = `${process.env.SERVER}/funding_rates?future=${props.perp}`
		let next = `${process.env.SERVER}/next_rate?future=${props.perp}`
		let lending = `${process.env.SERVER}/lending`

		// Get axios requests ready.
		const requestPerp = axios.get(perp)
		const requestCoin = axios.get(coin)
		const requestFunding = axios.get(funding)
		const requestnext = axios.get(next)
		const requestLending = axios.get(lending)

		// Axios request.
		axios
			.all([
				requestPerp,
				requestCoin,
				requestFunding,
				requestnext,
				requestLending,
			])
			.then(
				axios.spread((...res) => {
					// Lending Rates
					const lendingCoin = res[4].data.result
					const baseCoin = props.main.replace("/usd", "")

					lendingCoin.forEach(e => {
						if (e.coin === baseCoin) {
							setNextLend(e.estimate)
							setPrevLend(e.previous)
						}
					})

					setNext(
						JSON.stringify(res[3].data.result.nextFundingRate * 100).substr(
							0,
							6
						)
					)

					{
						/* Set future & perp volume. 
            -----*/
					}
					{
						props.isFut
							? setBase(res[1].data.result.underlying)
							: setBase(res[1].data.result.baseCurrency)
					}
					setPerpVolume(
						numeral(res[0].data.result.volumeUsd24h).format("$0,0.00")
					)
					setCoinVolume(
						numeral(res[1].data.result.volumeUsd24h).format("$0,0.00")
					)

					{
						/* Calculate spread. 
            -----*/
					}
					let perpBid = res[0].data.result.bid
					let perpAsk = res[0].data.result.ask
					let coinBid = res[1].data.result.bid
					let coinAsk = res[1].data.result.ask
					// Convert to string, make numbers legible
					const sliceSellSpread = JSON.stringify(
						((perpBid - coinAsk) / perpBid) * 100
					).substr(0, 5)
					const sliceBuySpread = JSON.stringify(
						((perpAsk - coinBid) / perpAsk) * 100
					).substr(0, 5)
					// Convert back to numbers
					setSellSpread(numeral(sliceSellSpread).value())
					setBuySpread(numeral(sliceBuySpread).value())

					{
						/* Capture Funding 
            -----*/
					}
					// Log Sum of 1H
					var timeOne = 0
					for (var o = 0; o < 1; o++) {
						timeOne += res[2].data.result[o].rate
					}
					var oneHour = JSON.stringify(timeOne * 100).substr(0, 6)
					setOneHour(numeral(oneHour).value())

					// Log Sum of 4H
					var timeFour = 0
					for (var f = 0; f < 4; f++) {
						timeFour += res[2].data.result[f].rate
					}
					var fourHour = JSON.stringify(timeFour * 100).substr(0, 6)
					setFourHour(numeral(fourHour).value())

					// Log Sum of 1D
					var timeDay = 0
					for (var d = 0; d < 24; d++) {
						timeDay += res[2].data.result[d].rate
					}
					var oneDay = JSON.stringify(timeDay * 100).substr(0, 6)
					setOneDay(numeral(oneDay).value())

					{
						/* Loading Toggle 
            -----*/
					}
					setLoading(false)
				})
			)
			.catch(errors => {
				// Log any errors
				console.error(errors)
			})
	}, [
		setBase,
		setPerpVolume,
		setCoinVolume,
		setBuySpread,
		setSellSpread,
		setOneHour,
		setFourHour,
		setOneDay,
		setNext,
		setNextLend,
		setPrevLend,
	])

	return (
		<Tbody>
			{loading && (
				<Tr>
					<Td colSpan="10" style={{ padding: "0" }}>
						<SkeletonTheme color="transparent" highlightColor="#444">
							<Skeleton height={60} />
						</SkeletonTheme>
					</Td>
				</Tr>
			)}
			{!loading && (
				<Tr id={base}>
					<Td>
						<Link to={`/coin/${base}`}>
							<span>{base}</span>
						</Link>
					</Td>
					<Td>{perpVolume}</Td>
					<Td className="tooltip">
						{coinVolume}
						{prevLend <= 0 ? null : (
							<span className="tooltiptext fulltip lendingtip">
								prev: {JSON.stringify(prevLend * 100).substr(0, 6)}
								<br />
								next: {JSON.stringify(nextLend * 100).substr(0, 6)}
							</span>
						)}
					</Td>
					<Td className={Math.sign(buySpread) > 0 ? null : "negative-text"}>
						{buySpread}
					</Td>
					<Td className={Math.sign(sellSpread) > 0 ? null : "negative-text"}>
						{sellSpread}
					</Td>
					<Td className="tooltip">
						{JSON.stringify(buySpread - sellSpread).substr(0, 4)}
						<span className="tooltiptext fulltip">
							{JSON.stringify(((buySpread - sellSpread) / fourHour) * 4).substr(
								0,
								2
							)}
						</span>
					</Td>
					<Td
						className={`tooltip ${
							Math.sign(fourHour) > 0 ? null : "negative-text"
						}`}
					>
						{props.size > 1
							? numeral(props.size * (oneHour / 100)).format("$0, $0.00")
							: oneHour}
						{props.size > 1 ? (
							<span className="tooltiptext fulltip">{oneHour}</span>
						) : null}
					</Td>
					<Td
						className={`tooltip ${
							Math.sign(fourHour) > 0 ? null : "negative-text"
						}`}
					>
						{props.size > 1
							? numeral(props.size * (fourHour / 100)).format("$0, $0.00")
							: fourHour}
						{props.size > 1 ? (
							<span className="tooltiptext fulltip">{fourHour}</span>
						) : null}
					</Td>
					<Td
						className={`tooltip ${
							Math.sign(oneDay) > 0 ? null : "negative-text"
						}`}
					>
						{props.size > 1
							? numeral(props.size * (oneDay / 100)).format("$0, $0.00")
							: oneDay}
						{props.size > 1 ? (
							<span className="tooltiptext fulltip">{oneDay}</span>
						) : null}
					</Td>
					<Td
						className={`tooltip ${
							Math.sign(next * 100) > 0 ? null : "negative-text"
						}`}
					>
						{props.size > 1
							? numeral(props.size * (next / 100)).format("$0, $0.00")
							: next}
						{props.size > 1 ? (
							<span className="tooltiptext fulltip">{next}</span>
						) : null}
					</Td>
					{prevLend <= 0 ? null : (
						<Td className="lending-col">
							prev: {JSON.stringify(prevLend * 100).substr(0, 6)}
							<br />
							next: {JSON.stringify(nextLend * 100).substr(0, 6)}
						</Td>
					)}
				</Tr>
			)}
		</Tbody>
	)
}
