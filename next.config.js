/**
 * next.config.js
 * Next JS configuration file
 * The following helps to use multiple plugins
 * @see https://github.com/JerryCauser/next-compose
 */
/**
* Web Workers
* @see https://github.com/zeit/next-plugins/tree/master/packages/next-workers
* Use SASS styles
* @see https://github.com/zeit/next-plugins/tree/master/packages/next-sass
* Using Fonts
* @see https://github.com/rohanray/next-fonts
* Environment variables
* @see https://stackoverflow.com/questions/50416138/nextjs-set-dynamic-environment-variables-at-the-start-of-the-application
*/

/**
 * Exclude tests and stories from being compiled.
 * @see https://github.com/zeit/next.js/issues/1914
 * via
 * excludeFile: ... (see below)
 */
const withPlugins = require('next-compose-plugins')
const withImages = require('next-images')
const withFonts = require('next-fonts')
const optimizedImages = require('next-optimized-images')
const withSass = require('@zeit/next-sass')
const withCSS = require('@zeit/next-css')
// const withWorkers = require('@zeit/next-workers')
const path = require('path')

console.log('NextJs Config Environment:', process.env.NODE_ENV)

// const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http'
// const port = process.env.NODE_ENV === 'production' ? 8081 : 3000
// console.log('Client API is running on port', port, 'and protocol', protocol)

const nextConfig = {
  distDir: '_next',
  // serverRuntimeConfig: { // Will only be available on the server side
  //   wordpressApiUrl: process.env.WORDPRESS_API_URL
  // },
  // publicRuntimeConfig: { // Will be available on both server and client
  //   staticFolder: '/public',
  //   port: 8081 // The server port
  // },
  // pageExtensions: ['jsx', 'js'],
  // Removes the [BABEL] Note: The code generator has deoptimised the styling of
  compact: true,
  webpack: (config, options) => {
    const { dev } = options
    if (dev) {
      config.module.rules.push(
        {
          test: /\.(spec,test,stories)\.(js|jsx)$/,
          loader: 'ignore-loader'
        },
        {
          test: /\.{js,jsx}$/,
            enforce: 'pre',
            include: [
              path.resolve('components'),
              path.resolve('pages'),
            ],
            exclude: ['/node_modules/', '/.next/', '/out/'],
            options: {
              // Compile, but with a warning
              emitWarning: true,
            },
            loader: 'eslint-loader'
        }
      )
    }
    return config
  },
  // Client-side environment variables
  env: {
    // Where am I
    STAGING_URL: 'layerframe-app-template.appspot.com',
    PRODUCTION_URL: 'layerframe-app-template.appspot.com',
    // Headless-CMS
    // HEADLESS_CMS_API_URL: 'https://api.mysite.com',
    // HEADLESS_STAGING_CMS_API_URL: 'https://mysite.wpengine.com',
    // HEADLESS_STAGING_CMS_API_URL: 'https://mysite.prismic.io',
    HEADLESS_STAGING_CMS_API_URL: 'https://graphqlzero.almansi.me/api',
    // Site configuration
    PAGE_TITLE: 'My Site',
    META_TITLE: 'My Site',
    META_DESCRIPTION: 'The Global Celebration of Web Apps. Produced by Layerframe.',
    META_KEYWORDS: 'stuff,more stuff',
    META_AUTHOR: 'My Site',
    SOCIAL_TWITTER: '@mysite',
    // Mailchimp
    // MAILCHIMP_API_KEY: '00000000-us9',
    // MAILCHIMP_LIST_ID: 'xxx000xx',
    // MAILING_LIST_UNSUBSCRIBE: 'https://mysite.us9.list-manage.com/unsubscribe?u=0ce80a27fb925dbd1f1ee20f7&id=e84e1bc9c0',
    // Google Analytics
    GOOGLE_UTM_CODE: process.env.NODE_ENV === 'production'
      ? 'UA-000000000-1'
      : 'UA-000000000-1',
    // Facebook Analytics
    FACEBOOK_ANALYTICS_ID: process.env.NODE_ENV === 'production'
      ? '000000000'
      : '000000000',
  }
}

module.exports = withPlugins([
  [withImages, {}],
  [optimizedImages, {}],
  [withFonts, {}],
  [withCSS, {}],
  [withSass, {}],
  // [withWorkers, {
  //   workerLoaderOptions: { inline: true }
  // }],
], nextConfig)
