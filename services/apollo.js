/**
 * @file apollo.js
 * Handles setting up an Apollo client for requests.
 */
import whereami from '@layerframers/whereami'
import fetch from 'isomorphic-unfetch'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { ApolloClient } from 'apollo-client'
import { HttpLink } from 'apollo-link-http'

const graphQLEndpointName = 'api' //e.g. 'graphql'

// Enable caching (Default: false)
const cacheActivated = process.env.CACHE_ACTIVATED == 'true'

// Cache-related options
const defaultOptions = {
  watchQuery: {
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'ignore',
  },
  query: {
    fetchPolicy: 'network-only',
    errorPolicy: 'all',
  },
  mutate: {
    errorPolicy: 'all'
  },
}

// Fetch the endpoint depending on the current environment
let headlessUrl = process.env.HEADLESS_STAGING_CMS_API_URL
if (!whereami.isLocal) {
  headlessUrl = whereami.isStaging
    ? process.env.HEADLESS_STAGING_CMS_API_URL
    : process.env.HEADLESS_CMS_API_URL
}

if (process.env.DEBUG) {
  whereami.log()
  console.log(`Fetching GraphQL data from ${headlessUrl}/${graphQLEndpointName}`)
}

const link = new HttpLink({
  uri: `${headlessUrl}/${graphQLEndpointName}`,
  fetch // The fetch library to use for the request
});

const apolloClientConfig = {
  link,
  cache: new InMemoryCache(),
}
// Add the caching options above
if (!cacheActivated) {
  apolloClientConfig.defaultOptions = defaultOptions
}
// Add dev tools helpers
if (process.env.DEV_TOOLS_ACTIVATED) {
  apolloClientConfig.connectToDevTools = true
}

// Make an instance of the client
const client = new ApolloClient(apolloClientConfig)

export default {
  client,
}
