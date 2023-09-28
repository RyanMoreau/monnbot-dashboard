import React from 'react'
import Layout from '../components/layout'
import SEO from '../components/seo'
import SpreadCoins from '../components/data/spreads/spreadCoins'

export default function Spreads() {
    
    return (
        <>
            <SEO title="Spreads" />
            <Layout>
                <SpreadCoins />
            </Layout>
        </>
    )
}
