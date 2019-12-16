/**
 * @file CookiesPopUp.js
 */
import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { useCookies } from 'react-cookie';

import Link from 'next/link'

import mediaQueries from '../../styles/mediaQueries'
import colors from '../../styles/colors'

// Local components
import Button from '../Button'

const CookiesPopUp = (props) => {
  const {
    tagName: Tag,
    className,
    variant,
    children,
  } = props

  const [cookies, setCookie] = useCookies(['cookieNotificationIsConfirmed'])
  const [cookiePopUpIsActive, setCookiePopUpIsActive] = useState(false)

  useEffect(() => {
    setCookiePopUpIsActive(!cookies.cookie_notification_is_confirmed)
  }, [])

  const confirmCookie = () => {
    setCookie('cookie_notification_is_confirmed', true, { path: '/' })
    setCookiePopUpIsActive(false)
  }

  return (
    <Tag className={`cookies-pop-up cookies-pop-up--${variant} ${className}${cookiePopUpIsActive ? ' active' : ''}`}>
      <div className="w-full h-full p-25 flex items-end lg:p-0">
        <div className="bg-purple-58 px-50 py-45 text-center relative z-10 rounded-10 w-full lg:bg-transparent lg:h-full lg:flex lg:justify-between lg:items-center">
          <div className="cookies-pop-up__content mx-auto lg:flex lg:justify-between lg:items-center">
            <span className="block text-white text-15 leading-tight tracking-tight lg:flex-1 lg:text-left lg:mt-5">
              We use cookies to improve your experience on our website.
              <Link href="/cookies-policy">
                <a className="text-orange-f0 hover:text-white active:text-orange-f0 ml-5">Learn More</a>
              </Link>
            </span>
            <div className="cookies-pop-up__button mt-30 lg:mt-0 lg:ml-30">
              <Button
                variant="full-width"
                buttonClassName="bg-purple-6d hover:bg-orange-f0 active:bg-orange-eb"
                defaultGlowColor={colors.purple_6d}
                hoverGlowColor={colors.orange_f0}
                hoverOutlineColor={colors.orange_dc}
                textSizeClassName="text-15"
                trackingEventCategory="CookiesConfirmation"
                onClick={confirmCookie}>
                All Good!
              </Button>
            </div>
          </div>
        </div>
        <div className="bg-purple-24 opacity-75 absolute inset-0"/>
      </div>
      {children}
      <style jsx>{`
        .cookies-pop-up {
          transition: opacity 500ms ease-in-out, height 0s 500ms;
        }
        .cookies-pop-up.active {
          height: 100%;
          opacity: 1;
          transition: opacity 500ms ease-in-out, height 0ms;
        }
        .cookies-pop-up__content {
          max-width: 280px;
        }

        @media (min-width: ${mediaQueries.lg}) {
          .cookies-pop-up.active {
            height: 110px;
          }
          .cookies-pop-up__content {
            max-width: 1020px;
          }
          .cookies-pop-up__button {
            width: 250px;
          }
        }
      `}</style>
    </Tag>
  )
}

CookiesPopUp.propTypes = {
  tagName: PropTypes.string,
  className: PropTypes.string,
  variant: PropTypes.oneOf(['default']),
  children: PropTypes.node,
}

CookiesPopUp.defaultProps = {
  tagName: 'div',
  className: 'fixed left-0 bottom-0 h-0 w-screen z-50 opacity-0 overflow-hidden',
  variant: 'default',
  children: '',
}

export default CookiesPopUp
