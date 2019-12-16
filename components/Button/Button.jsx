/**
 * @file Button.js
 */
import * as React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-scroll'

import NextLink from 'next/link'

import mediaQueries from '../../styles/mediaQueries'
import analytics from '../../services/analytics'

const Button = (props) => {
  const {
    tagName: Tag,
    className,
    variant,
    type,
    children,
    buttonClassName,
    textSizeClassName,
    defaultGlowColor,
    hoverGlowColor,
    hoverOutlineColor,
    href,
    onClick,
    scrollTo,
    scrollOffset,
    socialPlatform,
    shareUrl,
    shareCaption,
    trackingEventCategory,
    trackingEventAction,
  } = props

  let aClasses
  let textSizeClasses
  let glowClasses

  switch (variant) {
    case 'social-sign-in':
      aClasses = 'button flex justify-start items-center text-white relative z-10 px-15 rounded-4 w-full h-full xxl:px-20 xxl:rounded-5'
      textSizeClasses = textSizeClassName ? textSizeClassName : 'text-11 lg:text-14 xxl:text-17'
      glowClasses = 'button-wrapper__glow block absolute inset-0 rounded-4 pointer-events-none'
      break
    case 'ghost-small':
    case 'ghost-large':
      aClasses = 'button flex justify-center items-center relative z-10 rounded-5 border-solid border-2 w-full h-full'
      textSizeClasses = textSizeClassName ? textSizeClassName : 'text-10 lg:text-14 xxl:text-16'
      glowClasses = 'block absolute inset-0 rounded-5 border-solid border-2 pointer-events-none blur-6 ' + buttonClassName
      break
    case 'small':
      aClasses = 'button flex justify-center items-center text-13 text-white relative z-10 w-full h-full rounded-4'
      textSizeClasses = textSizeClassName ? textSizeClassName : 'text-13'
      glowClasses = 'button-wrapper__glow block absolute inset-0 rounded-4 pointer-events-none'
      break
    case 'free-form':
      aClasses = 'button flex justify-center items-center text-white relative z-10 w-full h-full'
      textSizeClasses = textSizeClassName ? textSizeClassName : 'text-13 lg:text-15 xxl:text-17'
      glowClasses = 'button-wrapper__glow block absolute inset-0 pointer-events-none'
      break
    case 'social-share-small':
    case 'social-share-large':
    case 'full-width':
    default:
      aClasses = 'button flex justify-center items-center text-white relative z-10 rounded-4 w-full h-full'
      textSizeClasses = textSizeClassName ? textSizeClassName : 'text-13 lg:text-15 xxl:text-17'
      glowClasses = 'button-wrapper__glow block absolute inset-0 rounded-4 pointer-events-none'
      break
  }

/**
 * openShare
 */
  const openShare = (platform) => {
    const popUpHeight = 550
    const popUpWidth = 600
    const popUpLeftPosition = (screen.width/2) - (popUpWidth/2)
    const popUpTopPosition = (screen.height/2) - (popUpHeight/2)
    const popUpSettings = 'top=' + popUpTopPosition + ', left=' + popUpLeftPosition + ', width=' + popUpWidth + ', height=' + popUpHeight + ', resizable=no, scrollbars=no'

    if (platform == 'twitter') {

      window.open('https://twitter.com/intent/tweet?' + convertToQueryString({
          'source': 'webclient',
          'text': shareCaption !== null ? shareCaption : '',
          'url': shareUrl !== null ? shareUrl : '',
        }), 'Twitter', popUpSettings)

    } else if (platform == 'facebook') {

      window.open('https://www.facebook.com/sharer/sharer.php?' + convertToQueryString({
        'u': shareUrl !== null ? shareUrl : '',
      }), 'Facebook', popUpSettings)

    }
  }

/**
 * convertToQueryString
 */
  const convertToQueryString = (data) => {
    return Object.keys(data).map(key => `${key}=${encodeURIComponent(data[key])}`).join('&');
  }

/**
 * logEvent
 */
  const logEvent = () => {
    analytics.logEvent(trackingEventCategory, trackingEventAction)
  }

  return (
    <Tag className={`button-wrapper button-wrapper--${variant} relative ${className}`}>

      { type == 'internal-link' ?
        <NextLink href={href}>
          <a className={`${aClasses} ${textSizeClasses} ${buttonClassName}`} onClick={logEvent}>
            {children}
          </a>
        </NextLink>
      : type == 'external-link' ?
        <a href={href} onClick={logEvent} className={`${aClasses} ${textSizeClasses} ${buttonClassName}`} target="_blank" rel="noopener noreferrer">
          {children}
        </a>
      : type == 'scroll-to' ?
        <Link
          to={scrollTo}
          smooth={true}
          duration={800}
          offset={scrollOffset}>
            <span className={`${aClasses} ${textSizeClasses} ${buttonClassName}`}>
              {children}
            </span>
        </Link>
      : type == 'social-share' ?
        <button className={`${aClasses} ${textSizeClasses} ${buttonClassName}`}
          type="button"
          onClick={(event) => {
            openShare(socialPlatform)
            // Track it.
            logEvent()
          }}>
          {children}
        </button>
      :
        <button className={`${aClasses} ${textSizeClasses} ${buttonClassName}`}
          type="button"
          onClick={(event) => {
            event.preventDefault()
            // Track it.
            logEvent()
            return onClick()
          }}>
          {children}
        </button>
      }

      <span className={`button-wrapper__glow--default opacity-50 ${glowClasses}`} />
      <span className={`button-wrapper__glow--hover opacity-0 ${glowClasses}`} />

      {hoverOutlineColor &&
        <span className="button-wrapper__hover-outline block absolute top-0 right-0 bottom-0 left-0 opacity-0 rounded-4 pointer-events-none" />
      }

      <style jsx>{`
        .button-wrapper--default {
          width: 280px;
          height: 50px;
        }
        .button-wrapper--social-sign-in {
          width: 280px;
          height: 40px;
        }
        .button-wrapper--social-share-small {
          width: 60px;
          height: 40px;
        }
        .button-wrapper--social-share-large {
          width: 60px;
          height: 40px;
        }
        .button-wrapper--ghost-small {
          width: 120px;
          height: 40px;
        }
        .button-wrapper--ghost-large {
          width: 125px;
          height: 40px;
        }
        .button-wrapper--small {
          width: 200px;
          height: 50px;
        }
        .button-wrapper--full-width {
          width: 100%;
          height: 50px;
        }
        .button-wrapper__glow--default {
          box-shadow: ${defaultGlowColor ? `0px 0px 25px 5px ${defaultGlowColor}` : 'none'};
          transition: opacity 400ms;
        }
        .button-wrapper__glow--hover {
          box-shadow: ${hoverGlowColor ? `0px 0px 25px 5px ${hoverGlowColor}` : 'none'};
          transition: opacity 400ms;
        }
        .button-wrapper:hover .button-wrapper__glow--default {
          opacity: 0;
        }
        .button-wrapper:hover .button-wrapper__glow--hover {
          opacity: 0.5;
        }
        .button-wrapper__hover-outline {
          background: ${hoverOutlineColor ? hoverOutlineColor : 'none'};
          transition: opacity 400ms, top 400ms, right 400ms, bottom 400ms, left 400ms;
        }
        .button-wrapper:hover .button-wrapper__hover-outline {
          top: -10px;
          right: -10px;
          bottom: -10px;
          left: -10px;
          opacity: 1;
        }
        .button {
          transition: color 400ms, background-color 400ms, border-color 400ms;
        }

        @media (min-width: ${mediaQueries.lg}) {
          .button-wrapper--default {
            width: 300px;
            height: 54px;
          }
          .button-wrapper--social-sign-in {
            width: 310px;
            height: 54px;
          }
          .button-wrapper--social-share-large {
            width: 75px;
            height: 50px;
          }
          .button-wrapper--ghost-large {
            width: 155px;
            height: 50px;
          }
          .button-wrapper--full-width {
            height: 54px;
          }
        }

        @media (min-width: ${mediaQueries.xxl}) {
          .button-wrapper--default {
            width: 335px;
            height: 60px;
          }
          .button-wrapper--social-sign-in {
            width: 360px;
            height: 60px;
          }
          .button-wrapper--social-share-large {
            width: 85px;
            height: 55px;
          }
          .button-wrapper--ghost-large {
            width: 180px;
            height: 55px;
          }
          .button-wrapper--full-width {
            height: 60px;
          }
        }
      `}</style>
    </Tag>
  )
}

