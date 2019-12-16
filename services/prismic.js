/**
 * @file prismic.js
 * This service tries to handle all Prismic-related actions in the app.
 */
import PrismicDom from 'prismic-dom'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { ApolloClient } from 'apollo-client'
import { PrismicLink } from 'apollo-link-prismic'

const graphQLEndpointName = 'graphql'

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

if (process.env.DEBUG) {
  whereami.log()
  console.log(`Fetching GraphQL data from ${headlessUrl}/${graphQLEndpointName}`)
}

const apolloClientConfig = {
  link: PrismicLink({
    uri: `${process.env.PRISMIC_API_URL}/${graphQLEndpointName}`
  }),
  cache: new InMemoryCache()
}
// Add the caching options above
if (!cacheActivated) {
  apolloClientConfig.defaultOptions = defaultOptions
}

// Make an instance of the client
const client = new ApolloClient(apolloClientConfig)

export default {
/**
 * client
 * Make the client that was created, public
 */
  client,

/**
 * postProcessLandingContent
 * An example post-processing method that converts the Prismic
 * data into a format that is nicer to the React components
 */
  postProcessLandingContent: ({
    example,
  }) => () => ({
    example,
    example2: PrismicDom.RichText.asText(example),
    example2: getUrl(example),
  })
}

// Private functions

/** Safely extracts a property from an Object
 * @param {object} item object with potential null properties
 * @param {string} property name of property
 * @return {*}
 */
const safeGet = (item, property) => {
  let nullCheckedProperty

  if (item && item[property]) {
    nullCheckedProperty = item[property]
  }

  return nullCheckedProperty
}

/** Safely extracts a url from an Object
 * @param {object} item object with potential null properties
 * @return {*}
 */
const getUrl = (item) => {
  return safeGet(item, 'url')
}
