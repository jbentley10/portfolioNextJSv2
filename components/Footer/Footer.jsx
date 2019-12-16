/**
 * @file Footer.js
 */
import * as React from 'react'
import PropTypes from 'prop-types'

import colors from '../../styles/colors'

const Footer = (props) => {
  const {
    tagName: Tag,
    className,
    variant,
    children,
    bgColor,
  } = props

  return (
    <Tag className={`cf footer footer--${variant} ${className}`}>
      <ul className="text-19 text-center text-purple-a7">
        <li className="inline-block mr-10"><a href="#" className="hover:opacity-50">COOKIES</a></li>
        <li className="inline-block mr-10"><a href="#" className="hover:opacity-50">PRIVACY POLICY</a></li>
        <li className="inline-block mr-10"><a href="#" className="hover:opacity-50">FAQ</a></li>
        <li className="inline-block mr-10"><a href="#" className="hover:opacity-50">SOCIAL</a></li>
      </ul>
      <p className="inline-block">&copy; Copyright 2019 Layerframe</p>
      {children}
      <style jsx>{`
        .footer {
          background-color: ${bgColor}
        }
      `}</style>
    </Tag>
  )
}

Footer.propTypes = {
  tagName: PropTypes.string,
  className: PropTypes.string,
  variant: PropTypes.oneOf(['default']),
  children: PropTypes.node,
  bgColor: PropTypes.string,
}

Footer.defaultProps = {
  tagName: 'div',
  className: 'bg-purple-1c px-20 py-50 relative md:px-35 lg:flex lg:justify-between lg:items-center lg:py-60 xl:px-50 xxl:px-70',
  variant: 'default',
  children: '',
  bgColor: '#ffffff',
}

export default Footer
