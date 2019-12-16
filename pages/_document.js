/**
 * @file /pages/_document.js
 * _document is only rendered on the server side and not on the client side
 * Event handlers like onClick can't be added to this file
 */
import React from 'react'
import Document, { Html, Head, Main, NextScript } from 'next/document'
import PropTypes from 'prop-types'
import { isMobile } from 'react-device-detect'

// Local components
import Pixel from '../components/Pixel'

// Google Tag Manager
const GOOGLE_UTM_CODE = process.env.GOOGLE_UTM_CODE

class MyDocument extends Document {
  render() {
    const { metaTitle, metaDescription } = this.props
    // const fMetaTitle = process.env.META_TITLE || metaTitle
    // const fMetaDesc = process.env.META_DESCRIPTION|| metaDescription
    return (
      <Html>
        <Head>
          <meta httpEquiv="content-type" content="application/xhtml+xml" charSet="utf-8" />
          <link rel="shortcut icon" href="/favicon.png"/>

          {/* <link rel="preload" href="https://use.typekit.net/qch1tbb.css" as="style" />
          <link rel="stylesheet" href="https://use.typekit.net/qch1tbb.css" /> */}

          <link rel="preload" href="/fonts/PanoTrial-Light.woff2" as="font" type="font/woff2" crossOrigin="anonymous"/>
          <link rel="preload" href="/fonts/PanoTrial-Light.woff" as="font" type="font/woff" crossOrigin="anonymous"/>
          <link rel="preload" href="/fonts/PanoTrial-Regular.woff2" as="font" type="font/woff2" crossOrigin="anonymous"/>
          <link rel="preload" href="/fonts/PanoTrial-Regular.woff" as="font" type="font/woff" crossOrigin="anonymous"/>
          <link rel="preload" href="/fonts/PanoTrial-Bold.woff2" as="font" type="font/woff2" crossOrigin="anonymous"/>
          <link rel="preload" href="/fonts/PanoTrial-Bold.woff" as="font" type="font/woff" crossOrigin="anonymous"/>

          {/* Preload some images specific to devices */}
          {!isMobile ? (
            <>
              {/* Desktop images */}
              {/* <link rel="preload" href="/bgs/bg-primary_hero-desktop.jpg" as="image" /> */}
            </>
          ) : (
            <>
              {/* Mobile images */}
              {/* <link rel="preload" href="/bgs/bg-primary_hero-mobile.jpg" as="image" /> */}
            </>
          )}

          <script async src={`https://www.googletagmanager.com/gtag/js?id=${GOOGLE_UTM_CODE}`}></script>
          <script dangerouslySetInnerHTML={{
            __html: `window.dataLayer = window.dataLayer || [];
                function gtag(){ dataLayer.push(arguments); }
                gtag('js', new Date());
                gtag('config', '${GOOGLE_UTM_CODE}');`
          }}>
          </script>
        </Head>
        <body>
          <Main/>
          <NextScript />
          <Pixel name="Facebook" id={process.env.FACEBOOK_ANALYTICS_ID} />
        </body>
      </Html>
    )
  }
}

MyDocument.propTypes = {
  metaTitle: PropTypes.string,
  metaDescription: PropTypes.string,
};

MyDocument.defaultProps = {
  metaTitle: 'The Game Awards',
  metaDescription: 'The Global Celebration of Video Games and Esports. Live December 12. Produced by Geoff Keighley.',
};

export default MyDocument
