import React from 'react'
import { Thead, Tr, Th } from 'react-super-responsive-table';

export default function PositionHeading() {

    return (
    <Thead>
        <Tr>
            <Th>Position</Th>
            <Th>Size</Th>
            <Th>Account</Th>
            <Th>Spread</Th>
            <Th>Projected Funding</Th>
        </Tr>
    </Thead>
    )
}