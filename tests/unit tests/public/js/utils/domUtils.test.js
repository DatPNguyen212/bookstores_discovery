import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest'
import domUtils from '../../../../../public/js/utils/domUtils.js'

describe('domUtils.createElement()', () => {
  it('when you pass a non string in first param, it should throw an error', () => {
    const tagName = 1
    const styleObj = {
      color: 'white',
    }

    const fn = () => {
      domUtils.createElement(tagName, styleObj)
    }

    expect(fn).toThrow('First parameter should be of string data type')
  })

  it('when you pass a non plain obj in second param, it should throw an error', () => {
    const tagName = 'h1'
    const styleObj = [1]

    const fn = () => {
      domUtils.createElement(tagName, styleObj)
    }

    expect(fn).toThrow('Second parameter should be a plain object')
  })
})
