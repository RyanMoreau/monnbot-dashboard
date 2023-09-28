import React, { useState, useEffect } from "react"
import axios from "axios"
import { Paper } from "@material-ui/core"
import numeral from "numeral"
import emoji from "node-emoji"
import Moment from "react-moment"
import { Tab, Tabs, TabList, TabPanel } from "react-tabs"

export default function FundingPayments(props) {
	const [funding, setFunding] = useState([])
	const [totalPay, setTotalPay] = useState([])
	const [borrow, setBorrow] = useState([])
	const [totalBorrow, setTotalBorrow] = useState([])
	const [totalFunding, setTotalFunding] = useState([])

	useEffect(() => {
		let fundingLink = `${process.env.SERVER}/funding_payments?api=${
			process.env.API
		}&secret=${process.env.SECRET}${
			props.sub ? `&subaccount=${props.sub}` : ""
		}`
		let borrowLink = `${process.env.SERVER}/borrows?api=${
			process.env.API
		}&secret=${process.env.SECRET}${
			props.sub ? `&subaccount=${props.sub}` : ""
		}`

		// Get axios requests ready.
		const fundingPayments = axios.get(fundingLink)
		const borrowPayments = axios.get(borrowLink)

		// Axios request.
		axios
			.all([fundingPayments, borrowPayments])
			.then(
				axios.spread((...res) => {
					const funding = res[0].data.result
					const borrows = res[1].data.result

					let payments = []
					funding.forEach(e => {
						payments.push(e.payment)
					})
					setFunding(funding)

					let borrowPayments = []
					borrows.forEach(b => {
						borrowPayments.push(b.cost)
					})
					setBorrow(borrows)

					let totalFunding = payments.reduce(function (payments, b) {
						return payments + b
					}, 0)
					let totalBorrow = borrowPayments.reduce(function (borrowPayments, c) {
						return borrowPayments + c
					}, 0)

					setTotalFunding(totalFunding)
					setTotalBorrow(totalBorrow)
					setTotalPay(numeral(totalFunding + totalBorrow).format("$0,0.00"))
				})
			)
			.catch(errors => {
				console.error(errors)
			})
	}, [setFunding, setTotalPay, setBorrow])

	return (
		<div className="funding-view">
			<Tabs>
				<TabList>
					<Tab>Funding Payments</Tab>
					<Tab>Borrow Costs</Tab>
				</TabList>
				<TabPanel>
					<div className="account-totals">
						{totalPay > numeral(1).format("$0,0.00") ? (
							<div className="totals-view">
								<p>
									Total:{" "}
									<span className="blue-text">
										<small>{totalPay}</small>
									</span>
								</p>
								<p>Funding: {numeral(totalFunding).format("$0, $0.00")}</p>
							</div>
						) : (
							<p>
								There's nothing here. <br />
								Go get it {emoji.get("money_with_wings")}
							</p>
						)}
					</div>
					{funding.map((payment, i) => (
						<Paper key={i} className="tooltip">
							<div className="payment-wrapper">
								<div className="payment-coin flex-item">
									<p>{payment.future.replace("-PERP", "")}</p>
									<Moment format="H:mm, MM/DD" className="blue-text">
										{payment.time}
									</Moment>
								</div>
								<div className="payment-rates flex-item">
									<p>${JSON.stringify(payment.payment).substr(0, 7)}</p>
									<span className="blue-text">
										{JSON.stringify(payment.rate * 100).substr(0, 5)}%
									</span>
								</div>
							</div>
						</Paper>
					))}
				</TabPanel>
				<TabPanel>
					{totalPay > numeral(1).format("$0,0.00") ? (
						<div className="totals-view">
							<p>
								Total:{" "}
								<span className="blue-text">
									<small>{totalPay}</small>
								</span>
							</p>
							<p>Borrow: {numeral(totalBorrow).format("$0, $0.00")}</p>
						</div>
					) : (
						<p>
							There's nothing here. <br />
							Go get it {emoji.get("money_with_wings")}
						</p>
					)}
					{borrow.map((borrow, i) => (
						<Paper key={i} className="tooltip">
							<div className="payment-wrapper">
								<div className="payment-coin flex-item">
									<p>{borrow.coin}</p>
									<Moment format="H:mm, MM/DD" className="blue-text">
										{borrow.time}
									</Moment>
								</div>
								<div className="payment-rates flex-item">
									<p>${JSON.stringify(borrow.cost).substr(0, 7)}</p>
									<span className="blue-text">
										{JSON.stringify(borrow.rate).substr(0, 7)}%
									</span>
								</div>
							</div>
						</Paper>
					))}
				</TabPanel>
			</Tabs>
		</div>
	)
}
