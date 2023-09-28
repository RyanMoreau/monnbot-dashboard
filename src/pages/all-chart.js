import React from "react"
import Layout from "../components/layout"
import SEO from "../components/seo"
import PerpsChart from "../components/data/chart/perpetual"

export default function PerpChart() {
  return (
    <Layout>
      <SEO title="Perpetuals Chart" />
      <PerpsChart />
    </Layout>
  )
}