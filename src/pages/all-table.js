import React, { useState, useEffect } from "react"
import { collateral } from "../components/data/collateral-list"
import { Table } from "react-super-responsive-table"
import TableHeader from "../components/data/table/header"
import Liquidity from "../components/data/table/data"
import { useForm } from "react-hook-form"
import axios from "axios"
import Toggle from "react-toggle"
import "react-toggle/style.css"
import Slider from "react-rangeslider"
import "react-rangeslider/lib/index.css"

import Layout from "../components/layout"
import SEO from "../components/seo"

export default function PerpetualTable() {
	const [size, setSize] = useState(0)
	const { register, handleSubmit } = useForm()
	const onSubmit = data => {
		setSize(data)
	}

	const [allFutures, setAllFutures] = useState([])

	// Filters
	const [valueOH, setValueOH] = useState(0)
	const handleChangeOH = valueOH => {
		setValueOH(valueOH)
	}

	const [valueFH, setValueFH] = useState(0)
	const handleChangeFH = valueFH => {
		setValueFH(valueFH)
	}

	const [valueOD, setValueOD] = useState(0)
	const handleChangeOD = valueOD => {
		setValueOD(valueOD)
	}

	const [valueOW, setValueOW] = useState(0)
	const handleChangeOW = valueOW => {
		setValueOW(valueOW)
	}

	// Toggle
	const [toggle, setToggle] = useState([true])

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
		<Layout>
			<SEO title="Perpetual Table" />
			<div className="filtering-buttons">
				<form
					onSubmit={handleSubmit(onSubmit)}
					className="position-calc home-calc"
				>
					<label>
						<p>Perpetual Size ($)</p>
					</label>
					<div className="form-holder two-col">
						<input
							type="text"
							name="perpsize"
							ref={register}
							placeholder="Total Perp Size"
						/>
					</div>
					<input type="submit" value="Calculate" />
				</form>
				{/* <div className="settings-button">
          <div className="toggle-row">
            <Toggle onClick={() => setToggle(!toggle)} className="mb-5" />
          </div>
        </div> */}
			</div>
			<div className={`filters ${toggle == false ? "visible" : "hidden"}`}>
				<div className="filter-option">
					<h6>One Hour Funding:</h6>
					<Slider
						min="0"
						max="0.1"
						step="0.001"
						value={valueOH}
						onChange={handleChangeOH}
					/>
				</div>
				<div className="filter-option">
					<h6>Four Hour Funding:</h6>
					<Slider
						min="0"
						max="0.5"
						step="0.005"
						value={valueFH}
						onChange={handleChangeFH}
					/>
				</div>
				<div className="filter-option">
					<h6>One Day Funding:</h6>
					<Slider
						min="0"
						max="3"
						step="0.01"
						value={valueOD}
						onChange={handleChangeOD}
					/>
				</div>
				<div className="filter-option">
					<h6>One Week Funding:</h6>
					<Slider
						min="0"
						max="5"
						step="0.1"
						value={valueOW}
						onChange={handleChangeOW}
					/>
				</div>
			</div>
			<Table>
				<TableHeader volumeType="Fut Volume" />
				{allFutures.map((coin, i) => (
					<Liquidity
						key={i}
						main={`${coin.name}`}
						perp={`${coin.underlying}-perp`}
						size={size.perpsize}
						isFut="true"
					/>
				))}
			</Table>
		</Layout>
	)
}
