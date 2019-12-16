/**
 * Error404.jsx
 */
import React from 'react';
// import generateProps from 'react-generate-props'

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';

// Mocks/Utils
import { StorybookRouter } from '../../mocks/next/router'

// Component(s)
import Error404 from './Error404';

// Styles
const styles = {
  marginTop: '10%',
  textAlign: 'center',
};

// Generate some stub properties
// generateProps.init()
// const props = generateProps(Error404);

// Decorators
const CenterDecorator = storyFn => (
  <div style={styles}>
    { storyFn() }
  </div>
);

const RouterDecorator = (storyFn) => (
  <StorybookRouter>{storyFn()}</StorybookRouter>
)
storiesOf('Error404', module)
  .addDecorator(RouterDecorator)
  .addDecorator(CenterDecorator)
  .add('with required props', () => (
    <Error404 />
  ));
