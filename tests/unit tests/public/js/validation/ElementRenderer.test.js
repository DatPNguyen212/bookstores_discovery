// @vitest-environment happy-dom
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest'
import ElementRenderer from '../../../../../public/js/validation/ElementRenderer.js'
import { Window } from 'happy-dom'
import { IS_ELEMENT_RENDERER_BASE_INSTANCE } from '../../../../../public/js/abstracts/validation/ElementRendererBase.js'
import OptionsJoiSchema from '../../../../../public/js/joi/OptionsJoiSchema.js'
import Joi from 'joi'
import SchemaAdapterBase, {
  IS_SCHEMA_ADAPTER_BASE_INSTANCE,
} from '../../../../../public/js/abstracts/joi/SchemaAdataperBase.js'

const window = new Window()
const document = window.document

vi.stubGlobal('document', document)

describe('ElementRenderer', () => {
  let elementRenderer
  let optionsSchema
  beforeEach(() => {
    document.body.innerHTML = ''
    optionsSchema = new OptionsJoiSchema()
    elementRenderer = new ElementRenderer(optionsSchema)
  })

  it('when you pass a non instance of SchemaAdapterBase, it should throw an error', () => {
    const optionsSchema = 3

    const fn = () => {
      new ElementRenderer(optionsSchema)
    }

    expect(fn).toThrow(
      'You need to pass an instance of SchemaAdapterBase to 1st parameter'
    )
  })

  it('when you pass valid optionsSchema to constructor, new instance should contain a property that stores the optionsSchema, and a property that checks instance of ElementRendererBase', () => {
    const result = new ElementRenderer(optionsSchema)

    expect(result.optionsSchema).toEqual(optionsSchema)
    expect(result[IS_ELEMENT_RENDERER_BASE_INSTANCE]).toBe(true)
  })

  describe('elementRenderer.createTextElement()', () => {
    let optionsSchemaMock
    let elementRenderer

    beforeEach(() => {
      class OptionsSchemaMock extends SchemaAdapterBase {
        constructor() {
          super()
        }

        validate = vi.fn().mockReturnValue(null)
      }

      optionsSchemaMock = new OptionsSchemaMock()

      elementRenderer = new ElementRenderer(optionsSchemaMock)
    })

    it('when you pass valid text and options, it should return an element with correct text and attributes values', () => {
      const text = 'test'
      const options = {
        tagName: 'div',
        class: 'testClass1 testClass2',
        id: 'testId',
        style: {
          color: 'red',
        },
      }

      const newElement = elementRenderer.createTextElement(text, options)

      expect(newElement.textContent).toBe(text)
      expect(newElement.tagName).toBe(options.tagName.toUpperCase())
      expect(newElement.classList.contains('testClass1')).toBe(true)
      expect(newElement.classList.contains('testClass2')).toBe(true)
      expect(newElement.id).toBe('testId')
      expect(newElement.style.color).toBe(options.style.color)
    })

    it("when you don't pass string data type in first param, it should throw an error", () => {
      const fn = () => {
        elementRenderer.createTextElement()
      }

      expect(fn).toThrow('First parameter needs to be of string data type')
    })

    // it('when pass a non plain obj to 2nd param, it should throw an error', () => {
    //   const text = 'test'
    //   const options = []

    //   const fn = () => {
    //     elementRenderer.createTextElement(text, options)
    //   }

    //   expect(fn).toThrow('You need to pass plain obj to second parameter')
    // })

    // it('when you pass options.tagName that is not string data type, it should throw an error', () => {
    //   const text = 'test'
    //   const options = {
    //     tagName: 3,
    //   }

    //   const fn = () => {
    //     elementRenderer.createTextElement(text, options)
    //   }

    //   expect(fn).toThrow('options.tagName needs to be of string data type')
    // })

    // it('when you pass options.class that is not string data type, it should throw an error', () => {
    //   const text = 'test'
    //   const options = {
    //     tagName: 'div',
    //     class: 3,
    //   }

    //   const fn = () => {
    //     elementRenderer.createTextElement(text, options)
    //   }

    //   expect(fn).toThrow('options.class needs to be of string data type')
    // })

    // it('when you pass options.id that is not string data type, it should throw an error', () => {
    //   const text = 'test'
    //   const options = {
    //     tagName: 'div',
    //     class: 'testClass',
    //     id: 3,
    //   }

    //   const fn = () => {
    //     elementRenderer.createTextElement(text, options)
    //   }

    //   expect(fn).toThrow('options.id needs to be of string data type')
    // })

    it('given optionsSchemaMock.validate() returns a mocked Error instance and optionsSchemaMock is passed to ElementRenderer, instance method should throw that mocked Error instance', () => {
      const errorMock = new Error('test')
      class OptionsSchemaMock extends SchemaAdapterBase {
        constructor() {
          super()
        }

        validate = vi.fn().mockReturnValue(errorMock)
      }

      const optionsSchemaMock = new OptionsSchemaMock()

      const elementRenderer = new ElementRenderer(optionsSchemaMock)

      const text = 'test'
      const options = {
        tagName: 3,
      }

      const fn = () => {
        const result = elementRenderer.createTextElement(text, options)
      }

      expect(fn).toThrowError(errorMock)
    })

    it('when you pass options obj with missing tagName, it should return an element with correct default div tagName, styles, class, id you specified and text', () => {
      const text = 'test'
      const options = {
        class: 'testClass',
        id: 'testId',
        style: {
          color: 'purple',
          fontSize: '18px',
        },
      }

      const result = elementRenderer.createTextElement(text, options)

      expect(result.tagName).toBe('DIV')
      expect(result.classList.contains('testClass')).toBe(true)
      expect(result.id).toBe('testId')
      expect(result.style.color).toBe('purple')
      expect(result.style.fontSize).toBe('18px')
      expect(result.innerText).toBe(text)
    })

    it('when you pass options obj with missing style property, it should return an element with correct tagName, class, id, text and default styles', () => {
      const text = 'test'
      const options = {
        tagName: 'div',
        class: 'testClass',
        id: 'testId',
      }

      const result = elementRenderer.createTextElement(text, options)

      expect(result.tagName).toBe('DIV')
      expect(result.style.color).toBe('black')
      expect(result.classList.contains('testClass')).toBe(true)
      expect(result.id).toBe('testId')
      expect(result.style.fontSize).toBe('16px')
      expect(result.innerText).toBe(text)
    })

    it('when you pass options obj with missing style.color property, it should return an element with correct tagName, text, class, id, other styles and default color', () => {
      const text = 'test'
      const options = {
        tagName: 'div',
        class: 'testClass',
        id: 'testId',
        style: {
          fontSize: '18px',
        },
      }

      const result = elementRenderer.createTextElement(text, options)

      expect(result.tagName).toBe('DIV')
      expect(result.classList.contains('testClass')).toBe(true)
      expect(result.id).toBe('testId')
      expect(result.style.color).toBe('black')
      expect(result.style.fontSize).toBe('18px')
      expect(result.innerText).toBe(text)
    })

    it('when you pass options obj with missing style.fontSize property, it should return an element with correct tagName, text,class, id, other styles and default fontSize', () => {
      const text = 'test'
      const options = {
        tagName: 'div',
        class: 'testClass',
        id: 'testId',
        style: {
          color: 'purple',
        },
      }

      const result = elementRenderer.createTextElement(text, options)

      expect(result.tagName).toBe('DIV')
      expect(result.classList.contains('testClass')).toBe(true)
      expect(result.id).toBe('testId')
      expect(result.style.color).toBe('purple')
      expect(result.style.fontSize).toBe('16px')
      expect(result.innerText).toBe(text)
    })

    it('if you pass an empty plain obj, it should return an element with default tagName, color, fontSize and correct text', () => {
      const text = 'test'
      const options = {}

      const newElement = elementRenderer.createTextElement(text, options)

      expect(newElement.tagName).toBe('DIV')
      expect(newElement.style.color).toBe('black')
      expect(newElement.style.fontSize).toBe('16px')
      expect(newElement.innerText).toBe(text)
    })

    it("if you pass a style property that doens't exist, it should throw an error", () => {
      const text = 'test'
      const options = {
        tagName: 'div',
        class: 'testClass',
        id: 'testId',
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
