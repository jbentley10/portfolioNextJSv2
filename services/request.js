/**
 * @file request.js
 * The requester is a central request processing service.
 * This allows you to quickly change http/https request packages as needed.
 *
 * @see https://www.npmjs.com/package/isomorphic-unfetch
 */

import fetch from 'isomorphic-unfetch'
import whereami from '@layerframers/whereami'

export default {
  // Export the main requesting lib
  fetch: fetch,

/**
 * url
 * Handles making an external http/https request
 * This method should be run within an actual NextJs e.g. pages/api/stuff.js file.
 *
 * Standard based on fetch
 * @see https://www.npmjs.com/package/fetch
 *
 * @param {string} url is the url to fetch
 * @param {object} options is an optional options object
 * @param {function} callback is the callback to run - callback(error, meta, body)
 */
  url: async function (url, options, callback) {
    if (options && Object.keys(options)) {
      return await fetch(url, options, callback)
    }
    return await fetch(url, callback)
  },

/**
 * api
 * Handles making an internal http/https request to the NextJs API
 * This has some logic that figures out where the request is being made from.
 *
 * This method should be fired within getInitialProps
 *
 * @param {object} req is the request object
 * @param {string} path is the path to request
 * @param {string} type is the type of results to return
 * @param {string} apiFolder is the location of the api files
 * @return Promise
 */
  api: async function (req, path, type = 'json', apiFolder = 'api') {
    // Find the location of the request

    // Check to see if a forward slash was added
    let fPath = path
    // Remove forward slash
    if (fPath[0] === '/') {
      fPath = path.substring(1, path.length)
    }
    const host = whereami.now()
    const protocol = process.env.NODE_ENV === 'development' ? 'http://' : 'https://'
    const domain = req ? `${protocol}${req.headers.host}` : host
    const fUrl = `${host}/${apiFolder}/${fPath}`

    if (process.env.DEBUG) {
      console.log('host', host)
      console.log('protocol', protocol)
      console.log('domain:', domain)
      console.log('Fetching nominees via', fUrl)
    }

    const results = await fetch(fUrl)
    switch (type) {
      case 'json':
        return await results.json()
      default:
        return await results.json()
    }
  }
}
