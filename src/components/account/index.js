import React, { useState, useEffect } from "react"
import axios from "axios"
import { Container } from "@material-ui/core"
import { Tab, Tabs, TabList, TabPanel } from "react-tabs"

import GetBalances from "./balances"
import Payments from "./payments"
import Positions from "./positions"

export default function AccountDetails() {
	const [mainaccount, setMainaccount] = useState([])
	const [subaccounts, setSubaccounts] = useState([])

	useEffect(() => {
		// Define URL for sub and main
		let mainAcct = `${process.env.SERVER}/account?api=${process.env.API}&secret=${process.env.SECRET}`
		let subAcct = `${process.env.SERVER}/subaccounts?api=${process.env.API}&secret=${process.env.SECRET}`
		// console.log(mainAcct)

		// Get axios requests ready.
		const requestMain = axios.get(mainAcct)
		const requestSub = axios.get(subAcct)

		// Request account information
		axios
			.all([requestMain, requestSub])
			.then(
				axios.spread((...res) => {
					setMainaccount(res[0].data.result)
					setSubaccounts(res[1].data.result)
				})
			)
			.catch(errors => {
				console.error(errors)
			})
	}, [setMainaccount, setSubaccounts])

	return (
		<Container>
			<Tabs>
				<TabList>
					<Tab selectedTabClassName="active-account">
						<GetBalances />
					</Tab>
					{subaccounts.map((account, i) => (
						<Tab selectedTabClassName="active-account" key={i}>
							<GetBalances sub={account.nickname} title={account.nickname} />
						</Tab>
					))}
				</TabList>
				<Positions />
				{subaccounts.map((account, i) => (
					<Positions key={i} sub={account.nickname} />
				))}
				<TabPanel>
					<Payments />
				</TabPanel>
				{subaccounts.map((account, i) => (
					<TabPanel key={i}>
						<Payments sub={account.nickname} />
					</TabPanel>
				))}
				<p className="text-right">
					<small>* Note: Negative values indicate you were paid.</small>
				</p>
			</Tabs>
		</Container>
	)
}
