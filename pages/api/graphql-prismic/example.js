/**
 * @file example.js
 * This example shows how to connect to a Prismic GraphQL endpoint.
 */
import prismic from '../../services/prismic'

export default async (req, res, router) => {
  // const lang = (req.query.lang ? req.query.lang : 'en-us').toLowerCase()
  // console.log('Fetching language', lang, 'from Prismic.');
  try {
    const response = await prismic.client.query({
      query: gql`
      {
        allLandings {
          edges {
            node {
              hero_section {
                __typename
                ... on Hero {
                  title
                  subtitle
                  login_text
                }
              }
              how_section {
                ... on How_section {
                  title
                  subtitle
                  body {
                    ... on How_sectionBodyItems {
                      fields {
                        item_image
                        item_title
                        item_description
                      }
                    }
                  }
                }
              }
              footer_section {
                ... on Footer {
                  legal_text
                  legal_url {... on _ExternalLink {url}}
                  privacy_policy_text
                  privacy_policy_url {... on _ExternalLink {url}}
                  cookies_text
                  cookies_url {... on _ExternalLink {url}}
                  disclaimer
                  spotify_copyright
                }
              }
              share_modal {
                ... on Share {
                  share_btn_text
                  title
                  description
                  facebook_text
                  twitter_text
                }
              }

            }
          }
        }
      }
      `
    })

    res.setHeader('Content-Type', 'application/json')
    res.statusCode = 200
    res.end(JSON.stringify(response.data.allLandings.edges))
  } catch (error) {
    console.error(error);
  }
};
