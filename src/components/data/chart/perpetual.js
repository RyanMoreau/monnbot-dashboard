import React, { useState, useEffect } from "react"
import { Hidden } from "react-grid-system"
import axios from "axios"

import Toggle from "react-toggle"
import "../../../../node_modules/react-toggle/style.css"

import BarCharts from "./data"

export default function PerpsChart() {
	const [toggle, setToggle] = useState([true])
	const [allFutures, setAllFutures] = useState([])

	useEffect(() => {
		axios({
			method: "GET",
			url: `${process.env.SERVER}/all_futures`,
		}).then(res => {
			// Get Response
			const all = res.data.result

			// Get Perpetuals
			let allPerps = []
			all.forEach(p => {
				if (p.type === "perpetual") {
					allPerps.push(p)
				}
			})

			// Get Futures
			let allFutures = []
			all.forEach(f => {
				if (f.type === "future") {
					allFutures.push(f)
				}
			})

			// Match perp with future and create state
			let filter = []
			allPerps.forEach(ap => {
				allFutures.forEach(af => {
					if (ap.underlying === af.underlying) {
						filter.push(af)
					}
				})
			})
			setAllFutures(filter)
		})
	}, [setAllFutures])

	return (
		<>
			<Hidden xs sm md>
				<div className="toggle-row">
					<h6 className="mb-5">Display One Column?</h6>
					<Toggle onClick={() => setToggle(!toggle)} className="mb-5" />
				</div>
			</Hidden>
			{allFutures.map((coin, i) => (
				<div
					className={`coin funding-chart ${toggle ? "two-col-funding" : null}`}
					key={i}
				>
					<BarCharts coin={coin.underlying} />
				</div>
			))}
		</>
	)
}
