import React, { useState, useEffect } from "react"
import { Link } from "gatsby"

import { Tr, Td } from "react-super-responsive-table"
import axios from "axios"
import Skeleton, { SkeletonTheme } from "react-loading-skeleton"

export default function Spreads(props) {
	const [FHbids, setFHbids] = useState([])
	const [FHasks, setFHasks] = useState([])

	const [ODbids, setODbids] = useState([])
	const [ODasks, setODasks] = useState([])

	const [loading, setLoading] = useState(false)

	useEffect(() => {
		setLoading(true)

		axios
			.get(`${process.env.SERVER}/spreads/${props.name}?limit=86400`)
			.then(result => {
				let res = result.data
				// Map response into bids/asks
				let bids = []
				let asks = []
				res.forEach(e => {
					bids.push(e.bid)
					asks.push(e.ask)
				})
				setFHbids(bids.slice(0, 720))
				setFHasks(asks.slice(0, 720))

				setODbids(bids)
				setODasks(asks)

				setLoading(false)
			})
			.catch(err => {
				console.log(err)
			})
	}, [setFHbids, setFHasks, setODbids, setODasks])

	return (
		<>
			{loading && (
				<Tr>
					<Td colSpan="3" style={{ padding: "0" }}>
						<SkeletonTheme color="transparent" highlightColor="#444">
							<Skeleton height={60} />
						</SkeletonTheme>
					</Td>
				</Tr>
			)}
			{!loading && (
				<Tr>
					<Td>
						<Link to={`/spreads/${props.name}`}>
							<span>{props.name.toUpperCase()}0924</span>
						</Link>
					</Td>
					<Td>
						Sell: {JSON.stringify(Math.max(...FHbids)).slice(0, 7)}
						<br />
						Buy: {JSON.stringify(Math.min(...FHasks)).slice(0, 7)}
					</Td>
					<Td>
						Sell: {JSON.stringify(Math.max(...ODbids)).slice(0, 7)}
						<br />
						Buy: {JSON.stringify(Math.min(...ODasks)).slice(0, 7)}
					</Td>
					{/* <Td>
                    Sell: {JSON.stringify(Math.max(...TDbids)).slice(0,7)}<br/>
                    Buy: {JSON.stringify(Math.min(...TDasks)).slice(0,7)}
                </Td> */}
				</Tr>
			)}
		</>
	)
}
