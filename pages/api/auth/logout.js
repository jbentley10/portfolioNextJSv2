/**
 * @file logout.js
 * Handles deauthorizing the app for the user and deleting the cookies that were set.
 */
import { invariant, warning } from 'hey-listen'
import url from 'url'

// Services
import spotify from '../../../services/spotify'

export default async (req, res) => {
  // Clear the app cookies
  spotify.clearAuthCookies(req, res)

  res.setHeader('Content-Type', 'application/json')
  res.statusCode = 200
  res.end(JSON.stringify({
    success: true
  }))
}
