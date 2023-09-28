import React from 'react'
import { Thead, Tr, Th } from 'react-super-responsive-table'
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css'
import { Visible } from 'react-grid-system'

export default function TableHeader(props) {

    return (
        <Thead>
            <Tr>
                <Th>Coin</Th>
                <Th>Perp Volume</Th>
                <Th>{props.volumeType}</Th>
                <Th>Buy</Th>
                <Th>Sell</Th>
                <Th>SS</Th>
                <Th>1H</Th>
                <Th>4H</Th>
                <Th>1D</Th>
                <Th>Next</Th>
                {props.volumeType == 'Spot Volume' ? 
                    <Th className="lending-col">Lending</Th>
                    : null
                }                
            </Tr>
        </Thead>
    )
}