/**
 * @file Loader.js
 */
import * as React from 'react'
import PropTypes from 'prop-types'

const Loader = (props) => {
  const {
    tagName: Tag,
    className,
    variant,
    children,
    loadingCopy,
  } = props

  return (
    <Tag className={`loader loader--${variant} ${className}`}>
      {loadingCopy}
      {children}
      <style jsx>{`
        .loader {

        }
      `}</style>
    </Tag>
  )
}

Loader.propTypes = {
  tagName: PropTypes.string,
  className: PropTypes.string,
  variant: PropTypes.oneOf(['default']),
  children: PropTypes.node,
  loadingCopy: PropTypes.string,
}

Loader.defaultProps = {
  tagName: 'div',
  className: '',
  variant: 'default',
  children: '',
  loadingCopy: 'Loading...'
}

export default Loader
