/**
 * @file SplashLayout.js
 */
import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import Head from 'next/head'

// Local components
// import Header from '../../components/Header'
// import Nav from '../../components/Nav'
// import Loader from '../../components/Loader'
// import Footer from '../../components/Footer'

// Styles
import '../../styles/styles.scss'

// Services
import analytics from '../../services/analytics'

// Check to see if we're on the server or the client.
const isServer = typeof window === 'undefined'

const SplashLayout = (props) => {
  const {
    tagName: Tag,
    className,
    variant,
    children,
    domain,
    pageTitle,
    metaTitle,
    metaDescription,
    metaShareImage,
    metaTwitterHandle,
  } = props;

  useEffect(() => {
    // Enable analytics
    if (!window.GA_INITIALIZED) {
      window.GA_INITIALIZED = true
      analytics.init()
    }

    if (window.GA_INITIALIZED) {
      analytics.logPageView()
    }
  }, [])

  return (
    <Tag className={`splash-layout splash-layout--${variant} ${className}`}>
      <Head>
        <title>{pageTitle}</title>
        <meta name="title" content={metaTitle || pageTitle} />
        <meta name="description" content={metaDescription} />
        <meta name="keywords" content={process.env.META_KEYWORDS} />
        <meta name="author" content={process.env.META_AUTHOR} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:description" content={metaDescription} />
        <meta name="twitter:title" content={metaTitle || pageTitle} />
        <meta name="twitter:site" content={metaTwitterHandle} />
        <meta name="twitter:image" content={`${domain}${metaShareImage}`} />
        <meta name="twitter:creator" content={process.env.SOCIAL_TWITTER} />

        <meta property="og:title" content={metaTitle || pageTitle} />
        <meta property="og:image" content={domain + metaShareImage} />
        <meta property="og:site_name" content={metaTitle || pageTitle} />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:type" content="website" />
      </Head>
      <div className="flex-1">
        {children}
      </div>
      <style jsx global>{`
        .splash-layout {

        }
      `}</style>
    </Tag>
  );
};

SplashLayout.propTypes = {
  tagName: PropTypes.string,
  className: PropTypes.string,
  navLinks: PropTypes.array,
  variant: PropTypes.oneOf(['default']),
  children: PropTypes.node,
  loading: PropTypes.bool,
  domain: PropTypes.string,
  pageTitle: PropTypes.string,
  metaDescription: PropTypes.string,
  metaShareImage: PropTypes.string,
  metaTwitterHandle: PropTypes.string,
};

SplashLayout.defaultProps = {
  tagName: 'div',
  className: ' flex flex-col min-h-screen',
  navLinks: [],
  variant: 'default',
  children: '',
  domain: 'http://www.layerframe.com',
  pageTitle: 'Layerframe NextJs Template',
  metaDescription: 'Layerframe default splash layout description.',
  metaShareImage: '/share.jpg',
  metaTwitterHandle: '@layerframe',
};

export default SplashLayout;
