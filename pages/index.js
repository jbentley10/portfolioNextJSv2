import React, { useState } from 'react'
import Link from 'next/link'

// Services
import request from '../services/request'

// Local components
import Layout from '../layouts/LandingLayout'

// The props are set via the getInitialProps function below.
const Home = ({ loading }) => {
  return (
    <Layout>
      <div className='hero mx-auto tc'>
        <h1 className='heading flex flex-col text-center justify-center w-full text-2xl relative'>
          Welcome to Layerframe Next.js app!
        </h1>
        <p className='subheading text-xl text-center justify-center w-full'>
          To get started, edit <code>pages/index.js</code> and save to reload.
        </p>

        <div className='flex items-center w-full'>
          <Link href='https://github.com/zeit/next.js#setup'>
            <a className='w-1/3'>
              <h3>Getting Started &rarr;</h3>
              <p>Learn more about Next.js on GitHub and in their examples.</p>
            </a>
          </Link>
          <Link href='https://github.com/zeit/next.js/tree/master/examples'>
            <a className='w-1/3'>
              <h3>Examples &rarr;</h3>
              <p>Find other example boilerplates on the Next.js GitHub.</p>
            </a>
          </Link>
          <Link href='https://github.com/zeit/next.js'>
            <a className='w-1/3'>
              <h3>Create Next App &rarr;</h3>
              <p>Was this tool helpful? Let us know how we can improve it!</p>
            </a>
          </Link>
        </div>
      </div>
      <style jsx>{`
          /* Note: Styles specific to the index */
      `}</style>
    </Layout>
  )
}

{/*
  Example of fetching data from an external service.

  Note:

  The following is actually hitting the NextJS Server url /api/nav

  You'll see inside of api/nav/index.js this file allows you to update
  the external endpoint. This minimizes the amount of updates internal to the
  client-side code, allowing us to update in a single place on the server-side.

*/}
Home.getInitialProps = async function() {
  // const navData = await request.api(req, 'nav')
  // const navLinks = navData.map(item => {
  //   return ({
  //     id: item.id,
  //     href: `/${item.slug.toLowerCase()}`,
  //     title: item.title
  //   })
  // })
  // console.log('Navigation Links', navLinks)

  console.log('Finished loading content for landing page.')
  return {
    loading: false
  }
}

export default Home
