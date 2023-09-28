import React from 'react'
import { Link } from 'gatsby'
import Toggle from './toggle'
import '../../node_modules/react-dropdown/style.css'
import emoji from "node-emoji"
import Drawer from 'react-simple-drawer'
import 'react-simple-drawer/dist/index.css'
import Calculator from './data/calculator/index'

export default function Nav() {

    return (
        <nav className="main-navigation navigation">
            <ul>
                <li className="dropdown-container"><Link to="/" activeClassName="active">PU Table</Link>
                    <ul className="nav-dropdown">
                            <li><Link to="/all-table">PF Table</Link></li>
                    </ul>
                </li>                
                <li className="dropdown-container"><Link to="/chart" activeClassName="active">PU Chart</Link>
                <ul className="nav-dropdown">
                        <li><Link to="/all-chart">PF Chart</Link></li>
                    </ul>
                </li>
                <li className="dropdown-container"><Link to="/premiums" activeClassName="active">Premiums</Link></li>
                <li><Link to="/spreads" activeClassName="active">Spreads</Link></li>
                <li><Toggle /></li>
                {/*<li><Link to="/account" activeClassName="active">Account</Link></li>*/}
                {/* <li><a href="https://help.ftx.com/hc/en-us/sections/360008738732-Futures" target="_blank">Docs</a></li> */}
                {/* <li><Drawer             <=== Calculator
                    cta={ <>{emoji.get('hamburger')}</> }
                    maskable={true}
                    placement='left'
                    open={false}
                >
                    <Calculator />
                </Drawer>
                </li> */}
            </ul>
        </nav>
    )
}
