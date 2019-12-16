/**
 * @file Header.test.jsx
 * @url https://devhints.io/enzyme
 * @url https://github.com/airbnb/enzyme/blob/master/docs/guides/jest.md
 */
import * as React from 'react'
import { shallow, mount, render } from 'enzyme'
import Header from './Header.jsx'

describe('components', () => {
  describe('Header', () => {
    it('should mount with props', function () {
      const wrap = mount(<Header>Hello World</Header>)

      const expectedProps = {
        children: 'Hello World',
        tagName: 'header',
        className: '',
        variant: 'default'
      }

      expect(wrap.props()).toEqual(expectedProps)
    })

    it('should render as type and with content', function () {
      const wrap = render(<Header>Hello World</Header>)

      expect(wrap[0].type).toEqual('tag')
      expect(wrap[0].name).toEqual('header')
      // contain styles
      expect(wrap[0].attribs.class).toContain('header')

      // contain text
      expect(wrap[0].children[0].type).toBe('text')
      expect(wrap[0].children[0].data).toBe('Hello World')

      // check for jsx styles
      expect(wrap[0].children[1].type).toBe('style')
    })
  })
})
