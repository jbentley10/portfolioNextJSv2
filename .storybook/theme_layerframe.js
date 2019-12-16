/**
 * @file theme_frozen2.js
 * A custom Storybook configuration for Frozen 2.
 * @see https://storybook.js.org/docs/configurations/theming/
 */
import { create } from '@storybook/theming';

import brandImage from './logo.png'

export default create({
  base: 'light',

  // colorPrimary: '#4382F5',
  // colorSecondary: '#bad0ff',

  // UI
  // appBg: 'white',
  // appContentBg: 'linear-gradient(45deg, #2C42C0 50%, #389AFB 100%)',
  // appBorderColor: 'grey',
  // appBorderRadius: 4,

  // Typography
  fontBase: 'Helvetica, sans-serif',
  fontCode: 'monospace',

  // Text colors
  // textColor: '#4382F5',
  // textInverseColor: 'rgba(255,255,255,1)',

  // Toolbar default and active colors
  // barTextColor: 'silver',
  // barSelectedColor: 'black',
  // barBg: 'hotpink',

  // Form colors
  // inputBg: 'white',
  // inputBorder: 'silver',
  // inputTextColor: 'black',
  // inputBorderRadius: 4,

  brandTitle: 'Layerframe Storybook',
  brandUrl: 'https://theproject.spotify.com',
  brandImage: brandImage,
});
