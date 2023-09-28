import React from 'react'
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table';

export default function SpreadHead() {
    return (
        <Thead>
            <Tr>
                <Th>Spread</Th>
                <Th>4H Range</Th>
                <Th>1D Range</Th>
                {/* <Th>3D Range</Th> */}
                {/* <Th>Volume</Th> */}
            </Tr>
        </Thead>
    )
}
