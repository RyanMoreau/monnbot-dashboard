require("dotenv").config({
  path: `.env.${process.env.NODE_ENV}`,
})

module.exports = {
  siteMetadata: {
    title: `Nexinity`,
    description: `Nexinity Dashboard`,
    author: `@monnicore`,
  },
  plugins: [
    `gatsby-plugin-react-helmet`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src`,
      },
    },
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `Nexinity Dashboard`,
        short_name: `Nexinity`,
        start_url: `/`,
        background_color: `#EFEFEF`,
        theme_color: `#090C15`,
        display: `minimal-ui`,
        icon: `src/images/logo.png`,
      },
    },
    {
      resolve: `gatsby-plugin-google-gtag`,
      options: {
        trackingIds: [
          "G-TZWD2XZB12", // Google Analytics / GA
        ],
      },
    },
    {
      resolve: `gatsby-plugin-google-fonts`,
      options: {
        fonts: [
          `poppins`,
        ],
        display: 'swap'
      },
    }, 
      // {
      //   resolve: "gatsby-plugin-webpack-bundle-analyser-v2",
      //   options: {
      //     devMode: true,
      //   },
      // },    
    `axios`,
    `gatsby-plugin-dark-mode`,
  ],
}