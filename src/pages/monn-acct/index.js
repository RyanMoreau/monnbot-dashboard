import React from "react"
import Layout from "../../components/layout"
import SEO from "../../components/seo"
import AccountDetails from '../../components/account/index'

export default function Account() {
    
  return (
    <Layout>
      <SEO title="Account" />
        <AccountDetails />
    </Layout>
  )
}