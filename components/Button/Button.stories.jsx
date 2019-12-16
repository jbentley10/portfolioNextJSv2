/**
 * Button.jsx
 */
import React from 'react';
// import generateProps from 'react-generate-props'

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';

// Mocks/Utils
import { StorybookRouter } from '../../mocks/next/router'

// Component(s)
import Button from './Button';

// Styles
const styles = {
  marginTop: '10%',
  textAlign: 'center',
};

// Generate some stub properties
// generateProps.init()
// const props = generateProps(Button);

// Decorators
const CenterDecorator = storyFn => (
  <div style={styles}>
    { storyFn() }
  </div>
);

const RouterDecorator = (storyFn) => (
  <StorybookRouter>{storyFn()}</StorybookRouter>
)
storiesOf('Button', module)
  .addDecorator(RouterDecorator)
  .addDecorator(CenterDecorator)
  .add('with required props', () => (
    <Button />
  ));
