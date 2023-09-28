import React from "react"

import Layout from "../components/layout"
import SEO from "../components/seo"

import CollateralChart from '../components/data/chart/collateral'

export default function ChartPage() {
  return (
    <Layout>
      <SEO title="Chart View" />
      <CollateralChart />
    </Layout>
  )
}