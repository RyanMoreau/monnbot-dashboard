import React from 'react'
import SpreadChart from '../../components/data/spreads'
import SEO from '../../components/seo'
import Layout from '../../components/layout'

export default function Spreads() {
    return (
        <>
            <SEO title="sushi" />
            <Layout>
                <SpreadChart 
                    coin="sushi"
                />
            </Layout>
        </>
    )
}
