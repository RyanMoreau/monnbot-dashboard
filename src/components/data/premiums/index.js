import React, { useState, useEffect } from "react"
import axios from "axios"
import Moment from "react-moment"
import numeral from "numeral"
import { Container } from "react-grid-system"
import Skeleton, { SkeletonTheme } from "react-loading-skeleton"
import { Table, Tbody, Thead, Th, Tr, Td } from "react-super-responsive-table"
import { collateral } from "../collateral-list"

import Slider from "react-rangeslider"
import "react-rangeslider/lib/index.css"

export default function PremiumData() {
	const [premiums, setPremiums] = useState([])
	const [loading, setLoading] = useState(false)
	const [usdPair, setUsdPair] = useState([])

	const [premium, setPremium] = useState(0)
	const handleChange = premium => {
		setPremium(premium)
	}

	useEffect(() => {
		setLoading(true)

		axios({
			method: "GET",
			url: `${process.env.SERVER}/all_futures`,
		}).then(res => {
			// Get Response, map out futures.
			const future = res.data.result

			// Get the futures
			let labels = []
			future.forEach(f => {
				if (f.type === "future") {
					labels.push(f)
				}
			})

			// Match Collateral Pairings
			let usdPair = []
			future.forEach(f => {
				collateral.forEach(c => {
					if (f.underlying === c.name) {
						usdPair.push(f.underlying)
					}
				})
			})

			setUsdPair(usdPair)
			setPremiums(labels)
			setLoading(false)
		})
	}, [setPremiums, setUsdPair])

	return (
		<Container>
			<div className="filtering-buttons">
				<div className="filter-option">
					<h6>Minimum Premium:</h6>
					<Slider value={premium} onChange={handleChange} />
				</div>
			</div>
			<Table>
				<Thead>
					<Tr>
						<Th>Coin</Th>
						<Th>Underlying</Th>
						<Th>Future</Th>
						<Th>Expiry</Th>
						<Th>Premium</Th>
						<Th>Fut Volume</Th>
						<Th>Collateral?</Th>
					</Tr>
				</Thead>
				<Tbody>
					{loading && (
						<Tr>
							<Td colSpan="8" style={{ padding: "0" }}>
								<SkeletonTheme color="transparent" highlightColor="#444">
									<Skeleton height={60} />
								</SkeletonTheme>
							</Td>
						</Tr>
					)}
					{!loading &&
						premiums.map((coin, i) => (
							<>
								{/* Check if coin is enabled, then display data */}
								{coin.enabled === true ? (
									<>
										{premium <=
										((coin.index - coin.last) / coin.index) *
											100 *
											Math.sign(
												((coin.index - coin.last) / coin.index) * 100
											) ? (
											<Tr key={i}>
												<Td>{coin.underlying}</Td>
												<Td key={i}>
													{numeral(coin.index).format("$0, $0.00")}
												</Td>
												<Td key={i}>
													{numeral(coin.last).format("$0, $0.00")}
												</Td>
												<Td key={i}>
													<Moment format="MMM Do YY, ha">{coin.expiry}</Moment>
												</Td>
												<Td key={i}>
													{JSON.stringify(
														((coin.index - coin.last) / coin.index) * 100
													).substr(0, 5)}
													%
												</Td>
												<Td key={i}>
													{numeral(coin.volumeUsd24h).format("$0, $0.00")}
												</Td>
												<Td key={i}>
													<div className="relative pairing-container">
														{/* Future bug: Multiple dots on display lol */}
														{usdPair.map(pair => (
															<span
																className={`status ${
																	pair === coin.underlying ? "pair" : "no-pair"
																}`}
															>
																&nbsp;
															</span>
														))}
													</div>
												</Td>
											</Tr>
										) : (
											""
										)}
									</>
								) : null}
							</>
						))}
				</Tbody>
			</Table>
		</Container>
	)
}
