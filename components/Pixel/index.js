/**
 * index.js
 * Handles applying pixels and tracking tags.
 */
import React from 'react'
import Head from 'next/head'

import FacebookPixel from './FacebookPixel.jsx'

export default ({name, id}) => {
  return(
    <Head>
      {name === 'Facebook' && <FacebookPixel id={id} />}
    </Head>
  )
}
