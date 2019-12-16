# Layerframe NextJS App Template
> This template is setup to quickly allow an engineer to start a new Github web app repository containing the Layerframe best practices with NextJS.

# Configuration
1. Configure the following in `package.json`
```
"scripts": {
    ...
    "deploy-staging": "gcloud app deploy app.staging.yaml --project MYSITE-staging",
    "deploy-production": "gcloud app deploy app.yaml --project MYSITE",
    ...
}
```
1. Setup any environment variables required inside of `app.yaml`, `app.staging.yaml` and `next.config.js`.
1. Configure the `tailwind.config.js` to meet your needs.

# Getting started

1. Run `yarn` to install node modules
1. Run `yarn run dev` to boot the NextJS app.

# Client

## Styling
> The app uses the built in [`styled-jsx`](https://github.com/zeit/styled-jsx) tools along with [`tailwindcss`](https://tailwindcss.com/). When it comes to styling with `styled-jsx` it's important to understand how [global styles](https://github.com/zeit/styled-jsx#targeting-the-root) work.

### Tailwind CSS
See <https://tailwindcss.com/docs/using-with-preprocessors/> for more details about how this is implemented.

## Animations
> The components in this app depend heavily on [framer-motion](https://framer.com/api/motion/). See below for what each of these is used for.

### TODO: Add more details here.

## Scaffolding
> This project uses gulp as a task runner to handle scaffolding components in the app. See the `gulpfile.js`, `package.json` and the `bin` folder for more.

Scaffolding makes it easy to build consistent components that contain [Stories](https://storybook.js.org/) and [tests](https://jestjs.io/) for the application.

### Adding a component

To build a component, run the following command.

1. `yarn component Test`

You'll see that the component is built based on the scaffold items found inside of `bin/scaffolding/stateless-component`. Note: `stateless-component` is connected via the file `bin/scaffold-component.js`.

# Gulp / Development Configuration
> Gulp is being used for scaffolding only. Basically, when you run `yarn component MyNewComponent` it runs a gulp script. See `package.json` for more.

# Server

## Adding an endpoint (Fetching content from external services)
> This project is full customizable to accept data from various external API services. See the `app.yaml` for where to add Google Cloud Platform environment variables for these services (You'll see a stub example `PRISMIC_API_URL` since this is a common one used.).

To add an endpoint you'll need to update the `pages/api/constants` file with the endpoint url. You can then create a folder inside of `pages/api` that the components can use e.g. `pages/api/nav`. See the `pages/api/nav` api endpoint as an example.

## Deploying to Google App Engine

To deploy you can do the following:

1. Run `gcloud deploy` or `gcloud deploy-staging`

## app.yaml and app.staging.yaml
> This is the main configuration files for Google App Engine. See more at <https://cloud.google.com/appengine/docs/standard/nodejs/config/appref>

## Cloudbuild
> You'll notice in the `package.json`, there is a script like this `"gcp-build": "next build"`. This is fired via the `cloudbuild.yaml` and `cloudbuild.staging.yaml` file in the root.

### Note: In your staging cloudbuild instance, you'll need to set it to read from cloudbuild.staging.yaml. I think via trigger options.

# Prismic (if used)
> Prismic is a headless CMS that we're using to handle localizations, images and scheduling content updates. Please familiarize yourself with the docs to understand how it works.

The repo url is https://YOUR_PROJECT.prismic.io and you can get access by asking for an invite or logging into an existing user.

- [Prismic Content Modeling Docs](https://prismic.io/concepts/content-modeling/introduction-to-content-modeling)
- [Prismic GraphQL Docs](https://prismic.io/docs/graphql/query-the-api/query-the-graphql-api)
- [Prismic Webhook Docs](https://user-guides.prismic.io/webhooks/webhooks)
- [Testing Webooks](https://webhook.site)


# Wordpress / Headless-CMS setup (if used)
> This wordpress is implemented as a headless-CMS setup. Basically, we're only using it for API calls from the NextJS client-side application running on Google Cloud Platform.

# GraphQL

The following tools have been installed on Wordpress to make life easier.

## Plugins

### GraphQL
The following were cloned, zipped and manually installed via the Wordpress admin interface.
- [GraphiQL IDE](https://github.com/wp-graphql/wp-graphiql) - IDE Plugin for WPGraphiQL
- [WPGraphQL](https://github.com/wp-graphql/wp-graphql)

### Custom Post Types
- [TODO]


# Storybook
> This project uses [storybook](https://storybook.js.org/) for component review. You can get this started via the following commands.

1. Run `yarn storybook`
1. Navigate to `http://localhost:6006/` (This should open automatically if compilation succeeds)

Storybook configuration is located in `.storybook/config.js`.

This storybook has also already been preconfigured to load tachyons and other global CSS styles that are used within the `<Head>` tag of the `<Layout>` component. See <https://github.com/jide/react-storybook/blob/master/docs/setting-up-for-css.md> and <https://storybook.js.org/docs/configurations/add-custom-head-tags/> for more information about this setup.

> WARNING: If a new script of style tag is added to the Layout file, this will also need to be added to the `.storybook/preview-head.html` file.

## Storybook add-ons

There are quite a few [Storybook add-ons](https://storybook.js.org/addons/) available to meet your needs. These can be added via the `.storybook/addons.js` file.


# Appendix

- [Strategies for loading custom fonts in NextJS](https://spectrum.chat/next-js/general/whats-your-guys-strategies-for-loading-custom-fonts-in-next~1a333ee0-0282-4925-849f-ca02df429ee3)
- [jest example fails with `next/link`](https://github.com/zeit/next.js/issues/1827)
- [How to get current logged in user using Wordpress Rest Api?](https://stackoverflow.com/questions/42381521/how-to-get-current-logged-in-user-using-wordpress-rest-api)
