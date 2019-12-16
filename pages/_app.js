/**
 * @file /pages/_app.js
 * @see https://nextjs.org/docs#custom-app
 */
import React from 'react'
import App from 'next/app'
import { AnimatePresence, motion } from 'framer-motion'
import { easeExpOut, easeExpIn } from 'd3-ease'

// Contexts
// import { AuthUserProvider } from '../contexts/AuthUserContext'

// Local components
// import Loader from '../components/Loader'

const pageVariants = {
  exit: {
    opacity: 0,
    transition: {
      duration: 1.25,
      ease: easeExpOut
    }
  },
  enter: {
    opacity: 1,
    transition: {
      duration: 1.25,
      ease: easeExpIn
    }
  }
};

class MyApp extends App {
  render () {
    const { Component, pageProps, router } = this.props

    return (
      <AnimatePresence exitBeforeEnter>
        <motion.div initial="exit" animate="enter" exit="exit">
          <motion.div variants={pageVariants}>
            <Component {...pageProps} key={router.route} />
          </motion.div>
        </motion.div>
        {/* <style jsx global>{``}</style> */}
      </AnimatePresence>
    )
  }
}

// Only uncomment this method if you have blocking data requirements for
// every single page in your MyApp extends Application. This disables the ability to
// perform automatic static optimization, causing every page in your app to
// be server-side rendered.
//
// MyApp.getInitialProps = async function (appContext) {
//   // calls page's `getInitialProps` and fills `appProps.pageProps`
//   const appProps = await MyApp.getInitialProps(appContext);
//
//   return { ...appProps }
// }

export default MyApp
