/**
 * @file example.js
 * This example shows how to make a basic request to a REST API
 */
import request from '../../services/request'

export default async (req, res) => {
  res.setHeader('Content-Type', 'application/json')
  try {
    const url = `${process.env.API_URL}${process.env.NAV_ENDPOINT}`
    console.log('Fetching content from url', url)
    const results = await request.fetch(url)
    const content = await results.json()
    res.statusCode = 200
    res.end(JSON.stringify(content))
  } catch (error) {
    console.error(error);
    res.statusCode = error.code
    res.end(JSON.stringify(error))
  };
};
