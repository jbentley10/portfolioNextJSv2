/**
 * @file Header.js
 */
import * as React from 'react'
import fetch from 'isomorphic-unfetch'
import PropTypes from 'prop-types'

const Header = (props) => {
  const {
    tagName: Tag,
    className,
    variant,
    children,
  } = props;

  return (
    <Tag className={`header header--${variant} ${className}`}>
      {children}
      <style jsx>{`
        .header {

        }
      `}</style>
    </Tag>
  );
};

Header.propTypes = {
  tagName: PropTypes.string,
  loading: PropTypes.bool,
  className: PropTypes.string,
  variant: PropTypes.oneOf(['default']),
  children: PropTypes.node,
};

Header.defaultProps = {
  tagName: 'header',
  loading: true,
  className: '',
  variant: 'default',
  children: '',
};

export default Header;
