/**
 * @file ls.js
 * Pertains to all things localStorage in the app. Setting vars, fetching existing ones, etc.
 */
import { invariant, warning } from 'hey-listen'

export default {

/**
* getLocalStorageData
* Handles getting all of the data stored in localStorage
* @param {void}
* @return {object} All of the localStorage data
*/
  getLocalStorageData: async function () {
    if (!process.browser) {
      return false
    }
    try {
      const duration = JSON.parse(localStorage.getItem('duration'))
      const playlistUrl = JSON.parse(localStorage.getItem('playlistUrl'))
      const origin = JSON.parse(localStorage.getItem('origin'))
      const destination = JSON.parse(localStorage.getItem('destination'))
      const dataObj = {
        origin,
        destination,
        playlistUrl,
        duration,
        durationInSeconds: duration.value * 1000
      }
      return dataObj
    } catch (err) {
      console.error(err)
      invariant(false, 'There was an error clearing the local storage')
      return err
    }
  },

/**
* clearLocalStorage
* Handles clearing all of the data stored by the app in localStorage
* @return
*/
  clearLocalStorage: () => {
    if (!process.browser) {
      return false
    }
    // Destroy the vars
    try {
      localStorage.removeItem('duration')
      localStorage.removeItem('playlistUrl')
      localStorage.removeItem('destination')
      localStorage.removeItem('origin')
      localStorage.clear()
    } catch (err) {
      console.error(err)
      invariant(false, 'There was an error clearing the local storage')
      return err
    }
  },

}
