import React, { useState, useEffect } from "react"
import Layout from "../components/layout"
import SEO from "../components/seo"
import axios from "axios"
import BarCharts from "../components/data/chart/data"
import { Table } from "react-super-responsive-table"
import TableHeader from "../components/data/table/header"
import Liquidity from "../components/data/table/data"
import { Paper } from "@material-ui/core"
import Moment from "react-moment"
import { useForm } from "react-hook-form"
import numeral from "numeral"

export default function Coin(props) {
	// Make it easy on yourself
	const context = props.pathContext
	const LcTitle = context.title.toLowerCase()

	// Form Function
	const { register, handleSubmit, errors } = useForm() // A react hook is used here.
	const onSubmit = size => {
		setSize(size)
	}

	// Specific coin data
	const [allFunding, setAllFunding] = useState([])
	const [nextFunding, setNextFunding] = useState([])
	const [size, setSize] = useState([])
	const [fundingTotal, setFundingTotal] = useState([])

	useEffect(() => {
		let previousRates = `${process.env.SERVER}/funding_rates?future=${context.title}-perp`
		let nextRate = `${process.env.SERVER}/next_rate?future=${context.title}-perp`

		// Get axios requests ready.
		const previous = axios.get(previousRates)
		const next = axios.get(nextRate)

		// Axios request.
		axios
			.all([previous, next])
			.then(
				axios.spread((...res) => {
					const previous = res[0].data.result
					const next = res[1].data.result

					setAllFunding(previous)
					setNextFunding(next)

					let previousPay = []
					previous.forEach(e => {
						previousPay.push(e.rate)
					})
					setFundingTotal(previousPay)
				})
			)
			.catch(errors => {
				console.error(errors)
			})
	}, [setAllFunding, setNextFunding])

	let averageFundingCalc = fundingTotal.reduce(function (fundingTotal, b) {
		return fundingTotal + b
	}, 0)
	const averageFunding = (averageFundingCalc / 499) * 100

	return (
		<div>
			<Layout>
				<SEO title={`${LcTitle} Summary`} />
				<div className="funding-overview">
					<h2 className="pb-20 flex">{context.title}</h2>
					<Table>
						<TableHeader volumeType="Spot Volume" />
						<Liquidity
							main={`${context.title}/usd`}
							perp={`${context.title}-perp`}
						/>
					</Table>
					<div className={`${context.title.toLowerCase()}-funding quick-view`}>
						<BarCharts coin={context.title} />
					</div>
					<div className="funding-all">
						<form onSubmit={handleSubmit(onSubmit)} className="calc-size">
							<div className="form-holder">
								<label>
									<p>Estimate Payouts</p>
								</label>
								<input
									name="size"
									ref={register({ pattern: /\d+/ })}
									type="number"
									placeholder="Perp Size"
								/>
								{errors.size && "Please enter a proper size"}
								<input type="submit" />
							</div>
							{size.size > 1 ? (
								<>
									<span className="fees-calc">
										Total Fees (0.14%):{" "}
										<b>
											${JSON.stringify((size.size * 0.14) / 100).substr(0, 4)}
										</b>{" "}
									</span>
									<span className="fees-calc">
										Next (
										{JSON.stringify(nextFunding.nextFundingRate * 100).substr(
											0,
											5
										)}
										%):{" "}
										<b>
											{numeral(size.size * nextFunding.nextFundingRate).format(
												"$0, $0.00"
											)}
										</b>
									</span>
									<span className="fees-calc">
										Average ({JSON.stringify(averageFunding).substr(0, 6)}%):
										<b>
											{numeral((size.size * averageFunding) / 100).format(
												"$0, $0.00"
											)}
										</b>
									</span>
								</>
							) : null}
						</form>
						{allFunding.map((funding, i) => (
							<Paper key={i}>
								<div className="payment-wrapper">
									<div className="payment-coin flex-item">
										<p>{context.title}</p>
										<Moment format="H:mm, MM/DD" className="blue-text">
											{funding.time}
										</Moment>
									</div>
									<div className="payment-rates flex-item">
										{size.size > 1 ? (
											<p>
												${JSON.stringify(funding.rate * size.size).substr(0, 7)}
											</p>
										) : null}
										<span className="blue-text">
											{JSON.stringify(funding.rate * 100).substr(0, 7)}%
										</span>
									</div>
								</div>
							</Paper>
						))}
					</div>
				</div>
			</Layout>
		</div>
	)
}
