import React, { useState, useEffect } from 'react'
import { Link } from "gatsby"
import { Container, Row, Col } from 'react-grid-system'
import { Visible, Hidden } from 'react-grid-system';

import Nav from './nav'

export default function Header() {

    // Bid Toggle
    const [toggleMenu, setToggleMenu] = useState(false);
    const clickMenu = () => {
        setToggleMenu(!toggleMenu);
    };      

  return (
    <header>
      <Container>
        <Row>
          <Col xs={4} className="header-left">
            <h1>Dash.</h1>
          </Col>
          <Col xs={8} className="header-right">
            <Visible md lg xl xxl>
              <Nav />
            </Visible>
            <Visible xs sm>
              <svg xmlns="http://www.w3.org/2000/svg" onClick={clickMenu} class="icon icon-tabler icon-tabler-menu-2" width="44" height="44" viewBox="0 0 24 24" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round">
                <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                <line x1="4" y1="6" x2="20" y2="6" />
                <line x1="4" y1="12" x2="20" y2="12" />
                <line x1="4" y1="18" x2="20" y2="18" />
              </svg>
              <div className={`nav-sidebar ${toggleMenu ? 'active' : ''}`}>
                <span onClick={clickMenu} className="close-menu">x</span>
                <Nav />
              </div>
            </Visible>
          </Col>
        </Row>
      </Container>
    </header>
  )
}