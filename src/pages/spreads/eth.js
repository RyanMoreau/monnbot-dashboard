import React from 'react'
import SpreadChart from '../../components/data/spreads'
import SEO from '../../components/seo'
import Layout from '../../components/layout'

export default function Spreads() {
    return (
        <>
            <SEO title="eth" />
            <Layout>
                <SpreadChart 
                    coin="eth"
                />
            </Layout>
        </>
    )
}
