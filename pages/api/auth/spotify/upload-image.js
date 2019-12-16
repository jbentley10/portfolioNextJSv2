/**
 * @file uploadImage.js
 * Handles uploading a custom playlist image to Spotify
 */
import fetch from 'isomorphic-unfetch'

// Services
import cookies from '../../../../services/cookies'

const apiEndpoint = 'https://api.spotify.com/v1'

export default async (req, res) =>  {
  try {
    // Fetch the tokens from the cookie
    const userCookies = cookies.getSpotifyTokens(req, res)
    console.log('userCookies', userCookies)
    const { accessToken } = userCookies

    const { body } = req
    const { playlistId, base64Image } = body
    console.log('base64Image', base64Image)

    // Handle getting the user profile
    let response = {}
    try {
      response = await fetch(`${apiEndpoint}/playlists/${playlistId}/images`, {
        method: 'PUT',
        mode: 'cors',
        credentials: 'include',
        cache: 'no-cache',
        headers: {
          'Content-Type': 'image/jpeg',
          'Authorization': `Bearer ${accessToken}`
        },
        body: base64Image, // eg. '/9j/....'
      })
      console.log(response)
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
