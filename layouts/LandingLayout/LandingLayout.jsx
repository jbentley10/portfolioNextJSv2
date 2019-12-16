/**
 * @file LandingLayout.js
 */
import React, { Fragment, useEffect } from 'react'
import PropTypes from 'prop-types'
import Head from 'next/head'

// Local components
import Header from '../../components/Header'
import Nav from '../../components/Nav'
import Loader from '../../components/Loader'
import Footer from '../../components/Footer'
import CookiesPopUp from '../../components/CookiesPopUp'

// Styles
import '../../styles/styles.scss'

// Services
import analytics from '../../services/analytics'

// Contexts
// import useAuthUser from '../../contexts/AuthUserContext/useAuthUser'

const LandingLayout = (props) => {
  const {
    tagName: Tag,
    className,
    variant,
    children,
    loading,
    pageTitle,
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

  // const { isLoggedIn, loading } = useAuthUser()

  // console.log('Landing Layout isLoggedIn', isLoggedIn)

  // TODO: Highjack the route using Router.on.events to see if the user is trying to vote.
  // If that is the case, cancel the route and launch the sign in modal.
  // https://github.com/zeit/next.js/#router-events
  //
  // const handleRouteChange = url => {
  //   console.log('App is changing to: ', url)
  //   if (url === '/nominee') {
  //     setSignInModalIsOpen(true)
  //   }
  // }
  // Set up router event to listen for route changes
  //Router.events.on('routeChangeStart', handleRouteChange)
  // Turn off the events if the user is logged in
  //Router.events.off('routeChangeStart', handleRouteChange)

  if (loading) {
    return <Loader />
  }

  return (
    <Tag className={`landing-layout landing-layout--${variant} ${className}`}>
      <Head>
        <title>{pageTitle}</title>
      </Head>
      <Header>
        <Nav links={[
            { href: 'https://www.layerframe.com/', label: 'LAYERFRAME', key: 'layerframe' },
            { href: 'https://zeit.co/now', label: 'ZEIT', key: 'zeit' },
            { href: 'https://github.com/zeit/next.js', label: 'GitHub', key: 'github' }
          ]}/>
      </Header>

      {/* Load the background 3d animation */}
      <Fragment>
        <div className="flex-1">
          {children}
        </div>
        <Footer />
        <CookiesPopUp />
      </Fragment>
      <style jsx global>{`
        .landing-layout {

        }
      `}</style>
    </Tag>
  );
};

LandingLayout.propTypes = {
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

LandingLayout.defaultProps = {
  tagName: 'div',
  className: ' flex flex-col min-h-screen',
  navLinks: [],
  variant: 'default',
  children: '',
  loading: false,
  domain: 'http://www.layerframe.com',
  pageTitle: 'Layerframe NextJs Template',
  metaDescription: 'Layerframe default splash layout description.',
  metaShareImage: '/share.jpg',
  metaTwitterHandle: '@layerframe',
};

export default LandingLayout;
