import React, { useState, useEffect } from "react"
import axios from "axios"
import { Paper } from "@material-ui/core"
import numeral from "numeral"
import { Table, Tbody, Tr, Td } from "react-super-responsive-table"
import "react-super-responsive-table/dist/SuperResponsiveTableStyle.css"

import PositionHeading from "./position/tableheader"
import CalcFunding from "./position/calcFund"

export default function Positions(props) {
	const [perpPosition, setPerpPosition] = useState([])
	const [collateralPosition, setCollateralPosition] = useState([])

	useEffect(() => {
		let collateralLink = `${process.env.SERVER}/wallet/balances?api=${
			process.env.API
		}&secret=${process.env.SECRET}${
			props.sub ? `&subaccount=${props.sub}` : ""
		}`
		let perpLink = `${process.env.SERVER}/positions?api=${
			process.env.API
		}&secret=${process.env.SECRET}${
			props.sub ? `&subaccount=${props.sub}` : ""
		}`

		// Get axios requests ready.
		const perp = axios.get(perpLink)
		const collateral = axios.get(collateralLink)

		// Axios request.
		axios
			.all([perp, collateral])
			.then(
				axios.spread((...res) => {
					setPerpPosition(res[0].data.result)
					setCollateralPosition(res[1].data.result)
				})
			)
			.catch(errors => {
				console.error(errors)
			})
	}, [setPerpPosition, setCollateralPosition])

	return (
		<>
			<Paper>
				{/* Loop collateral, find all open positions */}
				{collateralPosition.map((coin, c) => (
					<div key={c}>
						{coin.total == 0
							? null
							: // Loop perpetuals for open positions
							  perpPosition.map((hedge, f) => (
									<div key={f}>
										{hedge.size == 0 ? null : hedge.future.replace(
												"-PERP",
												""
										  ) === coin.coin ? (
											<div className="position">
												<Table key={f} className="position-view">
													<PositionHeading />
													<Tbody>
														<Tr>
															<Td className="tooltip">
																<span className={hedge.side}>
																	{hedge.future.replace("-PERP", "")}
																</span>
																<span className="tooltiptext">
																	{`${
																		hedge.side === "buy" ? "long" : "short"
																	} spread.`}
																</span>
															</Td>
															<Td className="tooltip">
																{JSON.stringify(hedge.size + coin.total).substr(
																	0,
																	4
																)}
																<span className="tooltiptext">
																	Perp:{" "}
																	{JSON.stringify(hedge.size).substr(0, 4)}{" "}
																	<br />
																	Spot:{" "}
																	{JSON.stringify(coin.total).substr(0, 4)}{" "}
																	<br />
																	Cost:{" "}
																	{hedge.side === "buy"
																		? numeral(
																				hedge.cost + coin.usdValue
																		  ).format("$0, $0.00")
																		: numeral(
																				hedge.cost - coin.usdValue
																		  ).format("$0, $0.00")}
																</span>
															</Td>
															<Td className="toolip">
																{props.sub ? props.sub : "Main Account"}
															</Td>
															<Td className="tooltip">
																$30
																<span className="tooltiptext">
																	Open:
																	<br />
																	Current:
																</span>
															</Td>
															<Td className="tooltip">
																<CalcFunding
																	coin={hedge.future.replace("-PERP", "")}
																	cost={hedge.cost}
																/>
															</Td>
														</Tr>
													</Tbody>
												</Table>
											</div>
										) : null}
									</div>
							  ))}
					</div>
				))}
			</Paper>
		</>
	)
}
