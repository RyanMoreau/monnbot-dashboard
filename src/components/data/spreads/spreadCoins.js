import React from 'react'
import { Link } from 'gatsby'

import oneInch from './oneinch.svg'

export default function SpreadTable() {

    const spreadList = ['1inch', 'aave', 'btc', 'doge', 'eth', 'grt', 'link', 'sol', 'sushi', 'uni']

    return (
        <div className="spreads">
            {spreadList.map((coin, i) => (
                <Link key={i} to={`/spreads/${coin}`} className="coin-spread">
                    {coin !== '1inch' ? <img src={`https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@07fd63a0b662ed99c8ad870ee9227b8ef5e11630/128/color/${coin}.png`} /> : <img src={oneInch} />}
                    <h4>{coin}</h4>
                </Link>
            ))}
        </div>
    )
}