/**
 * Header.jsx
 */
import * as React from 'react'

import { StorybookRouter } from '../../mocks/next/router'

import { storiesOf, addDecorator } from '@storybook/react'
import { linkTo } from '@storybook/addon-links'
import { action } from '@storybook/addon-actions'

// Component(s)
import Header from '../../components/Header'

// Styles
// const styles = {
//   marginTop: '10%',
//   textAlign: 'center',
// };

// Generate some stub properties
const props = {}

// Decorators
// const CenterDecorator = storyFn => (
//   <div style={styles}>
//     { storyFn() }
//   </div>
// );

const RouterDecorator = (storyFn) => (
  <StorybookRouter>{storyFn()}</StorybookRouter>
)

storiesOf('Header', module)
  .addDecorator(RouterDecorator)
  // .addDecorator(CenterDecorator)
  .add('with required props', () => (
    <div>TEST</div>
  ));
