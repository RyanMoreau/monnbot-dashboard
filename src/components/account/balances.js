import React, { useState, useEffect } from "react"
import axios from "axios"
import numeral from "numeral"
import { Paper, Grid } from "@material-ui/core"

export default function GetBalances(props) {
	const [accountDetails, setAccountDetails] = useState([])
	useEffect(() => {
		axios({
			method: "GET",
			url: `${process.env.SERVER}/account?api=${process.env.API}&secret=${
				process.env.SECRET
			}${props.sub ? `&subaccount=${props.sub}` : ""}`,
		}).then(res => {
			setAccountDetails(res.data.result)
		})
	}, [setAccountDetails])

	return (
		<Grid items container>
			<Paper>
				<h5>Main Account</h5>
				<h6 className="blue-text">
					{numeral(accountDetails.totalAccountValue).format("$0,0.00")}
				</h6>
				{accountDetails.marginFraction ? (
					<span className="text-center text-white tooltip">
						MF: {JSON.stringify(accountDetails.marginFraction).substr(0, 5)},
						MM: {accountDetails.maintenanceMarginRequirement}
						<span className="tooltiptext">
							<a
								href="https://help.ftx.com/hc/en-us/articles/360027668712-Liquidations"
								target="_blank"
							>
								MF has to be higher than MM.
							</a>
						</span>
					</span>
				) : null}
			</Paper>
		</Grid>
	)
}
