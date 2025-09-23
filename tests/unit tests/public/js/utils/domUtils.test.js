// @vitest-environment happy-dom
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest'
import domUtils from '../../../../../public/js/utils/domUtils.js'
import { Window } from 'happy-dom'
import objectUtils from '../../../../../utils/objectUtils.js'

const window = new Window()
const document = window.document

vi.stubGlobal('document', document)

describe('domUtils.createElement()', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('when you pass a tagName string and an object containing style properties that the newly created element to have, the newElement returned should have those styles', () => {
    const tagName = 'h1'
    const styleObj = {
      color: 'white',
      background: 'black',
      fontSize: '16px',
    }

    const newElement = domUtils.createElement(tagName, styleObj)

    expect(newElement.style.color).toBe('white')
    expect(newElement.style.background).toBe('black')
    expect(newElement.style.fontSize).toBe('16px')
  })

  it('when you pass a tag string and the style object, the newElement returned should be of the tag you specified', () => {
    const tagName = 'h1'
    const styleObj = {
      color: 'white',
    }

    const newElement = domUtils.createElement(tagName, styleObj)

    expect(newElement.tagName).toBe(tagName.toUpperCase())
  })

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
