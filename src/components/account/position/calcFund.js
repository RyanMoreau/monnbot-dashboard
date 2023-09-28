import React, { useState, useEffect } from "react"
import axios from "axios"
import numeral from "numeral"

export default function GetBalances(props) {
	const [oneHour, setOneHour] = useState([])
	const [fourHour, setFourHour] = useState([])
	const [oneDay, setOneDay] = useState([])

	useEffect(() => {
		axios({
			method: "GET",
			url: `${
				process.env.SERVER
			}/funding_rates?future=${props.coin.toLowerCase()}-perp`,
		}).then(res => {
			// Log Sum of 4H
			var timeOne = 0
			for (var o = 0; o < 1; o++) {
				timeOne += res.data.result[o].rate
			}
			var OneHour = JSON.stringify(timeOne * 100).substr(0, 5)
			setOneHour(OneHour)

			// Log Sum of 4H
			var timeFour = 0
			for (var f = 0; f < 4; f++) {
				timeFour += res.data.result[f].rate
			}
			var fourHour = JSON.stringify(timeFour * 100).substr(0, 5)
			setFourHour(fourHour)

			// Log Sum of 1D
			var timeDay = 0
			for (var d = 0; d < 24; d++) {
				timeDay += res.data.result[d].rate
			}
			var day = JSON.stringify(timeDay * 100).substr(0, 5)
			setOneDay(day)
		})
	}, [setFourHour, setOneDay])

	const OneHPay = numeral((props.cost / 2) * (oneHour / 100)).format(
		"$0, $0.00"
	)
	const FourHPay = numeral((props.cost / 2) * (fourHour / 100)).format(
		"$0, $0.00"
	)
	const DayPay = numeral((props.cost / 2) * (oneDay / 100)).format("$0, $0.00")

	return (
		<>
			{DayPay} ({oneDay})
			<span className="tooltiptext">
				4h: {numeral(FourHPay).format("$0, $0.00")} ({fourHour}%)
				<br />
				1h: {numeral(OneHPay).format("$0, $0.00")} ({oneHour}%)
			</span>
		</>
	)
}
