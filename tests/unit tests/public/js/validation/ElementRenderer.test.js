// @vitest-environment happy-dom
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest'
import ElementRenderer from '../../../../../public/js/validation/ElementRenderer.js'
import { Window } from 'happy-dom'
import { IS_ELEMENT_RENDERER_BASE_INSTANCE } from '../../../../../public/js/abstracts/validation/ElementRendererBase.js'
import CreateTextOptsSchema from '../../../../../public/js/validation/CreateTextOptsSchema.js'
import Joi from 'joi'
import SchemaAdapterBase, {
  IS_SCHEMA_ADAPTER_BASE_INSTANCE,
} from '../../../../../public/js/abstracts/validation/SchemaAdataperBase.js'
import ObjArgValidator from '../../../../../public/js/validation/objArgValidator.js'
import ObjArgValidatorBase from '../../../../../public/js/abstracts/validation/ObjArgValidatorBase.js'

const window = new Window()
const document = window.document

vi.stubGlobal('document', document)

describe('ElementRenderer', () => {
  class ObjArgValidatorMock extends ObjArgValidatorBase {
    constructor() {
      super()
    }
  }

  let resultMock
  let objArgValidatorMock
  let elementRenderer

  beforeEach(() => {
    document.body.innerHTML = ''

    objArgValidatorMock = new ObjArgValidatorMock()

    resultMock = {
      error: undefined,
    }

    objArgValidatorMock.options = {
      validate: vi.fn(function () {
        return resultMock
      }),
    }

    elementRenderer = new ElementRenderer(objArgValidatorMock)
  })

  it('when you pass a non instance of ObjArgValidatorBase to constructor, it should throw an error', () => {
    const objArgValidator = 3

    const fn = () => {
      const elementRenderer = new ElementRenderer(objArgValidator)
    }

    expect(fn).toThrow(
      'You need to pass instance of ObjArgValidatorBase to constructor'
    )
  })

  it('when you pass valid objArgValidator to constructor, new instance should correctly store it in property', () => {
    const result = new ElementRenderer(objArgValidatorMock)

    expect(result.objArgValidator).toEqual(objArgValidatorMock)
  })

  describe('elementRenderer.createTextElement()', () => {
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

    it('given objArgValidator.options.validate() is mocked, when you pass text and options, it should call objArgValidator.validate() with options', () => {
      const text = 'test'
      const options = {
        tagName: 'test',
      }

      const result = elementRenderer.createTextElement(text, options)

      expect(objArgValidatorMock.options.validate).toBeCalledWith(options)
    })

    it('given objArgValidator.options.validate() returns resultMock with a mocked error, when pass text and options, it should throw that error', () => {
      const errorMock = new Error('test')
      resultMock = {
        error: errorMock,
      }

      const text = 'test'
      const options = 3

      const fn = () => {
        elementRenderer.createTextElement(text, options)
      }

      expect(fn).toThrowError(errorMock)
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
