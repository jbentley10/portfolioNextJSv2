/**
 * @file refresh.js
 * Handles refreshing the Spotify user tokens
 */

// Services
import cookies from '../../../../services/cookies'
import spotify from '../../../../services/spotify'

export default async (req, res) =>  {
  try {
    // Fetch the tokens from the cookie
    const userCookies = cookies.getSpotifyTokens(req, res)
    console.log('userCookies', userCookies)
    const { accessToken, refreshToken } = userCookies

    // Pass the cookies to spotify service
    const serverSpotifyClientInitialized = spotify.init(accessToken, refreshToken)
    // Handle getting the user profile
    let response = {}
    try {
      if (serverSpotifyClientInitialized) {
        response = await spotify.refreshTheAccessTokens()
        console.log(response)
      } else {
        response = {
          error: {
            code: 404,
            message: 'Failed to initialize the Spotify API',
          }
        }
      }
    } catch (err) {
      response = {
        error: err,
      }
    }
    res.setHeader('Content-Type', 'application/json')
    res.statusCode = 200
    res.end(JSON.stringify(response))
  } catch (err) {
    console.error(err)
    res.end(JSON.stringify(err))
  }
}
