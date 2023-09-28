import React from "react"
import PropTypes from "prop-types"
import { useStaticQuery, graphql } from "gatsby"
import ScrollToTop from "react-scroll-to-top";

import { Container, Row, Col } from 'react-grid-system'
import Header from './header'
import emoji from "node-emoji"
import "./layout.css"

const Layout = ({ children }) => {

  return (
  <>
    <Header />
    <Container>
      <main>{children}</main>        
    </Container>
    <footer>
      <Container>
        <Row>
          <Col sm={12}>
            <p>Built with {emoji.get('muscle')} in {emoji.get('maple_leaf')}.</p>
          </Col>
        </Row>
      </Container>
    </footer>
    <div className="scroll-index">
      <ScrollToTop 
        smooth 
        color="#000"
        top="500"
      />
    </div>
  </>
  )
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
}

export default Layout