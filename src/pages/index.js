import React, {useState, useEffect} from 'react'
import { collateral } from '../components/data/collateral-list'
import { Table } from 'react-super-responsive-table'
import TableHeader from '../components/data/table/header'
import Liquidity from '../components/data/table/data'
import { useForm } from 'react-hook-form'
import Toggle from 'react-toggle'
import 'react-toggle/style.css'
import Slider from 'react-rangeslider'
import 'react-rangeslider/lib/index.css'

import Layout from "../components/layout"
import SEO from "../components/seo"

export default function CollateralTable() {

  // Filters
  const [ valueOH, setValueOH ] = useState(0)
  const handleChangeOH = (valueOH) => {
    setValueOH(valueOH)
  }

  const [ valueFH, setValueFH ] = useState(0)
  const handleChangeFH = (valueFH) => {
    setValueFH(valueFH)
  }

  const [ valueOD, setValueOD ] = useState(0)
  const handleChangeOD = (valueOD) => {
    setValueOD(valueOD)
  }

  const [ valueOW, setValueOW ] = useState(0)
  const handleChangeOW = (valueOW) => {
    setValueOW(valueOW)
  }

  // Size Calculator
  const [ size, setSize ] = useState(0)
  const { register, handleSubmit } = useForm();
  const onSubmit = (data) => {
    setSize(data)
  }

  // Toggle
  const[toggle, setToggle] = useState([true])

return (
    <Layout>
      <SEO title="Collateral Table" />
      <div className="filtering-buttons">
        <form onSubmit={handleSubmit(onSubmit)} className="position-calc home-calc">
          <label><p>Perpetual Size ($)</p></label>
          <div className="form-holder two-col">
            <input type="text" name="perpsize"  ref={register} placeholder="Total Perp Size" />
          </div>
          <input type="submit" value="Calculate" />
        </form>
        {/* <div className="settings-button">
          <div className="toggle-row">
            <h6>Filter:</h6>
            <Toggle onClick={() => setToggle(!toggle)} className="mb-5" />
          </div>
        </div> */}
      </div>
      <div className={`filters ${toggle == false ? 'visible' : 'hidden'}`}>
        <div className="filter-option">
          <h6>One Hour Funding:</h6>
          <Slider
            min="0"
            max="0.1"
            step="0.005"
            value={valueOH}
            onChange={handleChangeOH}
          />
        </div>
        <div className="filter-option">
          <h6>Four Hour Funding:</h6>
          <Slider
            min="0"
            max="0.5"
            step="0.01"
            value={valueFH}
            onChange={handleChangeFH}
          />
        </div>
        <div className="filter-option">
          <h6>One Day Funding:</h6>
          <Slider
            min="0"
            max="3"
            step="0.05"
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
        <TableHeader
          volumeType="Spot Volume"
        />
        {collateral.map((coin, i) => (
          // <div key={i}>{coin.name}</div>
          <Liquidity key={i}
            main={`${coin.name}/usd`}
            perp={`${coin.name}-perp`}
            size={size.perpsize}
            filterOH={valueOH}
            filterFH={valueFH}
            filterOD={valueOD}
            filterOW={valueOW}
          />
        )) }
      </Table>
    </Layout>
  )
}
