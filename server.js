/**
 * @file server.js
 * The following is a custom add-on to the NextJS server implementation that
 * allows us to fetch locale data from Google App Engine.
 * @see https://github.com/zeit/next.js/tree/master/examples/custom-server-express
 */
const express = require('express')
const next = require('next')
const compression = require('compression')

/*
  Note: process.env.NODE_ENV is automatically set by GAE  when deployed
  but will need to be manually set locally via `NODE_ENV=production npm run start`
*/
const dev = process.env.NODE_ENV !== 'production';

// Setup NextJs app handler
const app = next({ dev });
const handle = app.getRequestHandler();

// GAE passes the port the app will run on via process.env.PORT
const port = process.env.PORT ? process.env.PORT : 3000;

app
  .prepare()
  .then(() => {
    const server = express()
    server.use(compression())

    // Splash page config 
    // Handles routing all requests to page set in app.render.
    // server.get('*', (req, res) => {
    //   app.render(req, res, '/splash')
    // })

    // Force www
    // server.use((req, res, next) {
    //   if (req.host.indexOf("www.") !== 0) {
    //     res.redirect(301, req.protocol + "://www." + req.host + ":80" + req.originalUrl);
    //   } else {
    //     next();
    //   }
    // })

    // Force non-www
    // server.use(function (req, res, next) {
    //   var str = "www.";
    //   if (req.host.indexOf(str) === 0) {
    //     res.redirect(301, req.protocol + "://" + req.host.slice(str.length) + req.originalUrl)
    //   } else {
    //     next()
    //   }
    // })

    server.get('/start', (req, res) => {
      app.render(req, res, '/')
    })

  /**
   * @route *
   * Note: We're using Next.Js 9's file based dynamic routing so no need to match dynamic urls as in version
   */
    server.get('*', (req, res) => {
      // console.log(req.originalUrl, 'is being passed along to NextJS handler.')
      // Pass the request along to the NextJs handler
      return handle(req, res)
    })

    server.listen(port, err => {
      if (err) throw err;
      console.log(
        `> Ready on ${process.env.NODE_ENV === 'production' ? 'https' : 'http'}://localhost:${port} NODE_ENV: ${process.env.NODE_ENV}`
      );
    });
  })
  .catch(ex => {
    console.error(ex.stack);
    process.exit(1);
  });
