/**
 * Custom error handler
 * @file _error.js
 * @see https://nextjs.org/docs#custom-error-handling
 */
import React from 'react'

// Local components
import CommonLayout from '../layouts/CommonLayout'
import Error404 from '../errors/Error404'
import Error500 from '../errors/Error500'
import ErrorOther from '../errors/ErrorOther'

// Styles
import '../styles/styles.scss'

const Error = ({
    statusCode,
    loading,
  }) => {

  let errorToRender = <ErrorOther statusCode={statusCode} />
  let errorPageTitle = 'An unknown error occured'
  switch (parseInt(statusCode, 10)) {
    case 404:
      errorPageTitle = 'You found the void.'
      errorToRender = <Error404 />
      break
    case 500:
      errorPageTitle = 'OMG! 01010010 I feel weird inside.'
      errorToRender = <Error500 />
      break
    default:
      errorPageTitle = 'This should have never happened. Really? Why?'
      errorToRender = <ErrorOther statusCode={statusCode} />
      break
  }

  return (
    <CommonLayout
      loading={loading}
      pageTitle={errorPageTitle}
    >
      { errorToRender }
    </CommonLayout>
  )

}

Error.getInitialProps = async function ({ req, res, err }) {
  // Get the status code
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404

  return {
    statusCode,
    loading: false,
  }
}

export default Error
