import React, { useState, useEffect } from 'react'
import Path from 'path'
import axios from 'axios'

const onCreatePage = ({ page, actions }) => {

		// Define Constants
		const { createPage } = actions
		const template = Path.resolve(`src/templates/coin.js`)

			axios({
				method: 'GET',
				url: `${process.env.SERVER}/all_futures`
			}).then(res => {
			// Get Response
			const allPerps = res.data.result;
			// Match perp with future and create state
			allPerps.forEach(ap => {
				// console.log('Page Created: ' + ap.underlying)
				createPage({
					path: `${`coin/${ap.underlying}`}`,
					component: template,
					context: {
						title: ap.underlying,
					},
				})				
			});
		})
	}
	
export { onCreatePage }


/*
* During the build step, `auth0-js` will break because it relies on
* browser-specific APIs. Fortunately, we don’t need it during the build.
* Using Webpack’s null loader, we’re able to effectively ignore `auth0-js`
* during the build. (See `src/utils/auth.js` to see how we prevent this
* from breaking the app.)
*/
exports.onCreateWebpackConfig = ({ stage, loaders, actions }) => {
	if (stage === "build-html") {
	  actions.setWebpackConfig({
		module: {
		  rules: [
			{
			  test: /auth0-js/,
			  use: loaders.null(),
			},
		  ],
		},
	  })
	}
  }