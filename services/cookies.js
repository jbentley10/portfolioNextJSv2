/**
 * @file cookies.js
 * Handles user cookie authorization related items e.g. setting cookies, clearing them etc.
 */
import { invariant, warning } from 'hey-listen'
import { parseCookies, setCookie, destroyCookie } from 'nookies'

/**
 * getAsObject
 * Handles setting the current user's access tokens form the cookie
 * @param {object} cookies
 * @return {object} parsed cookie object with cleaner names
 */
const getAsObject = (cookies) => {
  try {
    const { SpotifyToken, SpotifyTokenExpiration, SpotifyRefreshToken } = cookies
    return {
      accessToken: SpotifyToken,
      refreshToken: SpotifyRefreshToken,
      expiresIn: SpotifyTokenExpiration,
      error: undefined,
    }
  } catch(err) {
    console.log('There was an error getting the cookies. Likely because the user has not logged in.')
    console.log(err)
    return {
      accessToken: undefined,
      refreshToken: undefined,
      expiresIn: undefined,
      error: err,
    }
  }
}

export default {
/**
 * setAuthCookies
 * Handles setting the Spotify authorization cookies used by the
 * app to check user login status
 * @param {object} req
 * @param {object} res
 * @param {object} tokenData Spotify access token object from authorization flow
 * @return {bool}
 */
  setAuthCookies: (req, res, tokenData) => {
    invariant(tokenData, 'Unable to find a Spotfiy token data')

    const { error, expiresIn, accessToken, refreshToken } = tokenData

    if (error) {
      console.error(error)
      invariant(false, 'There was an error generating the Spotify access code.')
      // TODO: Redirect the user to an error page.
      window.location.replace('/')
      return false
    }

    // When our access token will expire
    const tokenExpirationEpoch = Date.now() + (expiresIn * 1000)

    // Set Cookies
    try {
      setCookie({req, res}, 'LastVisit', new Date().toISOString(), {
        maxAge: 30 * 24 * 60 * 60, // 30 days
        path: '/',
      })

      setCookie({req, res}, 'SpotifyTokenExpiration', tokenExpirationEpoch, {
        maxAge: 30 * 24 * 60 * 60, // 30 days
        path: '/',
      })

      setCookie({req, res}, 'SpotifyToken', accessToken, {
        maxAge: 30 * 24 * 60 * 60, // 30 days
        path: '/',
      })

      setCookie({req, res}, 'SpotifyRefreshToken', refreshToken, {
        maxAge: 30 * 24 * 60 * 60, // 30 days
        path: '/',
      })

      // This is basically a random one to keep folks from cookie spoofing
      setCookie({req, res}, 'SoundtrackOnGarth', 'spotify for the ride', {
        maxAge: 30 * 24 * 60 * 60, // 30 days
        path: '/',
      })

      return true

    } catch (err) {
      invariant(false, err)
      return err
    }
  },

/**
 * clearAuthCookies
 * Handles clearing all of the Spotify authorization cookies
 * @param {object} req
 * @param {object} res
 * @return
 */
  clearAuthCookies: (req, res) => {
    // Destroy
    try {
      destroyCookie({ req, res }, 'LastVisit')
      destroyCookie({ req, res }, 'SpotifyTokenExpiration')
      destroyCookie({ req, res }, 'SpotifyToken')
      destroyCookie({ req, res }, 'SpotifyRefreshToken')
    } catch (err) {
      console.error(err)
      invariant(false, 'There was an error clearing the cookies')
      return err
    }
  },

/**
 * refreshCookies
 * Handles refreshing the cookies with new data
 * @param {string} accessToken
 * @param {string} expiresIn
 * @return {bool}
 */
  refreshCookies: (accessToken, expiresIn) => {
    const thirtyDaysFromNow = 30 * 24 * 60 * 60
    if (process.browser) {
      // Client
      destroyCookie({}, 'SpotifyTokenExpiration')
      setCookie({}, 'SpotifyTokenExpiration', Date.now() + (expiresIn * 1000), {
        maxAge: thirtyDaysFromNow, // 30 days
        path: '/',
      })

      destroyCookie({}, 'SpotifyToken')
      setCookie({}, 'SpotifyToken', accessToken, {
        maxAge: thirtyDaysFromNow, // 30 days
        path: '/',
      })
    } else {
      // Server
      warning(false, 'You are trying to set the cookies on the server')
    }
  },

/**
 * getSpotifyTokens
 * Handles getting the Spotify tokens from the request
 *
 * NOTE: This can be called from the server side i.e. getInitialProps or client side
 */
  getSpotifyTokens: (req, res) => {
    console.log('Parsing Spotify cookies.')
    try {
      // Fetch the cookies on the client side
      if (process.browser) {
        const parsedClientCookies = parseCookies()
        return getAsObject(parsedClientCookies)
      }
      const parsedCookies = parseCookies({ req, res })
      return getAsObject(parsedCookies)
    } catch(err) {
      console.log('There was an error setting the cookies.', err)
      return err
    }
  },
}
