/**
 * @file Error404.js
 */
import * as React from 'react'
import PropTypes from 'prop-types'

import colors from '../../styles/colors'

// Local components
import Button from '../../components/Button'

const Error404 = (props) => {
  const {
    tagName: Tag,
    className,
    variant,
    children,
  } = props

  return (
    <Tag className={`error404 error404--${variant} ${className}`}>
      <div className="container my-70 md:my-100 xl:my-120 text-center">
        <div className="relative text-80 text-transparent text-stroke-width-2 text-stroke-color-orange-f0 md:text-140 lg:text-190 xxl:text-250 lg:text-stroke-width-3">
          <div className="absolute w-full">404</div>
          <div className="blur-4">404</div>
        </div>
        <div className="error404__caption text-purple-bf text-14 mx-auto md:-mt-10 lg:text-17 xxl:-mt-30">
          <p>Congratulations! You found a void. We really hope you find what you are looking for soon.</p>
        </div>
        <div className="mt-30 md:mt-40 xxl:mt-50">
          <Button
            className="mx-auto"
            type="internal-link"
            href="/"
            buttonClassName="bg-orange-f0 hover:bg-purple-58 active:bg-purple-42"
            glowColor={colors.orange_f0}
            hoverOutlineColor={colors.purple_6d}
          >
            Return To Start
          </Button>
        </div>
      </div>
      {children}
      <style jsx>{`
        .error404 {

        }
        .error404__caption {
          max-width: 600px;
        }
      `}</style>
    </Tag>
  )
}

Error404.propTypes = {
  tagName: PropTypes.string,
  className: PropTypes.string,
  variant: PropTypes.oneOf(['default']),
  children: PropTypes.node,
}

Error404.defaultProps = {
  tagName: 'div',
  className: 'bg-dotted-03 relative flex items-center justify-center min-h-screen',
  variant: 'default',
  children: '',
}

export default Error404
