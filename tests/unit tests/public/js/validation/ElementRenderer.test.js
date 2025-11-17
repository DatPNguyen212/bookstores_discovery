// @vitest-environment happy-dom
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest'
import ElementRenderer from '../../../../../public/js/validation/ElementRenderer.js'
import { Window } from 'happy-dom'
import { IS_ELEMENT_RENDERER_BASE_INSTANCE } from '../../../../../public/js/abstracts/validation/ElementRendererBase.js'

const window = new Window()
const document = window.document

vi.stubGlobal('document', document)

describe('ElementRenderer', () => {
  it('when you create an instance using consturctor, it should contain property that checks instance of ElementRendererBase', () => {
    const result = new ElementRenderer()

    expect(result[IS_ELEMENT_RENDERER_BASE_INSTANCE]).toBe(true)
  })
  describe('elementRenderer.createTextElement()', () => {
    let elementRenderer
    beforeEach(() => {
      document.innerHTML = ''
      elementRenderer = new ElementRenderer()
    })

    it('when you pass text and options, it should return an element with correct text and attributes values', () => {
      const text = 'test'
      const options = {
        tagName: 'div',
        class: 'test-class',
        id: 'test-id',
        style: {
          color: 'red',
        },
      }

      const newElement = elementRenderer.createTextElement(text, options)

      expect(newElement.textContent).toBe(text)
      expect(newElement.tagName).toBe(options.tagName.toUpperCase())
      expect(newElement.classList).toContain(options.class)
      expect(newElement.id).toBe(options.id)
      expect(newElement.style.color).toBe(options.style.color)
    })

    it("when you don't pass string data type in first param, it should throw an error", () => {
      const fn = () => {
        elementRenderer.createTextElement()
      }

      expect(fn).toThrow('First parameter needs to be of string data type')
    })

    it('when pass a non plain obj to 2nd param, it should throw an error', () => {
      const text = 'test'
      const options = 3

      const fn = () => {
        elementRenderer.createTextElement(text, options)
      }

      expect(fn).toThrow(
        'You need to pass plain obj that contains tagName and style properties'
      )
    })

    it('when you pass a plain obj that does not contain tagName property, it should throw an error', () => {
      const text = 'test'
      const options = {
        style: {
          color: 'red',
          fontSize: '16px',
        },
      }

      const fn = () => {
        elementRenderer.createTextElement(text, options)
      }

      expect(fn).toThrow(
        'You need to pass plain obj that contains tagName and style properties'
      )
    })

    it('when you pass a plain obj that does not contain style property, it should throw an error', () => {
      const text = 'test'
      const options = {
        tagName: 'div',
      }

      const fn = () => {
        elementRenderer.createTextElement(text, options)
      }

      expect(fn).toThrow(
        'You need to pass plain obj that contains tagName and style properties'
      )
    })

    it("if you don't pass an option obj, it should return an element with default attribute values", () => {
      const text = 'test'

      const newElement = elementRenderer.createTextElement(text)

      expect(newElement.tagName).toBe('DIV')
      expect(newElement.classList.length).toBe(0)
      expect(newElement.id).toBe('undefined')
      expect(newElement.style.color).toBe('black')
      expect(newElement.style.fontSize).toBe('16px')
    })

    it("if you pass a style property that doens't exist, it should throw an error", () => {
      const text = 'test'
      const options = {
        tagName: 'div',
        style: {
          incorrectProperty: '3',
          color: 'red',
        },
      }

      const fn = () => {
        elementRenderer.createTextElement(text, options)
      }

      expect(fn).toThrow('incorrectProperty is not a valid style property')
    })
  })
})