Button.propTypes = {
  tagName: PropTypes.string,
  className: PropTypes.string,
  variant: PropTypes.oneOf(['default', 'social-sign-in', 'social-share-small', 'social-share-large', 'ghost-small', 'ghost-large', 'small', 'full-width', 'free-form']),
  type: PropTypes.oneOf(['default', 'internal-link', 'external-link', 'scroll-to', 'social-share']),
  children: PropTypes.node,
  buttonClassName: PropTypes.string,
  textSizeClassName: PropTypes.string,
  defaultGlowColor: PropTypes.string,
  hoverGlowColor: PropTypes.string,
  hoverOutlineColor: PropTypes.string,
  href: PropTypes.string,
  target: PropTypes.string,
  onClick: PropTypes.func,
  scrollTo: PropTypes.string,
  scrollOffset: PropTypes.number,
  socialPlatform: PropTypes.oneOf(['twitter', 'facebook']),
  shareUrl: PropTypes.string,
  shareCaption: PropTypes.string,
  trackingEventCategory: PropTypes.string,
  trackingEventAction: PropTypes.string,
}

Button.defaultProps = {
  tagName: 'div',
  className: '',
  variant: 'default',
  type: 'default',
  children: '',
  buttonClassName: '',
  textSizeClassName: '',
  defaultGlowColor: '',
  hoverGlowColor: '',
  hoverOutlineColor: '',
  href: '#!',
  onClick: () => { console.log('Button clicked') },
  scrollTo: '',
  scrollOffset: 0,
  socialPlatform: 'twitter',
  shareUrl: 'http://thegameawards.com/',
  shareCaption: 'The Game Awards. The Global Celebration of Video Games and Esports. Live December 12. Produced by Geoff Keighley.',
  trackingEventCategory: 'Button',
  trackingEventAction: 'clicked',
}

export default Button
