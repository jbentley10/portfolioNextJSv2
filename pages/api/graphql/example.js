/**
 * @file example.js
 * @url http://localhost:3000/api/about
 * This example shows how to connect to a common GraphQL enpoint e.g. Wordpress-CMS running GrpahQL.
 */
import apollo from '../../services/apollo'
import gql from 'graphql-tag'

export default async (req, res) => {
  // const lang = req.query.lang ? req.query.lang.toLowerCase() : 'en-us'
  try {
    const options = {
      paginate: {
        page: 1,
        limit: 5
      }
    }
    const response = await apollo.client.query({
      query: gql`
      {
        posts(options: ${options}) {
          data {
            id
            title
          }
          meta {
            totalCount
          }
        }
      }
      `
    })
    res.setHeader('Content-Type', 'application/json')
    res.statusCode = 200
    res.end(JSON.stringify(response.data.menus.edges[0].node.menuItems.nodes))
  } catch (error) {
    console.error(error);
  }
};
