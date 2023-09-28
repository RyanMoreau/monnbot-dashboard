import React from "react"
import Layout from "../components/layout"
import SEO from "../components/seo"
import Premium from '../components/data/premiums/index'

export default function Premiums() {
  return (
    <Layout>
      <SEO title="Premiums" />
      <Premium />
    </Layout>
  )
}