/**
 * @file services/analytics.js
 * Global site analytics service.
 */
import ReactGA from 'react-ga'

export default {
/**
 * init
 */
  init: () => {
    if (process.env.NODE_ENV !== 'production') {
      return;
    }
    if (!window.GA_INITIALIZED) {
      console.log('GA init')
      ReactGA.initialize(process.env.GOOGLE_UTM_CODE)
      window.GA_INITIALIZED = true
    }
  },

/**
 * ready
 * Handles checking to see if the analytics service is ready.
 */
  // ready: (initCallback) => {
  //   if (!window.GA_INITIALIZED) {
  //     this.init()
  //     window.GA_INITIALIZED = true
  //     return true
  //   }
  // },

/**
 * logPageView
 */
  logPageView: () => {
    const { location } = window
    if (process.env.NODE_ENV !== 'production') {
      return;
    }
    console.log(`Logging pageview for ${window.location.pathname}`)
    ReactGA.set({ page: window.location.pathname })
    ReactGA.pageview(window.location.pathname)
  },

/**
 * logEvent
 */
  logEvent: (category = '', action = '') => {
    if (process.env.NODE_ENV !== 'production') {
      return;
    }
    const fCategory = typeof category !== 'string' ? category.toString() : category
    const fAction = typeof action !== 'string' ? action.toString() : action
    if (fCategory && fAction) {
      console.log('Event logged', { category: fCategory, action: fAction })
      ReactGA.event({ category: fCategory, action: fAction })
    }
  },

/**
 * logException
 */
  logException: (description = '', fatal = false) => {
    const { location } = window
    if (process.env.NODE_ENV !== 'production') {
      return;
    }
    if (description) {
      console.log('Exception logged', { description, fatal })
      ReactGA.exception({ description, fatal })
    }
  },
}
