/**
 * @file callback.js
 * Spotify Authorization callback
 */
import { invariant, warning } from 'hey-listen'
import url from 'url'
import whereami from '@layerframers/whereami'

// Services
import spotify from '../../../../services/spotify'
import cookies from '../../../../services/cookies'

// change to below interval to test this once every second
// const CLIENT_CRED_REFRESH = 1000;

// async function refreshAccessToken () {

//     // Refresh token
//     const data = await spotify.refreshToken();
//     console.log('token refreshed.. data', data);

//     // Not sure why this isn't working (I'm probably doing it wrong) .. but basically I'm trying to update our
//     // cookies for the token and expiration.. I don't see them changing on the client
//     destroyCookie({},'SpotifyTokenExpiration');
//     setCookie({}, 'SpotifyTokenExpiration', Date.now() + (data.expiresIn * 1000), {
//       maxAge: 30 * 24 * 60 * 60, // 30 days
//       path: '/',
//     })

//     destroyCookie({},'SpotifyToken');
//     setCookie({}, 'SpotifyToken', data.accessToken, {
//       maxAge: 30 * 24 * 60 * 60, // 30 days
//       path: '/',
//     })

// }

// run on init
// setInterval(refreshAccessToken, CLIENT_CRED_REFRESH)

export default async (req, res) => {
  const { code } = req.query
  if (!code) {
    invariant(code, 'There was an issue getting the Spotify auth code.')
    // TODO: Forward the user to handled error page
    res.setHeader('Content-Type', 'text/plain')
    res.end('Uh, oh! There was an error logging you in.')
    return false
  }

  whereami.log()

  // Retrieve an access token and a refresh token
  const tokenData = await spotify.getAccessToken(code)
  if (tokenData.err) {
    console.error('tokenData.err', tokenData.err)
    res.redirect(`/?error=1&message=${tokenData.err}`)
    return false
  }

  // Set some cookies that we can reuse
  const status = await cookies.setAuthCookies(req, res, tokenData)
  if (!status) {
    console.log('There was an issue setting the Spotify auth cookies.')
  }

  const parsedReferer = url.parse(req.headers.referer)

  // TODO: This doesn't seem to be working properly
  // Get the locale from the referer
  const paths = parsedReferer.pathname.split('/')
  var filteredPaths = paths.filter((el) => {
    return el !== '' && el !== null;
  });
  console.log('paths', filteredPaths)
  const locale = filteredPaths[0] && filteredPaths[0].toLowerCase() // It's the first item in the url pathname
  console.log('locale', locale)

  // Redirect with the tokens
  // res.redirect(`/${locale || process.env.DEFAULT_LANG}${process.env.SPOTIFY_CALLBACK_REDIRECT_URI}`);
  res.redirect(`${process.env.SPOTIFY_CALLBACK_REDIRECT_URI}?lang=${process.env.DEFAULT_LANG}`)
  return true
}
