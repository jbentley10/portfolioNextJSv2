/**
 * @file CommonLayout.js
 */
import React, { Fragment, useEffect } from 'react'
import PropTypes from 'prop-types'
import Head from 'next/head'
import { useRouter } from 'next/router'

// Local components
import Header from '../../components/Header'
import Nav from '../../components/Nav'
import Loader from '../../components/Loader'
import Footer from '../../components/Footer'
import CookiesPopUp from '../../components/CookiesPopUp'

import '../../styles/styles.scss'

// Services
import analytics from '../../services/analytics'

// Contexts
// import useAuthUser from '../../contexts/AuthUserContext/useAuthUser'

const CommonLayout = (props) => {
  const {
    tagName: Tag,
    className,
    variant,
    children,
    disableLoader,
    pageTitle,
    metaTitle,
    metaDescription,
    metaShareImage,
    metaTwitterHandle,
    domain,
  } = props;

  // const [dimensions, setDimensions] = useState({ width, height })
  const router = useRouter()
  // const { slug } = router.query
  // const { isLoggedIn, loading } = useAuthUser()

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

  const localMetaShareImage = metaShareImage ? metaShareImage : `${domain}/share.jpg`

  return (
    <Tag className={`common-layout common-layout--${variant} ${className}`}>
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
        <meta name="twitter:image" content={localMetaShareImage} />
        <meta name="twitter:creator" content={process.env.SOCIAL_TWITTER} />

        <meta property="og:title" content={metaTitle || pageTitle} />
        <meta property="og:image" content={localMetaShareImage} />
        <meta property="og:site_name" content={metaTitle || pageTitle} />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:type" content="website" />
      </Head>
      {/* {loading && !disableLoader ?
        <Loader />
      : */}
        <Fragment>
          <Header>
            <Nav links={[
                { href: 'https://www.layerframe.com/', label: 'LAYERFRAME', key: 'layerframe' },
                { href: 'https://zeit.co/now', label: 'ZEIT', key: 'zeit' },
                { href: 'https://github.com/zeit/next.js', label: 'GitHub', key: 'github' }
              ]}/>
          </Header>
          <div className="flex-1">
            {children}
          </div>
          <Footer />
          <CookiesPopUp />
        </Fragment>
      {/* } */}
      <style jsx global>{`
        .common-layout {

        }
      `}</style>
    </Tag>
  );
};

CommonLayout.propTypes = {
  tagName: PropTypes.string,
  className: PropTypes.string,
  variant: PropTypes.oneOf(['default']),
  children: PropTypes.node,
  disableLoader: PropTypes.bool,
  pageTitle: PropTypes.string,
  metaDescription: PropTypes.string,
  metaShareImage: PropTypes.string,
  metaTwitterHandle: PropTypes.string,
  domain: PropTypes.string,
};

CommonLayout.defaultProps = {
  tagName: 'div',
  className: ' flex flex-col min-h-screen overflow-hidden',
  variant: 'default',
  children: '',
  disableLoader: false,
  domain: 'http://www.layerframe.com',
  pageTitle: 'Layerframe NextJs Template',
  metaDescription: 'Layerframe default splash layout description.',
  metaShareImage: '/share.jpg',
  metaTwitterHandle: '@layerframe',
};

export default CommonLayout;
