/**
 * @file Nav.js
 */
import * as React from 'react'
import PropTypes from 'prop-types'
import Link from 'next/link'
// import { withRouter } from 'next/router'
// import { motion } from 'framer-motion'

const Nav = (props) => {
  const {
    tagName: Tag,
    className,
    variant,
    children,
    links,
  } = props

  return (
    <Tag className={`nav nav--${variant} ${className}`}>
      <ul className="list ph3">
        <li>
          <Link href='/'>
            <a>Home</a>
          </Link>
        </li>
        {links.map(({ key, href, label }) => (
          <li key={key}>
            <a href={href}>{label}</a>
          </li>
        ))}
      </ul>
      {children}
      <style jsx>{`
        .nav {

        }
        nav {
          text-align: center;
        }
        ul {
          display: flex;
          justify-content: space-between;
        }
        nav > ul {
          padding: 4px 16px;
        }
        li {
          display: flex;
          padding: 6px 8px;
        }
        a {
          color: #067df7;
          text-decoration: none;
        }
      `}</style>
    </Tag>
  )
}

Nav.propTypes = {
  tagName: PropTypes.string,
  className: PropTypes.string,
  variant: PropTypes.oneOf(['default']),
  children: PropTypes.node,
  links: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string,
      href: PropTypes.string,
      label: PropTypes.string,
    }),
  )
}

Nav.defaultProps = {
  tagName: 'div',
  className: '',
  variant: 'default',
  children: '',
  links: [
    { href: 'https://zeit.co/now', label: 'ZEIT', key: 'zeit' },
    { href: 'https://github.com/zeit/next.js', label: 'GitHub', key: 'github' }
  ]
}

export default Nav
