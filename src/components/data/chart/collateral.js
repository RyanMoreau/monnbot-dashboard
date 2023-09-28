import React, { useState } from 'react'
import { collateral } from '../collateral-list'
import { Hidden } from 'react-grid-system';

import Toggle from 'react-toggle'
import '../../../../node_modules/react-toggle/style.css'

import BarCharts from './data'

export default function CollateralChart() {    

    const[toggle, setToggle] = useState([true])

      return (
        <>
            <Hidden xs sm md>
                <div className="toggle-row">
                    <h6 className="mb-5">Display One Column?</h6>
                    <Toggle onClick={() => setToggle(!toggle)} className="mb-5" />
                </div>
            </Hidden>
            {collateral.map((coin, i) => (
                <div className={`coin funding-chart ${toggle ? "two-col-funding" : null}`} key={i}>
                    <BarCharts
                        coin={coin.name}
                    />
                </div>
            ))}
        </>
    )
}